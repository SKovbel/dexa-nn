
class NeuralNetworkTrainAdam {
    config = {
        learn_rate: 0.001,
        min_error: 0.1,
        max_epoch: 1000,
        beta1: 0.901,
        beta2: 0.999,
        epsilon: 0.000000001
    }

    train(network, trains, config = {}) {
        this.config = Object.assign(this.config, config);

        for (let l = 0; l < network.layers.length; l++) {
            const layer = network.layers[l];
            layer.momentM = [];
            layer.momentV = [];
            for (let i = 0; i < layer.inputSize + 1; i++) { // +1 for biases moments
                layer.momentM[i] = [];
                layer.momentV[i] = [];
                for (let j = 0; j < layer.outputSize; j++) {
                    layer.momentM[i][j] = 0;
                    layer.momentV[i][j] = 0;
                }
            }
        }

        let cost = 0;
        let epoch = 0;
        do {
            cost = 0;
            for (let t = 0; t < trains.length; t++) {
                network.forwardPropagate(trains[t].inputs);
                cost += network.backPropagate(trains[t].outputs) / trains.length;

                for (let l = 0; l < network.layers.length; l++) {
                    const layer = network.layers[l];
                    const biasIdx = layer.inputSize;

                    for (let j = 0; j < layer.outputSize; j++) {
                        const bgrad = layer.biases[j] * layer.gradients[j]
                        layer.momentM[biasIdx][j] = this.config.beta1 * layer.momentM[biasIdx][j] + (1.0 - this.config.beta1) * bgrad
                        layer.momentV[biasIdx][j] = this.config.beta2 * layer.momentV[biasIdx][j] + (1.0 - this.config.beta2) * bgrad * bgrad;
                        const m = layer.momentM[biasIdx][j] / (1 - this.config.beta1);
                        const v = layer.momentV[biasIdx][j] / (1 - this.config.beta2);
                        layer.biases[j] -= this.config.learn_rate * m / (Math.sqrt(v) + this.config.epsilon);

                        for (let i = 0; i < layer.inputSize; i++) {
                            const wgrad = layer.inputs[i] * layer.gradients[j];
                            layer.momentM[i][j] = this.config.beta1 * layer.momentM[i][j] + (1.0 - this.config.beta1) * wgrad;
                            layer.momentV[i][j] = this.config.beta2 * layer.momentV[i][j] + (1.0 - this.config.beta2) * wgrad * wgrad;
                            const m = layer.momentM[i][j] / (1 - this.config.beta1);
                            const v = layer.momentV[i][j] / (1 - this.config.beta2);
                            layer.weights[i][j] -= this.config.learn_rate * m / (Math.sqrt(v) + this.config.epsilon);
                        }
                    }
                }
            }
        } while (cost > this.config.min_error && ++epoch < this.config.max_epoch);

        return {'error': cost, 'epoch': epoch};
    }
}
