class NeuralNetworkLayer {
    config = {};
    biases = [];
    inputs = [];
    outputs = [];
    weights = [];

    defaultConfig = {
        inputSize: 0,
        outputSize: 0,
        activation: NeuralNetworkActivation.SIGMOID
    };

    constructor(layerConfig = {}, layer = null) {
        this.config = Object.assign(this.defaultConfig, layerConfig);
        new NeuralNetworkActivation(this, this.config.activation);

        if (layer) {
            this.biases = layer.biases;
            this.weights = layer.weights;
        } else {
            for (let j = 0; j < this.config.outputSize; j++) {
                this.biases[j] = Math.random() * 2 - 1;
            }
            for (let i = 0; i < this.config.inputSize; i++) {
                this.weights[i] = new Array();
                for (let j = 0; j < this.config.outputSize; j++) {
                    this.weights[i][j] = Math.random() * 2 - 1;
                }
            }
        }

        // aliases
        this.inputSize = this.config.inputSize;
        this.outputSize = this.config.outputSize;
    }
}

class NeuralNetwork {
    config = {}
    layers = [];

    defaultConfig = {
        loss: NeuralNetworkLoss.CROSS_ENTROPY,
        train: NeuralNetworkTrain.SGD,
        layers: []
    };

    constructor(networkConfig = {}, layers = null) {
        this.config = Object.assign(this.defaultConfig, networkConfig);
        new NeuralNetworkLoss(this, this.config.loss);
        new NeuralNetworkTrain(this, this.config.train);

        for (let l = 0; l < this.config.layers.length - 1; l++) {
            this.config.layers[l].outputSize = this.config.layers[l + 1].inputSize;
            this.layers.push(new NeuralNetworkLayer(this.config.layers[l], layers ? layers[l] : null));
        }

        // aliases
        this.firstLayer = this.layers[0];
        this.lastLayer = this.layers[this.layers.length - 1];
    }

    forwardPropagate(inputs) {
        this.firstLayer.inputs = inputs;
        this.firstLayer.activate();
        for (let l = 1; l < this.layers.length; l++) {
            this.layers[l].inputs = this.layers[l - 1].outputs;
            this.layers[l].activate();
        }
        return this.lastLayer.outputs;
    }

    backPropagate(targets) {
        // output layer
        let {loss, errors} = this.loss(targets);
        this.lastLayer.gradients = this.lastLayer.dactivate(this.lastLayer.outputs, errors);

        // hidden layers
        for (let l = this.layers.length - 1; l > 0; l--) {
            let errors = [];
            for (let i = 0; i < this.layers[l].inputSize; i++) {
                errors[i] = 0;
                for (let j = 0; j < this.layers[l].outputSize; j++) {
                    errors[i] += this.layers[l].weights[i][j] * this.layers[l].gradients[j];
                }
            }
            this.layers[l-1].gradients = this.layers[l-1].dactivate(this.layers[l].inputs, errors);
        }
        return loss;
    }
}
