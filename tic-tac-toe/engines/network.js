class NetworkEngine extends GameEngine {
    constructor() {
        super();
        this.code = 'network';
        const loaded = this.load(null);
        if (loaded) {
            this.nn = NeuralNetworkTool.import(loaded);
        } else {
            this.nn = new NeuralNetwork([
                {size: 9, activation: NeuralNetworkActivation.LRELU},
                {size: 18, activation: NeuralNetworkActivation.SIGMOID},
                {size: 9}
            ]);
        }
    }

    move(game) {
        let outputs = NeuralNetwork.forwardPropagate(this.nn, [...game.fields]);
        outputs = this.removeIllegalMoves(game.fields, outputs);

        let bestIdx = null;
        for (let moveIdx = 0, bestVal = -Infinity; moveIdx < outputs.length; moveIdx++) {
            if (outputs[moveIdx] > bestVal) {
                bestIdx = moveIdx;
                bestVal = outputs[moveIdx];
            }
        }
        return bestIdx;
    }

    train(data, learnRate = 0.01, minError = 0.001, maxEpoch = 10000) {
        const K = 0.9;
        const WIN = 1;
        const DRW = 0.7;
        const LST = 0;

        for (let item of data) {
            const policyNN = NeuralNetworkTool.clone(this.nn);
            let [fields, histories] = item;

            let status = GameStatus.status(fields);
            let rewardA = Math.abs(status) != 0 ? WIN : DRW; // last move win (if game status = -1 || 1) or draw (if 0). Last move can be as X as O
            let rewardB = Math.abs(status) != 0 ? LST : DRW; // prev move lost (if game status = -1 || 1) or draw
    
            let trains = [];
            let outputs = new Array(9).fill(0);
            for (let h = histories.length - 1, playerX = true; h >= 0; h--, playerX = !playerX) {
                let moveIdx = histories[h];
                let moveValue = outputs[moveIdx];

                outputs = this.removeIllegalMoves(fields, outputs);
                if (playerX) { // calculates player X and 0 separatly
                    outputs[moveIdx] = rewardA;
                    rewardA = moveValue + K * (rewardA - moveValue);
                } else {
                    outputs[moveIdx] = rewardB;
                    rewardB = moveValue + K * (rewardB - moveValue);
                }

                fields[moveIdx] = 0;
                trains.push({'inputs': [...fields], 'outputs': outputs});
                //NeuralNetworkTrain.train(this.nn, NeuralNetworkTrain.ADAM, trains, learnRate, minError, maxEpoch);
                //trains = [];
                outputs = NeuralNetwork.forwardPropagate(policyNN, [...fields]);
            }
            NeuralNetworkTrain.train(this.nn, NeuralNetworkTrain.ADAM, trains, learnRate, minError, maxEpoch);
            this.save(NeuralNetworkTool.export(this.nn));
        }
    }

    removeIllegalMoves (fields, outputs) {
        for (let i = 0; i < fields.length; i++) {
            outputs[i] = (fields[i] == 0) ? outputs[i] : 0;
        }
        return outputs
    }
}
