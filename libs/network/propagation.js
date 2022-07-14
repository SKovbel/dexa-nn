class NeuralNetworkBackPropagation {
    static SGD = 'sgd';
    static ADAM = 'adam';

    static backPropagate(network, outputs) {
        const layers = network.layers;
        const last = layers[layers.length - 1];

        let error = 0;
        let errors = [];

        // output layer
        for (let j = 0; j < last.outputs.length; j++) {
            errors[j] = last.outputs[j] - outputs[j];
            error += errors[j] * errors[j];
        }
        last.errors = last.derivateFunction(last.outputs, errors);

        // hidden layers
        for (let l = layers.length - 1; l > 0; l--) {
            errors = [];
            for (let i = 0; i < layers[l].inputs.length; i++) {
                errors[i] = 0;
                for (let j = 0; j < layers[l].outputs.length; j++) {
                    errors[i] += layers[l].weights[i][j] * layers[l].errors[j];
                }
            }
            layers[l-1].errors = layers[l-1].derivateFunction(layers[l].inputs, errors);
        }
        return error;
    }

    static train(network, algorithm, trains, rate = 0.01, error = 0.1, epoch = 1000) {
        const t0 = performance.now();
        let totalError  = 0;
        switch(algorithm) {
            case NeuralNetworkBackPropagation.ADAM:
                totalError = NeuralNetworkBackPropagationAdam.train(network, trains, rate, error, epoch);
                break;
            case NeuralNetworkBackPropagation.SGD:
            default:
                totalError = NeuralNetworkBackPropagationSGD.train(network, trains, rate, error, epoch);
                break;
        }
        const t1 = performance.now();
        console.log('Time: ' + (Math.round((t1 - t0), 2) / 1000) + 's Error=' + totalError);
        return totalError;
    }
}

