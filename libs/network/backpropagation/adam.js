
class NeuralNetworkBackPropagationAdam {
    static train(network, trains, rate = 0.01, error = 0.1, epoch = 1000) {
        const layers = network.layers;

        const beta1 = 0.001;
        const beta2 = 0.001;

        for (let l = 0; l < layers.length; l++) {
            let layer = layers[l];
            layer.adamWM = [];
            layer.adamWV = [];
            layer.adamBM = [];
            layer.adamBV = [];
        }

        do {
            for (let t = 0; t < trains.length; t++) {
                NeuralNetwork.forwardPropagate(network, trains[t].inputs);
                const totalError = NeuralNetworkBackPropagation.backPropagate(network, trains[t].outputs);

                for (let l = 0; l < layers.length; l++) {
                    let layer = layers[l];
                    for (let i = 0; i < layer.width * layer.prevWidth; i++) {
                        layer.adamWM[i] = beta1 * layer.adamWM[i] + (1.0 - beta1) * layer.dW[i];
                        layer.adamWV[i] = beta2 * layer.adamWV[i] + (1.0 - beta2) * layer.dW[i] * layer.dW[i];
                        let m = layer.adamWM[i] / (1 - beta1);
                        let v = layer.adamWV[i] / (1 - beta2);
                        layer.W[i] = layer.W[i] - rate * m / (sqrt(v) + 1e-8);
                        layer.dW[i] = 0;
                    }

                    for (let i = 0; i < layer.width; i++) {
                        layer.adamBM[i] = beta1 * layer.adamBM[i] + (1.0 - beta1) * layer.dB[i];
                        layer.adamBV[i] = beta2 * layer.adamBV[i] + (1.0 - beta2) * layer.dB[i] * layer.dB[i];
                        let m = layer.adamBM[i] / (1 - beta1);
                        let v = layer.adamBV[i] / (1 - beta2);
                        layer.B[i] = layer.B[i] - rate * m / (sqrt(v) + 1e-8);
                        layer.dB[i] = 0;
                    }
                }
            }
            e++;
        } while (totalError > error && e < epoch)
    }
}
