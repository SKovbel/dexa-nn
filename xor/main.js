class Main {
    trains = [
        {inputs: [0,0,0], outputs: [0], train: true},
        {inputs: [0,0,1], outputs: [1], train: false},
        {inputs: [0,1,0], outputs: [1], train: true},
        {inputs: [0,1,1], outputs: [0], train: true},
        {inputs: [1,0,0], outputs: [1], train: false},
        {inputs: [1,0,1], outputs: [0], train: true},
        {inputs: [1,1,0], outputs: [0], train: true},
        {inputs: [1,1,1], outputs: [1], train: true},
    ];

    constructor(contentElement, networkCanvas) {
        this.contentElement = contentElement;
        this.networkCanvas = networkCanvas;
    }

    start() {
        const network = new NeuralNetwork([
            {size: 3, activation: NeuralNetworkActivation.RELU},
            {size: 3, activation: NeuralNetworkActivation.TANH},
            {size: 3, activation: NeuralNetworkActivation.SOFTMAX},
            {size: 3, activation: NeuralNetworkActivation.SIGMOID},
            {size: 1},
        ]);

        // prepare train
        let newTrains = [];
        for (let i = 0; i < this.trains.length ; i++) {
            if (this.trains[i].train) {
                newTrains.push(this.trains[i]);
            }
        }

        // train
        NeuralNetworkBackPropagation.train(network, NeuralNetworkBackPropagation.SGD, newTrains, 0.1, 0.000001, 1000000);

        // check
        for (let t = 0; t < this.trains.length; t++) {
            const result = NeuralNetwork.feedforward(network, this.trains[t].inputs);

            const msg = document.createElement('p');
            msg.innerText = '(' + (this.trains[t].train ? 'train' : 'skip') + ') ' + result;
            msg.style.color = Math.round(result) == this.trains[t].outputs[0] ? 'green' : 'red';
            this.contentElement.append(msg);
        }
    }
}

const main = new Main(
    document.getElementById('content'),
    document.getElementById('network-canvas')
);
main.start();
