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

    train(data, rate = 0.001, maxEpoch = 1000) {
        const K = 0.9
        const WIN = 1;
        const DRW = 0;
        const LST = -1;
        console.log('~');
        console.log(data);

        // unique games only
        /*let uniq = {};
        for (let item of data) {
            uniq[String(item[0]) + String(item[1])] = item;
        }
        var data = Object.keys(uniq).map((key) => [Number(key), uniq[key]]);*/

        const policyNN = NeuralNetworkTool.clone(this.nn);
        for (let item of data) {
            let [fields, histories] = item;

            let status = GameStatus.status(fields);
            let rewardA = Math.abs(status) != 0 ? WIN : DRW; // last move win (if game status = -1 || 1) or draw (if 0). Last move can be as X as O
            let rewardB = Math.abs(status) != 0 ? LST : DRW; // prev move lost (if game status = -1 || 1) or draw

            let trains = [];
            for (let i = histories.length - 1, p = true; i >= 0; i--, p = !p) {
                let outputs = NeuralNetwork.forwardPropagate(policyNN, [...fields]);
                const gameValue = outputs[histories[i]]; //?
                if (p) { // calculates players X and O separatly
                    outputs[histories[i]] = rewardA;
                    rewardA = gameValue + K * (rewardA - gameValue);
                } else {
                    outputs[histories[i]] = rewardB;
                    rewardB = gameValue + K * (rewardB - gameValue);
                }

                trains.push({'inputs': [...fields], 'outputs': [...outputs]});
                fields[histories[i]] = 0;
            }
            NeuralNetworkTrain.train(this.nn, NeuralNetworkTrain.ADAM, trains, rate, 0.1, maxEpoch);
            this.save(NeuralNetworkTool.export(this.nn));
        }


        return
        const trainData = Object.keys(trains).map((k) => trains[k]);
        NeuralNetworkTrain.train(this.nn, NeuralNetworkTrain.SGD, trainData, 0.01, 0.1, 10000);
        this.save(NeuralNetworkTool.export(this.nn));

        return;
        while (trainData.length > 0) {
            const chunk = trainData.splice(0, 100);
            console.log(chunk);
            NeuralNetworkTrain.train(this.nn, NeuralNetworkTrain.SGD, chunk,   0.1, 0.1, 100000);
            this.save(this.nn);
        }
    }
}
