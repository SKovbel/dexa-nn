
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
            if (e % 10000 == 0) console.log('Epoch: ' + e + '; ' + 'Error: ' + totalError + '; ');
        } while (totalError > error && e < epoch)
        return totalError;
    }

    static backpPropagation(network, outputs, rate) {
        const layers = network.layers;
        const lastIdx = layers.length - 1;
        const first = layers[0];
        const last = layers[lastIdx];

        let totalError = 0;
        let errorLayer = [];
        let errorLayers = [layers.length];

        // output layer
        for (let j = 0; j < last.outputs.length; j++) {
            errorLayer[j] = last.outputs[j] - outputs[j];
            totalError += errorLayer[j] * errorLayer[j];
        }
        errorLayers[layers.length-1] = last.derivateFunction(last.outputs, errorLayer);

        // hidden layers
        for (let l = layers.length - 1; l > 0; l--) {
            for (let j = 0; j < layers[l].outputs.length; j++) {
                layers[l].biases[j] -= rate * errorLayers[l][j];
            }
            for (let i = 0; i < layers[l].inputs.length; i++) {
                errorLayer[i] = 0;
                for (let j = 0; j < layers[l].outputs.length; j++) {
                    errorLayer[i] += layers[l].weights[i][j] * errorLayers[l][j];
                    layers[l].weights[i][j] -= rate * layers[l].inputs[i] * errorLayers[l][j];
                }
            }
            errorLayers[l-1] = layers[l-1].derivateFunction(layers[l].inputs, errorLayer);
        }

        // execute first layer
        for (let j = 0; j < first.outputs.length; j++) {
            first.biases[j] -= rate * errorLayers[0][j];
            for (let i = 0; i < first.inputs.length; i++) {
                first.weights[i][j] -= rate * first.inputs[i] * errorLayers[0][j];
            }
        }

        return totalError;
    }
}
