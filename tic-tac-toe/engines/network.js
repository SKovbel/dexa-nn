class NetworkEngine extends GameEngine {
    constructor() {
        super();
        this.code = 'network-tic-tac-toe';
        this.networkTool = new NeuralNetworkTool();

        const loaded = this.load(null);
        if (loaded) {
            this.network = this.networkTool.import(loaded);
        } else {
            this.network = new NeuralNetwork({
                loss: NeuralNetworkLoss.MSE,
                train: NeuralNetworkTrain.SGDORG,
                layers: [
                    {inputSize: 9, activation: NeuralNetworkActivation.SIGMOID},
                    {inputSize: 18, activation: NeuralNetworkActivation.SIGMOID},
                    {inputSize: 18, activation: NeuralNetworkActivation.SIGMOID},
                    {inputSize: 9},
                ]
            });
        }
    }

    move(game) {
        let outputs = this.network.forwardPropagate([...game.fields]);
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

    train(data, learnRate = 0.1, minError = 0.1, maxEpoch = 10000) {
        const K = 0.9;
        const WIN = 1;
        const DRW = 0.7;
        const LST = 0;

        for (let item of data) {
            const policyNetwork = this.networkTool.clone(this.network);
            let [fields, histories] = item;

            let status = GameStatus.status(fields);
            let rewardA = Math.abs(status) != 0 ? WIN : DRW; // last move win (if game status = -1 || 1) or draw (if 0). Last move can be as X as O
            let rewardB = Math.abs(status) != 0 ? LST : DRW; // prev move lost (if game status = -1 || 1) or draw
    
            let trains = [];
            let outputs = new Array(9).fill(0);
            for (let h = histories.length - 1, playerX = true; h > 0; h--, playerX = !playerX) {
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
                //this.network.train(trains, {learn_rate: learnRate, min_error: minError, max_epoch: maxEpoch});
                //trains = [];
                outputs = policyNetwork.forwardPropagate([...fields]);
            }
            this.network.train(trains, {learn_rate: learnRate, min_error: minError, max_epoch: maxEpoch});
            this.save(this.networkTool.export(this.network));
        }
    }

    removeIllegalMoves (fields, outputs) {
        for (let i = 0; i < fields.length; i++) {
            outputs[i] = (fields[i] == 0) ? outputs[i] : 0;
        }
        return outputs
    }
}
