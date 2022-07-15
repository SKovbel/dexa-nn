
class NeuralNetworkTrainAdam {
    static train(network, trains, rate = 0.001, minError = 0.1, maxEpoch = 1000) {
        const layers = network.layers;

        let epoch = 0;
        let error = 0;

        const beta1 = 0.8;
        const beta2 = 0.8;
        const epsilon = 0.000000001;

        for (let l = 0; l < layers.length; l++) {
            layers[l].momentM = [];
            layers[l].momentV = [];
            for (let j = 0; j < layers[l].outputs.length + 1; j++) {
                layers[l].momentM[j] = 0;
                layers[l].momentV[j] = 0;
            }
        }

        do {
            for (let t = 0; t < trains.length; t++) {
                NeuralNetwork.forwardPropagate(network, trains[t].inputs);
                error += NeuralNetwork.backPropagate(network, trains[t].outputs);
                NeuralNetworkPrint.printNetwork(network);

                for (let l = layers.length - 1; l >= 0; l--) {
                    const layer = layers[l];
                    const bPos = layer.outputs.length;

                    for (let j = 0; j < layer.outputs.length; j++) {
                        layer.momentM[bPos] = beta1 * layer.momentM[bPos] + (1.0 - beta1) * layer.gradients[j];
                        layer.momentV[bPos] = beta2 * layer.momentV[bPos] + (1.0 - beta2) * layer.gradients[j] * layer.gradients[j];
                        let m = layer.momentM[bPos] / (1 - beta1);
                        let v = layer.momentV[bPos] / (1 - beta2);
                        layer.biases[j] -= layer.biases[j] - rate * m / (Math.sqrt(v) + epsilon);
    
                        for (let i = 0; i < layer.inputs.length; i++) {
                            layer.momentM[i] = beta1 * layer.momentM[i] + (1.0 - beta1) * layer.gradients[j];
                            layer.momentV[i] = beta2 * layer.momentV[i] + (1.0 - beta2) * layer.gradients[j] * layer.gradients[j];
                            let m = layer.momentM[i] / (1 - beta1);
                            let v = layer.momentV[i] / (1 - beta2);
                            layer.weights[i][j] -= layer.weights[i][j] - rate * m / (Math.sqrt(v) + epsilon);
                            layer.gradients[i] = 0;
                        }
                        NeuralNetworkPrint.printArray(layer.gradients, 'Grad')
                        NeuralNetworkPrint.printArray(layer.momentM, 'M')
                        NeuralNetworkPrint.printArray(layer.momentV, 'V');
                    }
                }
            }
            epoch++;
        } while (error > minError && epoch < maxEpoch);
        return error;
    }
}
