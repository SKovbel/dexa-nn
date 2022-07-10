class NetworkEngine extends GameEngine {
    constructor() {
        super();
        this.code = 'network';
        const loaded = this.load(null);
        if (loaded) {
            this.nn = NeuralNetworkTools.import(loaded);
        } else {
            this.nn = new NeuralNetwork([
                {size: 9, activation: NeuralNetworkActivation.SIGMOID},
                {size: 9, activation: NeuralNetworkActivation.SIGMOID},
                {size: 9}
            ]);
        }
    }

    move(game) {
        let maxMove = -Infinity;
        let bestMove = null;
        const outputs = NeuralNetwork.feedforward(this.nn, [...game.fields]);
        for (let i = 0; i < outputs.length; i++) {
            if (outputs[i] > maxMove && game.fields[i] == 0) {
                bestMove = i;
                maxMove = outputs[0]
            }
        }
        return bestMove;
    }

    train(data) {
        const K = 0.9
        const WIN = 1;
        const DRW = 0;
        const LST = -1;

        let sameGames = {};
        for (let d = 0; d < data.length - 1; d++) {
            let fields = data[d][0];
            let histories = data[d][1];

            // unique games only
            let key = String(fields) + String(histories);
            if (key in sameGames) {
                continue;
            }
            sameGames[key] = 1;

            let status = GameStatus.status(fields);

            let rewardA = Math.abs(status) != 0 ? WIN : DRW; // last move win (if game status = -1 || 1) or draw (if 0). Last move can be as X as O
            let rewardB = Math.abs(status) != 0 ? LST : DRW; // prev move lost (if game status = -1 || 1) or draw

            let trains = [];
            const policyNN = NeuralNetworkTools.clone(this.nn);
            for (let i = histories.length - 1, p = true; i >= 0; i--, p = !p) {
                let outputs = NeuralNetwork.feedforward(policyNN, [...fields]);
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
            NeuralNetworkBackPropagation.train(this.nn, NeuralNetworkBackPropagation.SGD, trains, 0.00001, 0.1, 10000000000);
            this.save(NeuralNetworkTools.export(this.nn));
        }


        return
        const trainData = Object.keys(trains).map((k) => trains[k]);
        NeuralNetworkBackPropagation.train(this.nn, NeuralNetworkBackPropagation.SGD, trainData, 0.01, 0.1, 10000);
        this.save(NeuralNetworkTools.export(this.nn));

        return;
        while (trainData.length > 0) {
            const chunk = trainData.splice(0, 100);
            console.log(chunk);
            NeuralNetworkBackPropagation.train(this.nn, NeuralNetworkBackPropagation.SGD, chunk,   0.1, 0.1, 100000);
            this.save(this.nn);
        }
    }
}
