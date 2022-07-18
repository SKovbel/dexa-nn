class NetworkEngine extends GameEngine {
    constructor() {
        super();
        this.code = 'network';
        const loaded = this.load(null);
        if (loaded) {
            this.nn = NeuralNetworkTool.import(loaded);
        } else {
            this.nn = new NeuralNetwork([
                {size: 9, activation: NeuralNetworkActivation.SIGMOID},
                {size: 36, activation: NeuralNetworkActivation.SIGMOID},
                {size: 36, activation: NeuralNetworkActivation.SIGMOID},
                {size: 9}
            ]);
        }
    }

    move(game) {
        let maxMove = -Infinity;
        let bestMove = null;
        const outputs = NeuralNetwork.forwardPropagate(this.nn, [...game.fields]);
        for (let i = 0; i < outputs.length; i++) {
            if (outputs[i] > maxMove && game.fields[i] == 0) {
                bestMove = i;
                maxMove = outputs[0]
            }
        }
        return bestMove;
    }

    train(data, learnRate = 0.01, minError = 0.1, maxEpoch = 10000) {
        const K = 0.9
        const WIN = 1;
        const DRW = 0;
        const LST = -1;

        for (let item of data) {
            const policyNN = NeuralNetworkTool.clone(this.nn);
            let [fields, histories] = item;

            let status = GameStatus.status(fields);

            let moveIdx = histories[histories.length - 1];
            let trains = [this.#prepareData([...fields], moveIdx, status)];
            NeuralNetworkTrain.train(this.nn, NeuralNetworkTrain.ADAM, trains, learnRate, minError, maxEpoch);
            fields[moveIdx] = 0;
            trains = [];

            for (let h = histories.length - 2, p = false; h >= 0; h--, p = !p) {
                let moveIdx = histories[h];
                let outputs = NeuralNetwork.forwardPropagate(policyNN, fields);
                if (p) { // calculates players X and O separatly
                    let reward = status >= 0 ? Math.max(...outputs) : Math.min(...outputs);
                    trains.push(this.#prepareData([...fields], moveIdx, reward));
                    NeuralNetworkTrain.train(this.nn, NeuralNetworkTrain.ADAM, trains, learnRate, minError, maxEpoch);
                    trains = []
                } else {
                    let reward = status < 0 ? Math.max(...outputs) : Math.min(...outputs)
                    //trains.push(this.#prepareData([...fields], moveIdx, reward));
                }
                fields[moveIdx] = 0;
            }
            this.save(NeuralNetworkTool.export(this.nn));
        }
    }

    #prepareData(fields, moveIdx, reward) {
        let outputs = NeuralNetwork.forwardPropagate(this.nn, fields);
        outputs = [...outputs];
        for (let i = 0; i < fields.length; i++) {
            outputs[i] = (fields[i] == 0) ? outputs[i] : 0;
        }
        outputs[moveIdx] = reward;
        return {
            'inputs': fields,
            'outputs': outputs
        };
    }
}
