class NetworkEngine {
    static nnName = 'tic-tac-toe';

    constructor(mutation = 0) {
        this.code = 'network';
        this.mutation = mutation;
        this.nn = new NeuralNetwork([
            {size: 10, activation: NeuralNetworkActivation.RELU},
            {size: 36, activation: NeuralNetworkActivation.RELU},
            {size: 36, activation: NeuralNetworkActivation.SIGMOID},
            {size: 9}
        ]);
        this.loadNN();
    }

    move(game) {
        const data = [ ...game.fields, game.who];
        const outputs = NeuralNetwork.feedforward(this.nn, data);
        for (let i = 0; i < outputs.length; i++) {
            if (game.fields[i] != 0) {
                outputs[i] = 0;
            }
        }
        return outputs.findIndex(v=>v==Math.max(...outputs));
    }

    loadNN(i) {
        if (localStorage.getItem(NetworkEngine.nnName)) {
            this.nn = NeuralNetwork.load(
                JSON.parse(localStorage.getItem(NetworkEngine.nnName)), 
                this.mutation
            );
        }
    }

    saveNN() {
        localStorage.setItem(NetworkEngine.nnName, JSON.stringify(this.nn));
    }

    discardNN() {
        localStorage.removeItem(NetworkEngine.nnName);
    }
}
