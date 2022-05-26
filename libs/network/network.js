class NeuralNetwork {
    constructor(layersConfig) {
        this.layers = [];
        for (let l = 0; l < layersConfig.length - 1; l++) {
            this.layers.push(new NeuralNetworkLayer(
                layersConfig[l].count, 
                layersConfig[l + 1].count,
                layersConfig[l].activation
            ));
            NeuralNetworkTools.randomize(this.layers[l]);
        }
    }

    static feedforward(network, inputs) {
        if (network.layers[0].inputs.length != inputs.length) {
            console.log('feedForaward error');
            return;
        }

        network.layers[0].inputs = inputs;
        network.layers[0].activationFunction();
        for (let l = 1; l < network.layers.length; l++) {
            network.layers[l].inputs = network.layers[l - 1].outputs;
            network.layers[l].activationFunction();
        }
        return network.layers[network.layers.length - 1].outputs;
    }

    static backPropagation(network, outputs, rate = 0.01) {
        let error = [];
        let gradient = [];
        let errorTotal = 0;

        let last = network.layers[network.layers.length - 1];
        for (let j = 0; j < last.outputs.length; j++) {
            error[j] = last.output[j] - outputs[j];
            gradient = error[j] * last.dereviateFunction(last.output[i]);
            errorTotal += 0.5 * error[j] * error[j];
        }

        last.error = []
        for (let i = 0; i < last.inputs.length; i++) {
            last.error[i] = 0;
            for (let j = 0; j < last.outputs.length; j++) {
                last.error[i] += output.weights[i][j] * gradient[j];
                last.weights[i][j] -= rate * gradient[j] * last.inputs[i];
            }
            last.gradient[i] = last.error[i] * last.dereviateFunction(last.inputs[i]);
        }

        for (let l = network.layers.length - 2; l >= 0; l--) {
            let pred = network.layers[l + 1];
            let layer = network.layers[l];
            layer.error = [];
            for (let i = 0; i < layer.inputs.length; i++) {
                layer.error[i] = 0; 
                for (let j = 0; j < layer.outputs.length; j++) {
                    layer.error[i] += layer.weights[i][j] * pred.gradient[j];
                    layer.weights[i][j] -= rate * pred.gradient[j] * layer.inputs[i];
                }
                layer.gradient[i] = layer.error[i] * layer.dereviateFunction(layer.inputs[i]);
            }
        }

        return errorTotal;
    }

    static train(network, train, rate, error, epoch) {
        for (let e = 0; e < epoch; e++) {
            let errorTotal  = 0;
            for (let t = 0; t < train.length; t++) {
                NeuralNetwork.feedforward(network, train[t].inputs);
                errorTotal += NeuralNetwork.backPropagation(network, train[t].outputs, rate);
            }
            if (errorTotal < error) {
                return;
            }
        }
    }
}


class NeuralNetworkLayer {
    constructor(inputCount, outputCount, activation = NeuralNetworkActivation.RELU) {
        this.biases = new Array(outputCount);
        this.weights = Array.from(Array(inputCount), () => new Array(outputCount))
        this.activation = activation;
        NeuralNetworkLayer.init(this);
    }

    static init(layer) {
        layer.inputs = new Array(layer.weights.length);
        layer.outputs = new Array(layer.biases.length);

        switch (layer.activation) {
            case NeuralNetworkActivation.RELU:
                layer.activationFunction = NeuralNetworkActivation.relu;
                layer.dereviateFunction = NeuralNetworkActivation.drelu;
                break;
            case NeuralNetworkActivation.TANH:
                layer.activationFunction = NeuralNetworkActivation.tanh;
                break;
            case NeuralNetworkActivation.SIGMOID:
                layer.activationFunction = NeuralNetworkActivation.sigmoid;
                break;
            case NeuralNetworkActivation.SOFTMAX:
                layer.activationFunction = NeuralNetworkActivation.softmax;
                break;
        }
    }
}


class NeuralNetworkActivation {
    static RELU = 'relu';
    static TANH = 'tanh';
    static SIGMOID = 'sigmoid';
    static SOFTMAX = 'softmax';

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
            for (let j = 0; j < v.inputs.length; j++) {
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

    static drelu(x) {
        return x > 0 ? 1 : 0.001 * x;
    }
}
