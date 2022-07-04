class NetworkEngine {
    static nnName = 'nn-tic-tac-toe';

    constructor(mutation = 0) {
        this.mutation = mutation;
        this.nn = new NeuralNetwork([
            {size: 10, activation: NeuralNetworkActivation.SIGMOID},
            {size: 10, activation: NeuralNetworkActivation.SIGMOID},
            {size: 9}
        ]);
        this.loadNN();
    }

    code() {
        return 'network';
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

    loadNN(i) {
        if (localStorage.getItem(NetworkEngine.nnName)) {
            this.nn = NeuralNetworkTools.import(
                localStorage.getItem(NetworkEngine.nnName),
                this.mutation
            );
        }
    }

    saveNN() {
        const dataJson = NeuralNetworkTools.export(this.nn);
        localStorage.setItem(NetworkEngine.nnName, dataJson);
    }

    discardNN() {
        localStorage.removeItem(NetworkEngine.nnName);
    }
}
