
class NeuralNetworkBackPropagationSGD {
    static train(network, trains, rate = 0.01, error = 0.1, maxEpoch = 1000) {
        let epoch = 0;
        let totalError  = 0;
        do {
            totalError  = 0;
            for (let t = 0; t < trains.length; t++) {
                totalError += 
                    NeuralNetworkBackPropagationSGD.#trainEpoch(network, trains[t].inputs, trains[t].outputs, rate);
            }
            if (epoch % 10000 == 0) console.log('Epoch: ' + epoch + '; ' + 'Total Error: ' + totalError + '; ');
        } while (totalError > error && ++epoch < maxEpoch)
        return totalError;
    }

    static #trainEpoch(network, inputs, outputs, rate) {
        const layers = network.layers;

        NeuralNetwork.forwardPropagate(network, inputs);
        const totalError = NeuralNetworkBackPropagation.backPropagate(network, outputs);

        // hidden layers
        for (let l = layers.length - 1; l >= 0; l--) {
            for (let j = 0; j < layers[l].outputs.length; j++) {
                layers[l].biases[j] -= rate * layers[l].errors[j];
                for (let i = 0; i < layers[l].inputs.length; i++) {
                    layers[l].weights[i][j] -= rate * layers[l].inputs[i] * layers[l].errors[j];
                }
            }
        }

        return totalError;
    }
}
