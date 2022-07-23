
class NeuralNetworkTrainSGD {
    config = {
        learn_rate: 0.001,
        min_error: 0.1,
        max_epoch: 1000,
    }

    train(network, trains, config = {}) {
        this.config = Object.assign(config, this.config);

        let cost = 0;
        let epoch = 0;
        do {
            cost = 0;
            for (let t = 0; t < trains.length; t++) {
                network.forwardPropagate(trains[t].inputs);
                cost +=  network.backPropagate(trains[t].outputs) / trains.length;

                for (let l = 0; l < network.layers.length - 1; l++) {
                    const layer = network.layers[l]
                    for (let j = 0; j < layer.outputSize; j++) {
                        layer.biases[j] -= this.config.learn_rate * layer.gradients[j];
                        for (let i = 0; i < layer.inputSize; i++) {
                            layer.weights[i][j] -= this.config.learn_rate * layer.inputs[i] * layer.gradients[j];
                        }
                    }
                }
            }

            if (epoch % 1000 == 0) {
                console.log('Epoch: ' + epoch + '; ' + 'Total Error: ' + (cost) + '; ');
            }

        } while (cost > this.config.min_error && ++epoch < this.config.max_epoch); // 4.508s

        return {'error': cost, 'epoch': epoch};
    }
} 
