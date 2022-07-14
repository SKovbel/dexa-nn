
class NeuralNetworkBackPropagationSGD {
    static train(network, trains, rate = 0.01, minError = 0.1, maxEpoch = 1000) {
        const layers = network.layers;

        let epoch = 0;
        let error = 0;
        do {
            error = 0;
            for (let t = 0; t < trains.length; t++) {
                NeuralNetwork.forwardPropagate(network, trains[t].inputs);
                error +=  NeuralNetworkBackPropagation.backPropagate(network, trains[t].outputs);

                for (let l = layers.length - 1; l >= 0; l--) {
                    for (let j = 0; j < layers[l].outputs.length; j++) {
                        layers[l].biases[j] -= rate * layers[l].errors[j];
                        for (let i = 0; i < layers[l].inputs.length; i++) {
                            layers[l].weights[i][j] -= rate * layers[l].inputs[i] * layers[l].errors[j];
                        }
                    }
                }
            }

            if (epoch % 10000 == 0) 
                console.log('Epoch: ' + epoch + '; ' + 'Total Error: ' + error + '; ');

        } while (error > minError && ++epoch < maxEpoch);

        return error;
    }
}
