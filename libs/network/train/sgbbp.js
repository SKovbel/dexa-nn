// SGD + Back Propagation inside
class NeuralNetworkTrainSGDBP {
    static train(network, trains, rate = 0.01, minError = 0.1, maxEpoch = 1000) {
        const layers = network.layers;
        const first = layers[0];
        const last = layers[layers.length - 1];

        let epoch = 0;
        let error = 0;
        do {
            error  = 0;
            for (let t = 0; t < trains.length; t++) {
                NeuralNetwork.forwardPropagate(network, trains[t].inputs);

                let errorLayer = [];
                let errorLayers = [];
        
                // output layer
                for (let j = 0; j < last.outputs.length; j++) {
                    errorLayer[j] = last.outputs[j] - trains[t].outputs[j];
                    error += errorLayer[j] * errorLayer[j];
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
            }
            epoch++;
            if (epoch % 10000 == 0) 
                console.log('Epoch: ' + epoch + '; ' + 'Error: ' + error + '; ');
        } while (error > minError && epoch < maxEpoch)
        return error;
    } //4.742s, 4.428s 4.7, 4.44
}
