
class NeuralNetworkTrainAdam {
    static train(network, trains, learnRate = 0.001, minError = 0.1, maxEpoch = 1000) {
        const layers = network.layers;

        let epoch = 0;
        let error = 0;

        const beta1 = 0.901;
        const beta2 = 0.999;
        const epsilon = 0.000000001;

        for (let l = 0; l < layers.length; l++) {
            layers[l].momentM = [];
            layers[l].momentV = [];
            for (let i = 0; i < layers[l].inputs.length + 1; i++) { // +1 for biases moments
                layers[l].momentM[i] = [];
                layers[l].momentV[i] = [];
                for (let j = 0; j < layers[l].outputs.length; j++) {
                    layers[l].momentM[i][j] = 0;
                    layers[l].momentV[i][j] = 0;
                }
            }
        }

        console.log(trains);
        do {
            error = 0;
            for (let t = 0; t < trains.length; t++) {
                NeuralNetwork.forwardPropagate(network, trains[t].inputs);
                error += NeuralNetwork.backPropagate(network, trains[t].outputs);

                for (let l = 0; l < layers.length; l++) {
                    const layer = layers[l];
                    const biasIdx = layer.inputs.length;

                    for (let j = 0; j < layer.outputs.length; j++) {
                        const bgrad = layer.biases[j] * layer.gradients[j]
                        layer.momentM[biasIdx][j] = beta1 * layer.momentM[biasIdx][j] + (1.0 - beta1) * bgrad
                        layer.momentV[biasIdx][j] = beta2 * layer.momentV[biasIdx][j] + (1.0 - beta2) * bgrad * bgrad;
                        const m = layer.momentM[biasIdx][j] / (1 - beta1);
                        const v = layer.momentV[biasIdx][j] / (1 - beta2);
                        layer.biases[j] -= learnRate * m / (Math.sqrt(v) + epsilon);

                        for (let i = 0; i < layer.inputs.length; i++) {
                            const wgrad = layer.inputs[i] * layer.gradients[j];
                            layer.momentM[i][j] = beta1 * layer.momentM[i][j] + (1.0 - beta1) * wgrad;
                            layer.momentV[i][j] = beta2 * layer.momentV[i][j] + (1.0 - beta2) * wgrad * wgrad;
                            const m = layer.momentM[i][j] / (1 - beta1);
                            const v = layer.momentV[i][j] / (1 - beta2);
                            layer.weights[i][j] -= learnRate * m / (Math.sqrt(v) + epsilon);
                        }
                    }
                }
            }
            if (epoch % 10000 == 0) {
                console.log('Epoch: ' + epoch + '; ' + 'Total Error: ' + (error/trains.length) + '; ');
            }
        } while (error > minError && ++epoch < maxEpoch);
        return {'error': error, 'epoch': epoch};
    }
}
