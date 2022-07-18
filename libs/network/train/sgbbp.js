// SGD + Back Propagation inside, +15% speed
class NeuralNetworkTrainSGDBP {
    static train(network, trains, learnRate = 0.01, minError = 0.1, maxEpoch = 1000, options = {}) {
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
                for (let j = 0; j < last.outputSize; j++) {
                    errorLayer[j] = last.outputs[j] - trains[t].outputs[j];
                    error += errorLayer[j] * errorLayer[j];
                }
                errorLayers[layers.length-1] = last.derivateFunction(last.outputs, errorLayer);
        
                // hidden layers
                for (let l = layers.length - 1; l > 0; l--) {
                    for (let j = 0; j < layers[l].outputSize; j++) {
                        layers[l].biases[j] -= learnRate * errorLayers[l][j];
                    }
                    for (let i = 0; i < layers[l].inputSize; i++) {
                        errorLayer[i] = 0;
                        for (let j = 0; j < layers[l].outputSize; j++) {
                            errorLayer[i] += layers[l].weights[i][j] * errorLayers[l][j];
                            layers[l].weights[i][j] -= learnRate * layers[l].inputs[i] * errorLayers[l][j];
                        }
                    }
                    errorLayers[l-1] = layers[l-1].derivateFunction(layers[l].inputs, errorLayer);
                }
        
                // execute first layer
                for (let j = 0; j < first.outputSize; j++) {
                    first.biases[j] -= learnRate * errorLayers[0][j];
                    for (let i = 0; i < first.inputSize; i++) {
                        first.weights[i][j] -= learnRate * first.inputs[i] * errorLayers[0][j];
                    }
                }
            }
            epoch++;
            if (epoch % 10000 == 0) 
                console.log('Epoch: ' + epoch + '; ' + 'Error: ' + error + '; ');
        } while (error > minError && epoch < maxEpoch);

        return {'error': error, 'epoch': epoch};
    }
}
