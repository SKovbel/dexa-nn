class NeuralNetworkActivation {
    static RELU = 'relu';
    static LRELU = 'leaky-relu';
    static TANH = 'tanh';
    static SIGMOID = 'sigmoid';
    static SOFTMAX = 'softmax';

    static init(layer) {
        switch (layer.activation) {
            case NeuralNetworkActivation.RELU:
                layer.activationFunction = this.relu;
                layer.derivateFunction = this.drelu;
                break;
            case NeuralNetworkActivation.LRELU:
                layer.activationFunction = this.lrelu;
                layer.derivateFunction = this.dlrelu;
                break;
            case NeuralNetworkActivation.TANH:
                layer.activationFunction = this.tanh;
                layer.derivateFunction = this.dtanh;
                break;
            case NeuralNetworkActivation.SIGMOID:
                layer.activationFunction = this.sigmoid;
                layer.derivateFunction = this.dsigmoid;
                break;
            case NeuralNetworkActivation.SOFTMAX:
                layer.activationFunction = this.softmax;
                layer.derivateFunction = this.dsoftmax;
                break;
        }
    }

    // TANH ----------------------------------

    static tanh() { // -1..1
        for (let i = 0; i < this.outputs.length; i++) {
            let x = this.biases[i];
            for (let j = 0; j < this.inputs.length; j++) {
                x += this.inputs[j] * this.weights[j][i];
            }
            this.outputs[i] = Math.tanh(x);
        }
    }
    static dtanh(inputs, errors) {
        let result = [];
        for (let i = 0; i < inputs.length; i++) {
            let tanh = Math.tanh(inputs[i]);
            const deriviate  = 1 - tanh * tanh;
            result[i] = errors[i] * deriviate;
        }
        return result;
    }

    // SIGMOID ------------------------------

    static sigmoid() { // 0..1
        for (let i = 0; i < this.outputs.length; i++) {
            let x = this.biases[i];
            for (let j = 0; j < this.inputs.length; j++) {
                x += this.inputs[j] * this.weights[j][i];
            }
            this.outputs[i] = 1 / (1 + Math.exp(-x));
        }
    }
    static dsigmoid(inputs, errors) {
        let result = [];
        for (let i = 0; i < inputs.length; i++) {
            const deriviate = inputs[i] * (1 - inputs[i]);
            result[i] = errors[i] * deriviate;
        }
        return result;
    }

    // RELU ----------------------------------

    static relu() { // 0..1
        for (let i = 0; i < this.outputs.length; i++) {
            let x = this.biases[i];
            for (let j = 0; j < this.inputs.length; j++) {
                x += this.inputs[j] * this.weights[j][i];
            }
            this.outputs[i] = x > 0 ? 1 : 0;
        }
    }
    static drelu(inputs, errors) {
        let result = [];
        for (let i = 0; i < inputs.length; i++) {
            const deriviate = inputs[i] > 0 ? 1 : 0 * inputs[i];
            result[i] = errors[i] * deriviate;
        }
        return result;
    }

    // LEAKY RELU ----------------------------------

    static lrelu() { // 0..1
        for (let i = 0; i < this.outputs.length; i++) {
            let x = this.biases[i];
            for (let j = 0; j < this.inputs.length; j++) {
                x += this.inputs[j] * this.weights[j][i];
            }
            this.outputs[i] = x > 0 ? 1 : 0.01 * x;
        }
    }
    static dlrelu(inputs, errors) {
        let result = [];
        for (let i = 0; i < inputs.length; i++) {
            const deriviate = inputs[i] > 0 ? 1 : 0.01 * inputs[i];
            result[i] = errors[i] * deriviate;
        }
        return result;
    }

    // SOFTMAX -------------------------------

    static softmax() { // 0..1, sum(all) = 1
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
    static dsoftmax(inputs, errors) {
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
