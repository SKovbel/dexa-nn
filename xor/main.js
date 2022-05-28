class Main {
    train1 = [
        {inputs: [0,0], outputs: [0]},
        {inputs: [0,1], outputs: [1]},
        {inputs: [1,0], outputs: [1]},
        {inputs: [1,1], outputs: [0]}
    ];
    train2 = [
        {inputs: [0,0,0], outputs: [0]},
        {inputs: [0,0,1], outputs: [1]},
        {inputs: [0,1,0], outputs: [1]},
        {inputs: [0,1,1], outputs: [0]},
        {inputs: [1,0,0], outputs: [1]},
        {inputs: [1,0,1], outputs: [0]},
        {inputs: [1,1,0], outputs: [0]},
        {inputs: [1,1,1], outputs: [1]},
    ];
    start1() {
        const nn = new NeuralNetwork([
            {count: 2, activation: NeuralNetworkActivation.SIGMOID},
            {count: 3, activation: NeuralNetworkActivation.SIGMOID},
            {count: 1},
        ]);
        const e = NeuralNetworkBackPropagation.train(nn, this.train1, 0.01, 0.0001, 100000);
        console.log('Epoch: ' + e);
        for (let t = 0; t < this.train1.length; t++) {
            console.log(NeuralNetwork.feedforward(nn, this.train1[t].inputs));
        }
    }

    start2() {
        const nn = new NeuralNetwork([
            {count: 3, activation: NeuralNetworkActivation.SIGMOID},
            {count: 3, activation: NeuralNetworkActivation.SIGMOID},
            {count: 3, activation: NeuralNetworkActivation.TANH},
            {count: 1},
        ]);

        // prepare train
        let newTrain = [];
        for (let i = 0; i < this.train2.length ; i++) {
            if (i == 1 || i == 5) continue;
            newTrain.push(this.train2[i]);
        }

        // train
        NeuralNetworkBackPropagation.train(nn, newTrain, 0.1, 0.000001, 1000000);

        // check
        for (let t = 0; t < this.train2.length; t++) {
            console.log(NeuralNetwork.feedforward(nn, this.train2[t].inputs));
        }
    }
}

const main = new Main(
    document.getElementById('board-canvas'),
    document.getElementById('network-canvas')
);
main.start2();
