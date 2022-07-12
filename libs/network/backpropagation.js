class NeuralNetworkBackPropagation {
    SGD = 'sgd';

    static init(network) {
        for (let l = 0; l < network.layers.length; l++) {
            network.layers[l].errors = [];
            NeuralNetworkBackDerivate.init(network.layers[l]);
        }
    }

    static train(network, algorithm, trains, rate = 0.01, error = 0.1, epoch = 1000) {
        NeuralNetworkBackPropagation.init(network);
        let totalError  = 0;

        const t0 = performance.now();
        if (algorithm == NeuralNetworkBackPropagation.SGD) {
            totalError = NeuralNetworkBackPropagationSGD.train(network, trains, rate, error, epoch);
        }
        const t1 = performance.now();
        console.log('Time: ' + (Math.round((t1 - t0), 2) / 1000) + 's Error=' + totalError);
        return totalError;
    }
}

class NeuralNetworkBackPropagationSGD {
    static train(network, trains, rate = 0.01, error = 0.1, epoch = 1000) {
        let e = 0;
        let totalError  = 0;
        do {
            totalError  = 0;
            for (let t = 0; t < trains.length; t++) {
                NeuralNetwork.feedforward(network, trains[t].inputs);
                totalError += this.backpPropagation(network, trains[t].outputs, rate);
            }
            e++;
            if (e % 10000 == 0) console.log('Epoch: ' + e + '; ' + 'Error: ' + totalError + '; ');
        } while (totalError > error && e < epoch)
        return totalError;
    }

    static backpPropagation(network, outputs, rate) {
        const layers = network.layers;
        const lastIdx = layers.length - 1;
        const first = layers[0];
        const last = layers[lastIdx];

        let totalError = 0;
        let errorLayer = [];
        let errorLayers = [layers.length];

        // output layer
        for (let j = 0; j < last.outputs.length; j++) {
            errorLayer[j] = last.outputs[j] - outputs[j];
            totalError += errorLayer[j] * errorLayer[j];
        }
        errorLayers[layers.length-1] = last.derivateFunction(last.outputs, errorLayer);

        // hidden layers
        for (let l = layers.length - 1; l > 0; l--) {
            for (let j = 0; j < layers[l].outputs.length; j++) {
                layers[l].biases[j] -= rate * errorLayers[l][j];
            }
            for (let i = 0; i < layers[l].inputs.length; i++) {
                errorLayer[i] = 0;
                for (let j = 0; j < layers[l].outputs.length; j++) {
                    errorLayer[i] += layers[l].weights[i][j] * errorLayers[l][j];
                    layers[l].weights[i][j] -= rate * layers[l].inputs[i] * errorLayers[l][j];
                }
            }
            errorLayers[l-1] = layers[l-1].derivateFunction(layers[l].inputs, errorLayer);
        }

        // execute first layer
        for (let j = 0; j < first.outputs.length; j++) {
            first.biases[j] -= rate * errorLayers[0][j];
            for (let i = 0; i < first.inputs.length; i++) {
                first.weights[i][j] -= rate * first.inputs[i] * errorLayers[0][j];
            }
        }



            return totalError;
    }
}

class NeuralNetworkBackDerivate {
    static init(layer) {
        switch (layer.activation) {
            case NeuralNetworkActivation.RELU:
                layer.derivateFunction = NeuralNetworkBackDerivate.relu;
                break;
            case NeuralNetworkActivation.TANH:
                layer.derivateFunction = NeuralNetworkBackDerivate.tanh;
                break;
            case NeuralNetworkActivation.SIGMOID:
                layer.derivateFunction = NeuralNetworkBackDerivate.sigmoid;
                break;
            case NeuralNetworkActivation.SOFTMAX:
                layer.derivateFunction = NeuralNetworkBackDerivate.softmax;
                break;
        }
    }

    static tanh(inputs, errors) {
        let result = [];
        for (let i = 0; i < inputs.length; i++) {
            let tanh = Math.tanh(inputs[i]);
            const deriviate  = 1 - tanh * tanh;
            result[i] = errors[i] * deriviate;
        }
        return result;
    }

    static relu(inputs, errors) {
        let result = [];
        for (let i = 0; i < inputs.length; i++) {
            const deriviate = inputs[i] > 0 ? 1 : -0 * inputs[i];
            result[i] = errors[i] * deriviate;
        }
        return result;
    }

    static sigmoid(inputs, errors) {
        let result = [];
        for (let i = 0; i < inputs.length; i++) {
            const deriviate = inputs[i] * (1 - inputs[i]);
            result[i] = errors[i] * deriviate;
        }
        return result;
    }

    static softmax(inputs, errors) {
        let x = [];
        let exp = [];
        let sum = 0;
        let result = [];

        // activation
        for (let i = 0; i < inputs.length; i++) {this
            exp[i] = Math.exp(inputs[i]);
            sum += exp[i];
        }

        for (let i = 0; i < inputs.length; i++) {
            x[i] = exp[i] / sum;
        }

        // deriviation
        for (let i = 0; i < inputs.length; i++) {
            result[i] = 0;
            for (let j = 0; j < inputs.length; j++) {
                if (i == j) {
                    result[i] += x[i] * errors[i] * (1 - x[j]);
                } else {
                    result[i] += x[i] * errors[j] * (0 - x[j]);
                }
            }
        }
        return result;
    }
}
