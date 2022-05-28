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

    static feedforward(network, inputs) {
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
        NeuralNetworkLayer.#randomize(this);
    }

    // public init, used in load
    static init(layer) {
        layer.inputs = new Array(layer.weights.length);
        layer.outputs = new Array(layer.biases.length);
        NeuralNetworkActivation.init(layer);
    }

    static #randomize(layer) {
        for (let j = 0; j < layer.biases.length; j++) {
            for (let i = 0; i < layer.weights.length; i++) {
                layer.weights[i][j] = Math.random() * 2 - 1;
            }
            layer.biases[j] = Math.random() * 2 - 1;
        }
    }
}


class NeuralNetworkActivation {
    static RELU = 'relu';
    static TANH = 'tanh';
    static SIGMOID = 'sigmoid';
    static SOFTMAX = 'softmax';

    static init(layer) {
        switch (layer.activation) {
            case NeuralNetworkActivation.RELU:
                layer.activationFunction = NeuralNetworkActivation.relu;
                layer.derivateFunction = NeuralNetworkActivation.drelu;
                break;
            case NeuralNetworkActivation.TANH:
                layer.activationFunction = NeuralNetworkActivation.tanh;
                break;
            case NeuralNetworkActivation.SIGMOID:
                layer.activationFunction = NeuralNetworkActivation.sigmoid;
                layer.derivateFunction = NeuralNetworkActivation.dsigmoid;
                break;
            case NeuralNetworkActivation.SOFTMAX:
                layer.activationFunction = NeuralNetworkActivation.softmax;
                break;
        }
    }

    static tanh() {
        for (let i = 0; i < this.outputs.length; i++) {
            let x = this.biases[i];
            for (let j = 0; j < this.inputs.length; j++) {
                x += this.inputs[j] * this.weights[j][i];
            }
            this.outputs[i] = Math.tanh(x);
        }
    }

    static sigmoid() {
        for (let i = 0; i < this.outputs.length; i++) {
            let x = this.biases[i];
            for (let j = 0; j < this.inputs.length; j++) {
                x += this.inputs[j] * this.weights[j][i];
            }
            this.outputs[i] = 1 / (1 + Math.exp(-x));
        }
    }

    static relu() {
        for (let i = 0; i < this.outputs.length; i++) {
            let x = this.biases[i];
            for (let j = 0; j < this.inputs.length; j++) {
                x += this.inputs[j] * this.weights[j][i];
            }
            this.outputs[i] = x > 0 ? 1 : 0;
        }
    }

    static softmax() {
        let sum = 0;
        let exp = [];
        for (let i = 0; i < this.outputs.length; i++) {
            let x = this.biases[i];
            for (let j = 0; j < this.inputs.length; j++) {
                x += this.inputs[j] * this.weights[j][i];
            }
            exp[i] = Math.exp(x);
            sum += exp[i];
        }
        for (let i = 0; i < this.outputs.length; i++) {
            this.outputs[i] = exp[i] / sum;
        }
    }
}
