class NeuralNetwork {
    config = {
        loss: NeuralNetworkLoss.CROSS_ENTROPY,
        train: NeuralNetworkTrain.SGD,
        layers: {}
    }

    constructor(networkConfig = {}) {
        this.config = Object.assign(this.config, networkConfig);
        new NeuralNetworkLoss(this);
        new NeuralNetworkTrain(this);

        this.layers = [];
        for (let l = 0; l < this.config.layers.length - 1; l++) {
            let layerConfig = this.config.layers[l];
            layerConfig.outputSize = this.config.layers[l + 1].inputSize;
            this.layers.push(new NeuralNetworkLayer(layerConfig));
        }

        // aliases
        this.inputLayer = this.layers[0];
        this.outputLayer = this.layers[this.layers.length - 1];
    }

    forwardPropagate(inputs) {
        this.inputLayer.inputs = inputs;
        this.inputLayer.activate();
        for (let l = 1; l < this.layers.length; l++) {
            this.layers[l].inputs = this.layers[l - 1].outputs;
            this.layers[l].activate();
        }
        return this.outputLayer.outputs;
    }

    backPropagate(targets) {
        // output layer
        const loss = this.loss(targets);
        const dloss = this.dloss(targets);
        this.outputLayer.gradients = this.outputLayer.derivate(this.outputLayer.outputs, dloss);

        /*let error = 0;
        for (let j = 0; j < this.outputLayer.outputSize; j++) {
            errors[j] = this.outputLayer.outputs[j] - predicts[j];
            error += errors[j] * errors[j];
        }
        this.outputLayer.gradients = this.outputLayer.derivate(this.outputLayer.outputs, errors);
          */

        // hidden layers
        let errors = [];
        for (let l = this.layers.length - 1; l > 0; l--) {
            let errors = [];
            for (let i = 0; i < this.layers[l].inputSize; i++) {
                errors[i] = 0;
                for (let j = 0; j < this.layers[l].outputSize; j++) {
                    errors[j] += this.layers[l].weights[i][j] * this.layers[l].gradients[j];
                }
            }
            this.layers[l-1].gradients = this.layers[l-1].derivate(this.layers[l].inputs, errors);
        }

        // return total error
        return loss;
    }
}


class NeuralNetworkLayer {
    config = {
        inputSize: 0,
        outputSize: 0,
        activation: NeuralNetworkActivation.SIGMOID
    }

    constructor(layerConfig = {}) {
        this.config = Object.assign(this.config, layerConfig);
        new NeuralNetworkActivation(this);

        this.biases = new Array(this.config.outputSize);
        this.weights = new Array(this.config.inputSize);
        this.inputs = new Array(this.config.inputSize);
        this.outputs = new Array(this.config.outputSize);
        for (let i = 0; i < layerConfig.inputSize; i++) {
            this.weights[i] = new Array(layerConfig.outputSize);
        }

        // aliases
        this.inputSize = this.config.inputSize;
        this.outputSize = this.config.outputSize;

        this.randomize();
    }
     
    randomize() {
        for (let j = 0; j < this.outputSize; j++) {
            this.biases[j] = Math.random() * 2 - 1;
            for (let i = 0; i < this.inputSize; i++) {
                this.weights[i][j] = Math.random() * 2 - 1;
            }
        }
    }
}

class NeuralNetworkTrain {
    static SGD = 'sgd';
    static SGDBP = 'sgdbp';
    static ADAM = 'adam';

    constructor(network) {
        switch (network.config.train) {
            case NeuralNetworkTrain.SGD:
                this.processor = new NeuralNetworkTrainSGD()
                break;
            case NeuralNetworkTrain.SGDBP:
                this.processor = new NeuralNetworkTrainSGDBP()
                break;
            case NeuralNetworkTrain.ADAM:
                this.processor = new NeuralNetworkTrainAdam()
                break;
        }

        // implement train(...) function into network object
        network.train = (trains, learnRate = 0.01, minError = 0.1, maxEpoch = 1000) => {
            this.train(network, trains, learnRate, minError, maxEpoch)
        }
    }

    train(network, trains, learnRate, minError, maxEpoch) {
        const t0 = performance.now();
        const info = this.processor.train(network, trains, learnRate, minError, maxEpoch);
        const t1 = performance.now();
        console.log('Time: ' + (Math.round((t1 - t0), 2) / 1000) + 's; Error=' + (info['error']) + '; Epochs=' + info['epoch']);
        return info['error'];
    }
}
