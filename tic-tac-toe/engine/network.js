class NetworkEngine {
    static nnName = 'tic-tac-toe';

    constructor(mutation = 0) {
        this.code = 'network';
        this.mutation = mutation;
        this.nn = new NeuralNetwork([10, 20, 9]);
        this.loadNN();
    }

    move(fields, turn) {
        const data = [ ...fields, turn];
        const outputs = NeuralNetwork.feedforward(this.nn, data);
        for (let i = 0; i < outputs.length; i++) {
            if (fields[i] != 0) {
                outputs[i] = 0;
            }
        }
        return outputs.findIndex(v=>v==Math.max(...outputs));
    }

    loadNN() {
        if (localStorage.getItem(NetworkEngine.nnName)) {
            this.nn = JSON.parse(localStorage.getItem(NetworkEngine.nnName));
            if (this.mutation > 0) {
                NeuralNetwork.mutate(this.nn, this.mutation);
            }
        }
    }

    saveNN() {
        localStorage.setItem(NetworkEngine.nnName, JSON.stringify(this.nn));
    }

    discardNN() {
        localStorage.removeItem(NetworkEngine.nnName);
    }
}
