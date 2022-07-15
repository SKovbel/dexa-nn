
class NeuralNetworkTrainSGD {
    static train(network, trains, learnRate = 0.001, minError = 0.1, maxEpoch = 1000) {
        const layers = network.layers;

        let epoch = 0;
        let error = 0;
        do {
            error = 0;
            for (let t = 0; t < trains.length; t++) {
                NeuralNetwork.forwardPropagate(network, trains[t].inputs);
                error +=  NeuralNetwork.backPropagate(network, trains[t].outputs);

                for (let l = 0; l < layers.length - 1; l++) {
                    for (let j = 0; j < layers[l].outputs.length; j++) {
                        layers[l].biases[j] -= learnRate * layers[l].gradients[j];
                        for (let i = 0; i < layers[l].inputs.length; i++) {
                            layers[l].weights[i][j] -= learnRate * layers[l].inputs[i] * layers[l].gradients[j];
                        }
                    }
                }
            }

            if (epoch % 10000 == 0) 
                console.log('Epoch: ' + epoch + '; ' + 'Total Error: ' + error + '; ');

        } while (error > minError && ++epoch < maxEpoch); // 4.508s

        return {'error': error, 'epoch': epoch};
    }
} 
