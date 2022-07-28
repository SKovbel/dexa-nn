class NeuralNetworkActivation {
    static RELU = 'relu';
    static LRELU = 'leaky-relu';
    static TANH = 'tanh';
    static SIGMOID = 'sigmoid';
    static SOFTMAX = 'softmax';

    constructor(layer, activation) {
        switch (activation) {
            case NeuralNetworkActivation.RELU:
                layer.activate = this.relu;
                layer.derivate = this.drelu;
                break;
            case NeuralNetworkActivation.LRELU:
                layer.activate = this.lrelu;
                layer.derivate = this.dlrelu;
                break;
            case NeuralNetworkActivation.TANH:
                layer.activate = this.tanh;
                layer.derivate = this.dtanh;
                break;
            case NeuralNetworkActivation.SIGMOID:
                layer.activate = this.sigmoid;
                layer.derivate = this.dsigmoid;
                break;
            case NeuralNetworkActivation.SOFTMAX:
                layer.activate = this.softmax;
                layer.derivate = this.dsoftmax;
                break;
        }
    }

    // TANH ----------------------------------
    tanh() { // -1..1
        for (let j = 0; j < this.outputSize; j++) {
            let x = this.biases[j];
            for (let i = 0; i < this.inputSize; i++) {
                x += this.inputs[i] * this.weights[i][j];
            }
            this.outputs[j] = Math.tanh(x);
        }
    }
    dtanh(inputs, errors) {
        let result = [];
        for (let i = 0; i < inputs.length; i++) {
            let tanh = Math.tanh(inputs[i]);
            const deriviate  = 1 - tanh * tanh;
            result[i] = errors[i] * deriviate;
        }
        return result;
    }

    // SIGMOID ------------------------------
    sigmoid() { // 0..1
        for (let j = 0; j < this.outputSize; j++) {
            let x = this.biases[j];
            for (let i = 0; i < this.inputSize; i++) {
                x += this.inputs[i] * this.weights[i][j];
            }
            this.outputs[j] = 1 / (1 + Math.exp(-x));
        }
    }
    dsigmoid(inputs, errors) {
        let result = [];
        for (let i = 0; i < inputs.length; i++) {
            const deriviate = inputs[i] * (1 - inputs[i]);
            result[i] = errors[i] * deriviate;
        }
        return result;
    }

    // RELU ----------------------------------
    relu() { // 0..1
        for (let j = 0; j < this.outputSize; j++) {
            let x = this.biases[j];
            for (let i = 0; i < this.inputSize; i++) {
                x += this.inputs[i] * this.weights[i][j];
            }
            this.outputs[j] = x > 0 ? 1 : 0;
        }
    }
    drelu(inputs, errors) {
        let result = [];
        for (let i = 0; i < inputs.length; i++) {
            const deriviate = inputs[i] > 0 ? 1 : 0 * inputs[i];
            result[i] = errors[i] * deriviate;
        }
        return result;
    }

    // LEAKY RELU ----------------------------------
    lrelu() { // 0..1
        for (let j = 0; j < this.outputSize; j++) {
            let x = this.biases[j];
            for (let i = 0; i < this.inputSize; i++) {
                x += this.inputs[i] * this.weights[i][j];
            }
            this.outputs[j] = x > 0 ? 1 : 0.01 * x;
        }
    }
    dlrelu(inputs, errors) {
        let result = [];
        for (let i = 0; i < inputs.length; i++) {
            const deriviate = inputs[i] > 0 ? 1 : 0.01 * inputs[i];
            result[i] = errors[i] * deriviate;
        }
        return result;
    }

    // SOFTMAX -------------------------------

    softmax() { // 0..1, sum(all) = 1
        let sum = 0;
        let exp = [];
        for (let j = 0; j < this.outputSize; j++) {
            let x = this.biases[j];
            for (let i = 0; i < this.inputSize; i++) {
                x += this.inputs[i] * this.weights[i][j];
            }
            exp[j] = Math.exp(x);
            sum += exp[j];
        }
        for (let j = 0; j < this.outputSize; j++) {
            this.outputs[j] = exp[j] / sum;
        }
    }
    dsoftmax(inputs, errors) {
        let x = [];
        let exp = [];
        let sum = 0;
        let result = [];

        // activation
        for (let i = 0; i < inputs.length; i++) {
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
