// SGD + Back Propagation inside, +15% speed
class NeuralNetworkTrainSGDOrg {
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
                let grads = [];

                // forward
                network.firstLayer.inputs = trains[t].inputs;
                network.firstLayer.activate();
                for (let l = 1; l < network.layers.length; l++) {
                    network.layers[l].inputs = network.layers[l - 1].outputs;
                    network.layers[l].activate();
                }
        
                // output layer
                let errors = [];
                for (let j = 0; j < network.lastLayer.outputSize; j++) {
                    errors[j] = network.lastLayer.outputs[j] - trains[t].outputs[j];
                    cost += errors[j] * errors[j];
                }
                grads[network.layers.length-1] = network.lastLayer.dactivate(network.lastLayer.outputs, errors);
        
                // hidden layers + first
                for (let l = network.layers.length - 1; l >= 0; l--) {
                    const layer = network.layers[l];
                    let errors = [];
                    for (let i = 0; i < layer.inputSize; i++) {
                        errors[i] = 0;
                        for (let j = 0; j < layer.outputSize; j++) {
                            if (i == 0) { // update biases only once
                                layer.biases[j] -= this.config.learn_rate * grads[l][j];
                            }
                            errors[i] += layer.weights[i][j] * grads[l][j];
                            layer.weights[i][j] -= this.config.learn_rate * layer.inputs[i] * grads[l][j];
                        }
                    }
                    if (l > 0) { // ignore first layer
                        grads[l-1] = network.layers[l-1].dactivate(layer.inputs, errors);
                    }
                }
            }
            if (epoch % 10000 == 0) {
                console.log('Epoch: ' + epoch + '; ' + 'Error: ' + cost + '; ');
            }
            epoch++;
        } while (cost > this.config.min_error && ++epoch < this.config.max_epoch); // 4.508s

        return {'error': cost, 'epoch': epoch};
    }
}
