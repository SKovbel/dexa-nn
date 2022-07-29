// SGD + Back Propagation inside, +15% speed
class NeuralNetworkTrainSGDBP {
    config = {
        learn_rate: 0.001,
        min_error: 0.1,
        max_epoch: 1000,
    }

    train(network, trains, config = {}) {
        this.config = Object.assign(this.config, config);

        let cost = 0;
        let epoch = 0;
        do {
            cost  = 0;
            for (let t = 0; t < trains.length; t++) {
                network.forwardPropagate(trains[t].inputs);

                let error = [];
                let errors = [];
        
                // output layer
                for (let j = 0; j < network.last.outputSize; j++) {
                    error[j] = network.last.outputs[j] - trains[t].outputs[j];
                    cost += error[j] * error[j];
                }
                errors[network.layers.length-1] = network.last.derivateFunction(network.last.outputs, error);
        
                // hidden layers
                for (let l = network.layers.length - 1; l > 0; l--) {
                    const layer = network.layers[l];
                    for (let j = 0; j < layer.outputSize; j++) {
                        layer.biases[j] -= learnRate * error[j];
                    }
                    for (let i = 0; i < layer.inputSize; i++) {
                        error[i] = 0;
                        for (let j = 0; j < layer.outputSize; j++) {
                            error[i] += layer.weights[i][j] * error[j];
                            layer.weights[i][j] -= learnRate * layer.inputs[i] * error[j];
                        }
                    }
                    errors[l-1] = network.layers[l-1].derivateFunction(layer.inputs, error);
                }
        
                // execute first layer
                for (let j = 0; j < network.firstLayer.outputSize; j++) {
                    network.firstLayer.biases[j] -= this.config.learn_rate * errors[0][j];
                    for (let i = 0; i < network.firstLayer.inputSize; i++) {
                        network.firstLayer.weights[i][j] -= this.config.learn_rate * network.firstLayer.inputs[i] * errors[0][j];
                    }
                }
            }
            epoch++;
            if (epoch % 10000 == 0) 
                console.log('Epoch: ' + epoch + '; ' + 'Error: ' + error + '; ');
        } while (cost > this.config.min_error && ++epoch < this.config.max_epoch); // 4.508s

        return {'error': error, 'epoch': epoch};
    }
}
