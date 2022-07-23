class Main {
    trains = [
        {inputs: [0,0,0], outputs: [0], train: true},
        {inputs: [0,0,1], outputs: [1], train: false},
        {inputs: [0,1,0], outputs: [1], train: true},
        {inputs: [0,1,1], outputs: [0], train: true},
        {inputs: [1,0,0], outputs: [1], train: true},
        {inputs: [1,0,1], outputs: [0], train: false},
        {inputs: [1,1,0], outputs: [0], train: true},
        {inputs: [1,1,1], outputs: [1], train: true},
    ];

    constructor(contentElement, networkCanvas) {
        this.contentElement = contentElement;
        this.networkCanvas = networkCanvas;

        this.network = new NeuralNetwork({
            loss: NeuralNetworkLoss.MSE,
            train: NeuralNetworkTrain.SGD,
            layers: [
                {inputSize: 3, activation: NeuralNetworkActivation.SIGMOID},
                //{inputSize: 3, activation: NeuralNetworkActivation.TANH},
                //{inputSize: 3, activation: NeuralNetworkActivation.RELU},
                //{inputSize: 3, activation: NeuralNetworkActivation.SOFTMAX},
                //{inputSize: 3, activation: NeuralNetworkActivation.SIGMOID},
                {inputSize: 3, activation: NeuralNetworkActivation.SIGMOID},
                {inputSize: 1},
            ]
        });
    }

    train() {
        // prepare train, skip some results
        let newTrains = [];
        for (let i = 0; i < this.trains.length ; i++) {
            if (this.trains[i].train) {
                newTrains.push(this.trains[i]);
            }
        }
        this.network.train(newTrains, {learn_rate: 0.001, min_error: 0.15, max_epoch: 1000000});
    }

    test() {
        for (let t = 0; t < this.trains.length; t++) {
            const result = this.network.forwardPropagate(this.trains[t].inputs);
            let ins = '';
            for (let i = 0; i < this.trains[t].inputs.length; i++) {
                ins += this.trains[t].inputs[i] + ' ';
            }
            let out = '';
            for (let i = 0; i < this.trains[t].outputs.length; i++) {
                out += this.trains[t].outputs[i] + ' ';
            }
            const msg = document.createElement('p');
            msg.innerText = '(' + (this.trains[t].train ? 'train' : 'skip!') + ') ' + 
                parseFloat(result).toFixed(4) + '   [ ' + ins + '] => [ ' + out + ']';
            msg.style.color = Math.round(result) == this.trains[t].outputs[0] ? 'green' : 'red';
            this.contentElement.append(msg);
        }
    }

    animate(time) {
        this.networkCtx = this.networkCanvas.getContext('2d');
        this.networkCanvas.height = window.innerHeight;
        this.networkCanvas.width = 500;
        NeuralNetworkVisualizer.drawNetwork(this.networkCtx, this.network, []);
        //requestAnimationFrame(this.animate.bind(this));
    }
}

