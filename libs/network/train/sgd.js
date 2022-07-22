
class NeuralNetworkTrainSGD {
    train(network, trains, learnRate = 0.001, minError = 0.1, maxEpoch = 1000, options = {}) {
        const layers = network.layers;

        let cost = 0;
        let epoch = 0;
        do {
            cost = 0;
            for (let t = 0; t < trains.length; t++) {
                network.forwardPropagate(trains[t].inputs);
                cost +=  network.backPropagate(trains[t].outputs) / trains.length;

                for (let l = 0; l < layers.length - 1; l++) {
                    for (let j = 0; j < layers[l].outputSize; j++) {
                        layers[l].biases[j] -= learnRate * layers[l].gradients[j];
                        for (let i = 0; i < layers[l].inputSize; i++) {
                            layers[l].weights[i][j] -= learnRate * layers[l].inputs[i] * layers[l].gradients[j];
                        }
                    }
                }
            }

            if (epoch % 1000 == 0) {
                console.log('Epoch: ' + epoch + '; ' + 'Total Error: ' + (cost) + '; ');
            }

        } while (cost > minError && ++epoch < maxEpoch); // 4.508s

        return {'error': cost, 'epoch': epoch};
    }
} 
