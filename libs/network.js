class NeuralNetwork {
    constructor(nnLayers) {
        this.layers = [];
        for (let i = 0; i < nnLayers.length - 1; i++) {
            this.layers.push(new NeuralNetworkLayer(
                nnLayers[i].count, 
                nnLayers[i + 1].count,
                nnLayers[i].activation, 
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
            NeuralNetworkActivation.init(layer);
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
    static SIGMOID = 'sigmoid';
    static TANH = 'tanh';

    static init(layer) {
        if (layer.activation == this.SIGMOID) {
            layer.activationCallback = this.sigmoid;
        } else if (layer.activation == this.TANH) {
            layer.activationCallback = this.tanh;
        } else {
            layer.activationCallback = this.relu;
        }
    }

    static tanh(sum) {
        return Math.tanh(sum);
    }

    static relu(sum) {
        return sum > 0 ? 1 : 0;
    }

    static sigmoid(sum) {
        return 1 / (1 + Math.pow(Math.E, -sum));
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

        NeuralNetworkActivation.init(this);
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

    static feedForward(givenInputs, layer) {
        for (let i = 0; i < layer.inputs.length; i++) {
            layer.inputs[i] = givenInputs[i];
        }

        for (let i = 0; i < layer.outputs.length; i++) {
            let sum = layer.biases[i];
            for (let j = 0; j < layer.inputs.length; j++) {
                sum += layer.inputs[j] * layer.weights[j][i];
            }
            layer.outputs[i] = layer.activationCallback(sum);
        }

        return layer.outputs;
    }
}