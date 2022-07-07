class NetworkEngine extends TicTacToeEngine {
    constructor() {
        super();
        this.code = 'network';
        const loaded = this.load(null);
        if (loaded) {
            this.nn = NeuralNetworkTools.import(loaded);
        } else {
            this.nn = new NeuralNetwork([
                {size: 9, activation: NeuralNetworkActivation.RELU},
                {size: 9, activation: NeuralNetworkActivation.RELU},
                {size: 9}
            ]);
        }
    }

    move(game) {
        const data = [ ...game.fields, game.turn];
        let maxMove = 0;
        let bestMove = -Infinity;
        for (let i = 0; i < data.length - 1; i++) {
            if (game.fields[i] != 0) {
                continue;
            }
            data[i] = game.turn();
            const outputs = NeuralNetwork.feedforward(this.nn, data);
            if (outputs[0] > maxMove) {
                bestMove = i;
                maxMove = outputs[0]
            }
            data[i] = 0;
        }
        return bestMove;
    }

    train(data) {
        const K = 0.9
        const WIN = 1;
        const DRW = 0;
        const LST = -1;

        let trains = [];
        let outputs = new Array(9).fill(0);
        for (let i = 0; i < data.length - 1; i++) {
            let fields = data[i][0];
            let history = data[i][1];
            let status = GameStatus.status(fields);
            let rewardA = Math.abs(status) != 0 ? WIN : DRW; // last move win (if game status = -1 || 1) or draw (if 0). Last move can be as X as O
            let rewardB = Math.abs(status) != 0 ? LST : DRW; // prev move lost (if game status = -1 || 1) or draw
            for (let i = history.length - 1, k = true; i >= 0; i--, k = !k) {
                const gameValue = 0;
                if (k) { // calculates X and O rewards separatly
                    outputs[history[i]] = rewardA;
                    trains[{'inputs': fields, 'outputs': outputs}];
                    rewardA = gameValue + K * (rewardA - gameValue);
                } else {
                    //trains[{'inputs': fields, 'outputs': rewardB}];
                    rewardB = gameValue + K * (rewardB - gameValue);
                }
                fields[history[i]] = 0;
                outputs[history[i]] = 0;
            }
        }

        NeuralNetworkBackPropagation.train(this.nn, NeuralNetworkBackPropagation.SGD, trains);
        this.save(this.nn);
    }
}
