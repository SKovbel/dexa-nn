class NeuralNetwork {
    constructor(layersConfig) {
        this.layers = [];
        for (let i = 0; i < layersConfig.length - 1; i++) {
            this.layers.push(new NeuralNetworkLayer(
                layersConfig[i].count, 
                layersConfig[i + 1].count,
                layersConfig[i].activation, 
            ));
        }
    }

    static feedforward(network, inputs) {
        let outputs = NeuralNetworkLayer.feedForward(
            inputs,
            network.layers[0]
        );
        for (let i = 1; i < network.layers.length; i++) {
            outputs = NeuralNetworkLayer.feedForward(
                outputs,
                network.layers[i]
            );
        }
        return outputs;
    }

    static load(data, mutation = 0) {
        const network = data;
        for (let layer of network.layers) {
            NeuralNetworkActivation.initActivationFunction(layer);
        }
        NeuralNetwork.mutate(network, mutation);
        return network;
    }

    static mutate(network, mutation = 1) {
        if (mutation  == 0) {
            return;
        }
        for (let layer of network.layers) {
            for (let i = 0; i < layer.biases.length; i++) {
                layer.biases[i] = lerp(layer.biases[i], 2*Math.random() - 1, mutation);
            }
            for (let i = 0; i < layer.weights.length; i++) {
                for (let j = 0; j < layer.weights[i].length; j++) {
                    layer.weights[i][j] = lerp(layer.weights[i][j], 2*Math.random() - 1, mutation);
                }
            }
        }
    }
}

class NeuralNetworkActivation {
    static RELU = 'relu';
    static TANH = 'tanh';
    static SIGMOID = 'sigmoid';
    static SOFTMAX = 'softmax';

    static initActivationFunction(layer) {
        switch (layer.activation) {
            case this.RELU:
                layer.activationFunction = this.relu;
                break;
            case this.TANH:
                layer.activationFunction = this.tanh;
                break;
            case this.SIGMOID:
                layer.activationFunction = this.sigmoid;
                break;
            case this.SOFTMAX:
                layer.activationFunction = this.softmax;
                break;
        }
    }

    static tanh(layer) {
        for (let i = 0; i < layer.outputs.length; i++) {
            let x = layer.biases[i];
            for (let j = 0; j < layer.inputs.length; j++) {
                x += layer.inputs[j] * layer.weights[j][i];
            }
            layer.outputs[i] = Math.tanh(x);
        }
    }

    static sigmoid(layer) {
        for (let i = 0; i < layer.outputs.length; i++) {
            let x = layer.biases[i];
            for (let j = 0; j < layer.inputs.length; j++) {
                x += layer.inputs[j] * layer.weights[j][i];
            }
            layer.outputs[i] = 1 / (1 + Math.exp(-x));
        }
    }

    static relu(layer) {
        for (let i = 0; i < layer.outputs.length; i++) {
            let x = layer.biases[i];
            for (let j = 0; j < layer.inputs.length; j++) {
                x += layer.inputs[j] * layer.weights[j][i];
            }
            layer.outputs[i] = x > 0 ? 1 : 0;
        }
    }

    static softmax(layer) {
        let sum = 0;
        let exp = [];
        for (let i = 0; i < layer.outputs.length; i++) {
            let x = layer.biases[i];
            for (let j = 0; j < layer.inputs.length; j++) {
                x += layer.inputs[j] * layer.weights[j][i];
            }
            exp[i] = Math.exp(x);
            sum += exp[i];
        }
        for (let i = 0; i < layer.outputs.length; i++) {
            layer.outputs[i] = exp[i] / sum;
        }
    }
}

class NeuralNetworkLayer {
    constructor(inputCount, outputCount, activation = NeuralNetworkActivation.RELU) {
        this.biases = new Array(outputCount);
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.weights = new Array(inputCount);
        this.activation = activation;

        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
        }

        NeuralNetworkActivation.initActivationFunction(this); // set callback of activation function
        NeuralNetworkLayer.#randomize(this);
    }

    static #randomize(layer) {
         for (let i = 0; i < layer.inputs.length; i++) {
            for (let j = 0; j < layer.outputs.length; j++) {
                layer.weights[i][j] = Math.random() * 2 - 1;
            }
        }

        for (let i = 0; i < layer.biases.length; i++) {
            layer.biases[i] = Math.random() * 2 - 1;
        }
    }

    static feedForward(inputs, layer) {
        for (let i = 0; i < layer.inputs.length; i++) {
            layer.inputs[i] = inputs[i];
        }
        layer.activationFunction(layer);
        return layer.outputs;
    }

    static BackPropagation(outputs, layer) {

    }
}