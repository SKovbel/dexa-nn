class NeuralNetworkBackPropagation {
    static SGD = 'sgd';
    static ADAM = 'adam';

    static init(network) {
        for (let l = 0; l < network.layers.length; l++) {
            network.layers[l].errors = [];
            NeuralNetworkDerivate.init(network.layers[l]);
        }
    }

    static backPropagate(network, outputs) {
        const layers = network.layers;
        const last = layers[layers.length - 1];

        let totalError = 0;
        let errors = [];

        // output layer
        for (let j = 0; j < last.outputs.length; j++) {
            errors[j] = last.outputs[j] - outputs[j];
            totalError += errors[j] * errors[j];
        }
        last.errors = last.derivateFunction(last.outputs, errors);

        // hidden layers
        for (let l = layers.length - 1; l > 0; l--) {
            errors = [];
            for (let i = 0; i < layers[l].inputs.length; i++) {
                errors[i] = 0;
                for (let j = 0; j < layers[l].outputs.length; j++) {
                    errors[i] += layers[l].weights[i][j] * layers[l].errors[j];
                }
            }
            layers[l-1].errors = layers[l-1].derivateFunction(layers[l].inputs, errors);
        }
        return totalError;
    }

    static train(network, algorithm, trains, rate = 0.01, error = 0.1, epoch = 1000) {
        const t0 = performance.now();
        NeuralNetworkBackPropagation.init(network);
        let totalError  = 0;
        switch(algorithm) {
            case NeuralNetworkBackPropagation.ADAM:
                totalError = NeuralNetworkBackPropagationAdam.train(network, trains, rate, error, epoch);
                break;
            case NeuralNetworkBackPropagation.SGD:
            default:
                totalError = NeuralNetworkBackPropagationSGD.train(network, trains, rate, error, epoch);
                break;
        }
        const t1 = performance.now();
        console.log('Time: ' + (Math.round((t1 - t0), 2) / 1000) + 's Error=' + totalError);
        return totalError;
    }
}


class NeuralNetworkDerivate {
    static init(layer) {
        switch (layer.activation) {
            case NeuralNetworkActivation.RELU:
                layer.derivateFunction = NeuralNetworkDerivate.relu;
                break;
            case NeuralNetworkActivation.TANH:
                layer.derivateFunction = NeuralNetworkDerivate.tanh;
                break;
            case NeuralNetworkActivation.SIGMOID:
                layer.derivateFunction = NeuralNetworkDerivate.sigmoid;
                break;
            case NeuralNetworkActivation.SOFTMAX:
                layer.derivateFunction = NeuralNetworkDerivate.softmax;
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
