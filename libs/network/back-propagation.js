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

        const t0 = performance.now();
        if (algorithm == NeuralNetworkBackPropagation.SGD) {
            NeuralNetworkBackPropagationSGD.train(network, trains, rate, error, epoch);
        }
        const t1 = performance.now();
        console.log('Time: ' + (Math.round((t1 - t0), 2) / 1000) + 's');
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
        } while (totalError > error && e < epoch)
        console.log('Epoch: ' + e + '; ' + 'Error: ' + totalError + '; ');
        return [e, totalError];
    }

    static backpPropagation(network, outputs, rate) {
        const layers = network.layers;
        const lastIdx = layers.length - 1;
        const first = layers[0];
        const last = layers[lastIdx];

        let errorTotal = 0;

        // prepare last layer
        let errors = [];
        for (let j = 0; j < last.outputs.length; j++) {
            errors[j] = last.outputs[j] - outputs[j];
            errorTotal += errors[j] * errors[j];
        }
        last.derivateFunction(last.outputs, errors); // set last.errors

        // hidden    layers
        for (let l = layers.length - 1; l > 0; l--) {
            for (let j = 0; j < layers[l].outputs.length; j++) {
                layers[l].biases[j] -= rate * layers[l].errors[j];
            }
            for (let i = 0; i < layers[l].inputs.length; i++) {
                errors[i] = 0;
                for (let j = 0; j < layers[l].outputs.length; j++) {
                    errors[i] += layers[l].weights[i][j] * layers[l].errors[j];
                    layers[l].weights[i][j] -= rate * layers[l].inputs[i] * layers[l].errors[j];
                }
            }
            layers[l-1].derivateFunction(layers[l].inputs, errors); // set layer[i-1].errors
        }

        // execute first layer
        for (let j = 0; j < first.outputs.length; j++) {
            first.biases[j] -= rate * first.errors[j];
            for (let i = 0; i < first.inputs.length; i++) {
                first.weights[i][j] -= rate * first.inputs[i] * first.errors[j];
            }
        }

        //console.log(JSON.stringify(network));
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
                layer.derivateFunction = NeuralNetworkBackDerivate.softmax;
                break;
        }
    }

    static tanh(inputs, errors) {
        for (let i = 0; i < inputs.length; i++) {
            let tanh = Math.tanh(inputs[i]);
            const deriviate  = 1 - tanh * tanh;
            this.errors[i] = errors[i] * deriviate;
        }
    }

    static relu(inputs, errors) {
        for (let i = 0; i < inputs.length; i++) {
            const deriviate = inputs[i] > 0 ? 1 : 0.001 * inputs[i];
            this.errors[i] = errors[i] * deriviate;
        }
    }

    static sigmoid(inputs, errors) {
        for (let i = 0; i < inputs.length; i++) {
            const deriviate = inputs[i] * (1 - inputs[i]);
            this.errors[i] = errors[i] * deriviate;
        }
    }

    static softmax(inputs, errors) {
        let exp = [];
        let sum = 0;
        let x = [];

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
            this.errors[i] = 0;
            for (let j = 0; j < inputs.length; j++) {
                if (i == j) {
                    this.errors[i] += x[i] * errors[i] * (1 - x[j]);
                } else {
                    this.errors[i] += x[i] * errors[j] * (0 - x[j]);
                }
            }
        }
    }
}
