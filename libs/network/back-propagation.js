class NeuralNetworkBackPropagation {
    static init(network) {
        for (let l = 0; l < network.layers.length; l++) {
            NeuralNetworkBackDerivate.init(network.layers[l]);
        }
    }

    static train(network, trains, rate = 0.01, error = 0.1, epoch = 1000) {
        NeuralNetworkBackPropagation.init(network);
        var t0 = performance.now();
        let e = 0;
        let totalError  = 0;
        do {
            totalError  = 0;
            for (let t = 0; t < trains.length; t++) {
                NeuralNetwork.feedforward(network, trains[t].inputs);
                totalError += this.backpPropagation(network, trains[t].outputs, rate);
            }
            e++;
        } while (totalError > error && e < epoch)
        console.log('Epoch: ' + e + '; ' + 'Error: ' + totalError + '; ' + 'Time: ' + (Math.round((performance.now() - t0), 2) / 1000) + 's'
        );
        return epoch;
    }

    static backpPropagation(network, outputs, rate) {
        const layers = network.layers;
        const lastIdx = layers.length - 1;
        const first = layers[0];
        const last = layers[lastIdx];

        let errors = [];
        let errorTotal = 0;

        // output+last layer
        errors[lastIdx] = [];
        for (let j = 0; j < last.outputs.length; j++) {
            const difference = last.outputs[j] - outputs[j];
            errors[lastIdx][j] = difference * last.derivateFunction(last.outputs[j]);
            last.biases[j] -= rate * errors[lastIdx][j];
            errorTotal += difference * difference;
        }

        // last+mid layers
        for (let l = layers.length - 1; l > 0; l--) {
            errors[l - 1] = [];
            for (let i = 0; i < layers[l].inputs.length; i++) {
                let sum = 0;
                for (let j = 0; j < layers[l].outputs.length; j++) {
                    sum += layers[l].weights[i][j] * errors[l][j];
                    layers[l].weights[i][j] -= rate * layers[l].inputs[i] * errors[l][j];
                }
                errors[l - 1][i] = sum * layers[l].derivateFunction(layers[l].inputs[i]);
                layers[l - 1].biases[i] -= rate * errors[l - 1][i];
            }
        }

        // first layer
        for (let i = 0; i < first.inputs.length; i++) {
            for (let j = 0; j < first.outputs.length; j++) {
                first.weights[i][j] -= rate * first.inputs[i] * errors[0][j];
            }
        }
        return errorTotal;
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
                break;
        }
    }

    static tanh(x) {
        let tanh = Math.tanh(x);
        return 1 - tanh * tanh;
    }

    static relu(x) {
        return x > 0 ? 1 : 0.001 * x;
    }

    static sigmoid(x) {
        return x * (1 - x);
    }

    static softmax(x) {

    }
}
