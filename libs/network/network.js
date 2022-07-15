class NeuralNetwork {
    constructor(layersConfig) {
        this.layers = [];
        for (let l = 0; l < layersConfig.length - 1; l++) {
            this.layers.push(new NeuralNetworkLayer(
                layersConfig[l].size, 
                layersConfig[l + 1].size,
                layersConfig[l].activation
            ));
        }
    }

    static forwardPropagate(network, inputs) {
        network.layers[0].inputs = inputs;
        network.layers[0].activationFunction();
        for (let l = 1; l < network.layers.length; l++) {
            network.layers[l].inputs = network.layers[l - 1].outputs;
            network.layers[l].activationFunction();
        }
        return network.layers[network.layers.length - 1].outputs;
    }

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
        last.gradients = last.derivateFunction(last.outputs, errors);

        // hidden layers
        for (let l = layers.length - 1; l > 0; l--) {
            errors = [];
            for (let i = 0; i < layers[l].inputs.length; i++) {
                errors[i] = 0;
                for (let j = 0; j < layers[l].outputs.length; j++) {
                    errors[i] += layers[l].weights[i][j] * layers[l].gradients[j];
                }
            }
            layers[l-1].gradients = layers[l-1].derivateFunction(layers[l].inputs, errors);
        }
            return error;
    }
}


class NeuralNetworkLayer {
    constructor(inputCount, outputCount, activation = NeuralNetworkActivation.RELU) {
        this.activation = activation;
        this.biases = new Array(outputCount);
        this.weights = new Array(inputCount);
        for (let j = 0; j < inputCount; j++) {
            this.weights[j] = new Array(outputCount);
        }
        NeuralNetworkLayer.init(this);
        NeuralNetworkLayer.randomize(this);
    }

    // public init, used in load
    static init(layer) {
        layer.inputs = new Array(layer.weights.length);
        layer.outputs = new Array(layer.biases.length);
        NeuralNetworkActivation.init(layer);
    }

    static randomize(layer) {
        for (let j = 0; j < layer.biases.length; j++) {
            for (let i = 0; i < layer.weights.length; i++) {
                layer.weights[i][j] = Math.random() * 2 - 1;
            }
            layer.biases[j] = Math.random() * 2 - 1;
        }
    }
}

class NeuralNetworkTrain {
    static SGD = 'sgd';
    static SGDBP = 'sgdbp';
    static ADAM = 'adam';

    static train(network, algorithm , trains, rate = 0.01, error = 0.1, epoch = 1000) {
        const t0 = performance.now();
        let totalError  = 0;
        switch(algorithm) {
            case NeuralNetworkTrain.ADAM:
                totalError = NeuralNetworkTrainAdam.train(network, trains, rate, error, epoch);
                break;
            case NeuralNetworkTrain.SGDBP:
                totalError = NeuralNetworkTrainSGDBP.train(network, trains, rate, error, epoch);
                break;
            case NeuralNetworkTrain.SGD:
                totalError = NeuralNetworkTrainSGD.train(network, trains, rate, error, epoch);
                break;
        }
        const t1 = performance.now();
        console.log('Time: ' + (Math.round((t1 - t0), 2) / 1000) + 's Error=' + totalError);
        return totalError;
    }
}
