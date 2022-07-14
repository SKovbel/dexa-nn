class NeuralNetwork {
    constructor(layersConfig) {
        this.layers = [];
        for (let l = 0; l < layersConfig.length - 1; l++) {
            this.layers.push(new NeuralNetworkLayer(
                layersConfig[l].size, 
                layersConfig[l + 1].size,
                layersConfig[l].activation
            ));
        }
    }

    static forwardPropagate(network, inputs) {
        network.layers[0].inputs = inputs;
        network.layers[0].activationFunction();
        for (let l = 1; l < network.layers.length; l++) {
            network.layers[l].inputs = network.layers[l - 1].outputs;
            network.layers[l].activationFunction();
        }
        return network.layers[network.layers.length - 1].outputs;
    }
}


class NeuralNetworkLayer {
    constructor(inputCount, outputCount, activation = NeuralNetworkActivation.RELU) {
        this.activation = activation;
        this.biases = new Array(outputCount);
        this.weights = new Array(inputCount);
        for (let j = 0; j < inputCount; j++) {
            this.weights[j] = new Array(outputCount);
        }
        NeuralNetworkLayer.init(this);
        NeuralNetworkLayer.randomize(this);
    }

    // public init, used in load
    static init(layer) {
        layer.inputs = new Array(layer.weights.length);
        layer.outputs = new Array(layer.biases.length);
        NeuralNetworkActivation.init(layer);
    }

    static randomize(layer) {
        for (let j = 0; j < layer.biases.length; j++) {
            for (let i = 0; i < layer.weights.length; i++) {
                layer.weights[i][j] = Math.random() * 2 - 1;
            }
            layer.biases[j] = Math.random() * 2 - 1;
        }
    }
}
