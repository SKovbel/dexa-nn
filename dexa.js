;;class NeuralNetworkActivation {
    static RELU = 'relu';
    static LRELU = 'leaky-relu';
    static TANH = 'tanh';
    static SIGMOID = 'sigmoid';
    static SOFTMAX = 'softmax';

    constructor(layer, activation) {
        switch (activation) {
            case NeuralNetworkActivation.RELU:
                layer.activate = this.relu;
                layer.dactivate = this.drelu;
                break;
            case NeuralNetworkActivation.LRELU:
                layer.activate = this.lrelu;
                layer.dactivate = this.dlrelu;
                break;
            case NeuralNetworkActivation.TANH:
                layer.activate = this.tanh;
                layer.dactivate = this.dtanh;
                break;
            case NeuralNetworkActivation.SIGMOID:
                layer.activate = this.sigmoid;
                layer.dactivate = this.dsigmoid;
                break;
            case NeuralNetworkActivation.SOFTMAX:
                layer.activate = this.softmax;
                layer.dactivate = this.dsoftmax;
                break;
        }
    }

    // TANH ----------------------------------
    tanh() { // -1..1
        for (let j = 0; j < this.outputSize; j++) {
            let x = this.biases[j];
            for (let i = 0; i < this.inputSize; i++) {
                x += this.inputs[i] * this.weights[i][j];
            }
            this.outputs[j] = Math.tanh(x);
        }
    }
    dtanh(inputs, errors) {
        let result = [];
        for (let i = 0; i < inputs.length; i++) {
            let tanh = Math.tanh(inputs[i]);
            const deriviate  = 1 - tanh * tanh;
            result[i] = errors[i] * deriviate;
        }
        return result;
    }

    // SIGMOID ------------------------------
    sigmoid() { // 0..1
        for (let j = 0; j < this.outputSize; j++) {
            let x = this.biases[j];
            for (let i = 0; i < this.inputSize; i++) {
                x += this.inputs[i] * this.weights[i][j];
            }
            this.outputs[j] = 1 / (1 + Math.exp(-x));
        }
    }
    dsigmoid(inputs, errors) {
        let result = [];
        for (let i = 0; i < inputs.length; i++) {
            const deriviate = inputs[i] * (1 - inputs[i]);
            result[i] = errors[i] * deriviate;
        }
        return result;
    }

    // RELU ----------------------------------
    relu() { // 0..1
        for (let j = 0; j < this.outputSize; j++) {
            let x = this.biases[j];
            for (let i = 0; i < this.inputSize; i++) {
                x += this.inputs[i] * this.weights[i][j];
            }
            this.outputs[j] = x > 0 ? 1 : 0;
        }
    }
    drelu(inputs, errors) {
        let result = [];
        for (let i = 0; i < inputs.length; i++) {
            const deriviate = inputs[i] > 0 ? 1 : 0 * inputs[i];
            result[i] = errors[i] * deriviate;
        }
        return result;
    }

    // LEAKY RELU ----------------------------------
    lrelu() { // 0..1
        for (let j = 0; j < this.outputSize; j++) {
            let x = this.biases[j];
            for (let i = 0; i < this.inputSize; i++) {
                x += this.inputs[i] * this.weights[i][j];
            }
            this.outputs[j] = x > 0 ? 1 : 0.01 * x;
        }
    }
    dlrelu(inputs, errors) {
        let result = [];
        for (let i = 0; i < inputs.length; i++) {
            const deriviate = inputs[i] > 0 ? 1 : 0.01 * inputs[i];
            result[i] = errors[i] * deriviate;
        }
        return result;
    }

    // SOFTMAX -------------------------------

    softmax() { // 0..1, sum(all) = 1
        let sum = 0;
        let exp = [];
        for (let j = 0; j < this.outputSize; j++) {
            let x = this.biases[j];
            for (let i = 0; i < this.inputSize; i++) {
                x += this.inputs[i] * this.weights[i][j];
            }
            exp[j] = Math.exp(x);
            sum += exp[j];
        }
        for (let j = 0; j < this.outputSize; j++) {
            this.outputs[j] = exp[j] / sum;
        }
    }
    dsoftmax(inputs, errors) {
        let x = [];
        let exp = [];
        let sum = 0;
        let result = [];

        // activation
        for (let i = 0; i < inputs.length; i++) {
            exp[i] = Math.exp(inputs[i]);
            sum += exp[i];
        }

        for (let i = 0; i < inputs.length; i++) {
            x[i] = exp[i] / sum;
        }

        // deriviation
        for (let i = 0; i < inputs.length; i++) {
            result[i] = 0;
            for (let j = 0; j < inputs.length; j++) {
                if (i == j) {
                    result[i] += x[i] * errors[i] * (1 - x[j]);
                } else {
                    result[i] += x[i] * errors[j] * (0 - x[j]);
                }
            }
        }
        return result;
    }
}
;// cost, loss, total error
class NeuralNetworkLoss {
    static ME = 'me'; // Mean Error
    static MAE = 'mae'; // Mean Absolute Error
    static MSE = 'mse'; // Mean Squared Error
    static RMSE = 'rmse';
    static CROSS_ENTROPY = 'cross_entropy';

    constructor(network, loss) {
        switch (loss) {
            case NeuralNetworkLoss.ME:
                network.loss = this.me;
                network.dloss = this.dme;
                break;
            case NeuralNetworkLoss.MAE:
                network.loss = this.mae;
                network.dloss = this.dmae;
                break;
            case NeuralNetworkLoss.MSE:
                network.loss = this.mse;
                network.dloss = this.dmse; // deriviate
                break;
            case NeuralNetworkLoss.RMSE:
                network.loss = this.rmse;
                break;
            case NeuralNetworkLoss.CROSS_ENTROPY:
                network.loss = this.crossEntropy;
                network.dloss = this.dcrossEntropy;
                break;
        }
    }

    // ME ----------------------------------
    me(targets) {
        let loss = 0;
        for (let j = 0; j < this.lastLayer.outputSize; j++) {
            loss += this.lastLayer.outputs[j] - targets[j];
        }
        return loss / this.lastLayer.outputSize;
    }

    dme(targets) {
        let loss = [];
        for (let j = 0; j < this.lastLayer.outputSize; j++) {
            loss[j] = 1;
        }
        return loss;
    }

    // MAE ----------------------------------
    mae(targets) {
        let loss = 0;
        for (let j = 0; j < this.lastLayer.outputSize; j++) {
            const error = this.lastLayer.outputs[j] - targets[j];
            loss += error >= 0 ? error : -error; // abs
        }
        return loss / this.lastLayer.outputSize;
    }
    dmae(targets) {
        let loss = [];
        for (let j = 0; j < this.lastLayer.outputSize; j++) {
            loss[j] = targets[j] > this.lastLayer.outputs[j] ? 1 : -1;
        }
        return loss;
    }

    // MSE ----------------------------------
    mse(targets) {
        let loss = 0;
        for (let j = 0; j < this.lastLayer.outputSize; j++) {
            const error = this.lastLayer.outputs[j] - targets[j];
            loss += 0.5 * error * error;
        }
        return loss / this.lastLayer.outputSize;
    }

    dmse(targets) {
        let loss = [];
        for (let j = 0; j < this.lastLayer.outputSize; j++) {
            loss[j] = this.lastLayer.outputs[j] - targets[j];
        }
        return loss;
    }

    // RMSE ----------------------------------
    rmse(targets) {
        return Math.sqrt(this.mse(targets));
    }

    // CROSS_ENTROPY ----------------------------------
    crossEntropy(targets) {
        let loss = 0;
        for (let j = 0; j < this.lastLayer.outputSize; j++) {
            loss += -1 * targets[j] * Math.log(this.lastLayer.outputs[j]);
        }
        return loss / this.lastLayer.outputSize
    }

    dcrossEntropy(targets) {
        let loss = [];
        for (let j = 0; j < this.lastLayer.outputSize; j++) {
            loss[j] = this.lastLayer.outputs[j] - targets[j];
        }
        return loss;
    }
}
;class NeuralNetworkLayer {
    biases = [];
    inputs = [];
    outputs = [];
    weights = [];

    defaultConfig = {
        inputSize: 0,
        outputSize: 0,
        activation: NeuralNetworkActivation.SIGMOID
    };

    constructor(layerConfig = {}, layer = null) {
        const config = Object.assign(this.defaultConfig, layerConfig);
        new NeuralNetworkActivation(this, config.activation);

        if (layer) {
            this.biases = layer.biases;
            this.weights = layer.weights;
        } else {
            for (let j = 0; j < config.outputSize; j++) {
                this.biases[j] = Math.random() * 2 - 1;
            }
            for (let i = 0; i < config.inputSize; i++) {
                this.weights[i] = new Array();
                for (let j = 0; j < config.outputSize; j++) {
                    this.weights[i][j] = Math.random() * 2 - 1;
                }
            }
        }

        // aliases
        this.inputSize = config.inputSize;
        this.outputSize = config.outputSize;
    }
}

class NeuralNetwork {
    config = {}
    layers = [];

    defaultConfig = {
        loss: NeuralNetworkLoss.CROSS_ENTROPY,
        train: NeuralNetworkTrain.SGD,
        layers: []
    };

    constructor(networkConfig = {}, layers = null) {
        this.config = Object.assign(this.defaultConfig, networkConfig);
        new NeuralNetworkLoss(this, this.config.loss);
        new NeuralNetworkTrain(this, this.config.train);

        for (let l = 0; l < this.config.layers.length - 1; l++) {
            this.config.layers[l].outputSize = this.config.layers[l + 1].inputSize;
            this.layers.push(new NeuralNetworkLayer(this.config.layers[l], layers ? layers[l] : null));
        }

        // aliases
        this.firstLayer = this.layers[0];
        this.lastLayer = this.layers[this.layers.length - 1];
    }

    forwardPropagate(inputs) {
        this.firstLayer.inputs = inputs;
        this.firstLayer.activate();
        for (let l = 1; l < this.layers.length; l++) {
            this.layers[l].inputs = this.layers[l - 1].outputs;
            this.layers[l].activate();
        }
        return this.lastLayer.outputs;
    }

    backPropagate(targets) {
        // output layer
        const loss = this.loss(targets);
        const dloss = this.dloss(targets);
        this.lastLayer.gradients = this.lastLayer.dactivate(this.lastLayer.outputs, dloss);

        // hidden layers
        for (let l = this.layers.length - 1; l > 0; l--) {
            let errors = [];
            for (let i = 0; i < this.layers[l].inputSize; i++) {
                errors[i] = 0;
                for (let j = 0; j < this.layers[l].outputSize; j++) {
                    errors[j] += this.layers[l].weights[i][j] * this.layers[l].gradients[j];
                }
            }
            this.layers[l-1].gradients = this.layers[l-1].dactivate(this.layers[l].inputs, errors);
        }

        // return total error
        return loss;
    }
}
;class NeuralNetworkTool {
    import(data, mutation = 0) {
        const nnData = (typeof data === 'string') ? JSON.parse(data) : data;
        const network = new NeuralNetwork(nnData.config, nnData.layers);
        console.log(network);
        this.mutate(network, mutation);
        return network;
    }

    export(network) {
        let layers = [];
        for (let l = 0; l < network.layers; l++) {
            layers[l] = {
                biases: layers[l].biases,
                weights: layers[l].weights
            }
        }
        return JSON.stringify({
            config: network.config,
            layers: layers
        });
    }

    clone(network, mutation = 0) {
        let newLayers = [];
        for (let l = 0; l < network.layers.length; l++) {
            const layer = network.layers[l];
            let newBiases = [];
            let newWeights = [];
            for (let i = 0; i < layer.inputSize; i++) {
                newWeights[i] = [];
                for (let j = 0; j < layer.outputSize; j++) {
                    newWeights[i][j] = layer.weights[i][j];
                }
            }
            for (let j = 0; j < layer.outputSize; j++) {
                newBiases[j] = layer.biases[j];
            }
            newLayers.push({'activation': layer.activation, 'weights': newWeights, 'biases': newBiases});
        }
        const newNetwork = {'layers': newLayers};
        return NeuralNetworkTool.import(newNetwork, mutation);
    }

    mutate(network, mutation = 0) {
        for (let l = 0; mutation != 0 && l < network.layers.length; l++) {
            const layer = network.layers[l];
            for (let j = 0; j < layer.outputSize; j++) {
                for (let i = 0; i < layer.inputSize; i++) {
                    layer.weights[i][j] = this.#lerp(layer.weights[i][j], 2 * Math.random() - 1, mutation);
                }
                layer.biases[j] = this.#lerp(layer.biases[j], 2 * Math.random() - 1, mutation);
            }
        }
    }

    #lerp(A, B, t) {
        return A + t*(B - A);
    }
}
;;class NeuralNetworkTrain {
    static SGD = 'sgd';
    static SGDBP = 'sgdbp';
    static ADAM = 'adam';

    constructor(network, train) {
        switch (train) {
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
        network.train = (trains, config) => {
            this.train(network, trains, config)
        }
    }

    train(network, trains, config) {
        const t0 = performance.now();
        const info = this.processor.train(network, trains, config);
        const t1 = performance.now();
        console.log('Time: ' + (Math.round((t1 - t0), 2) / 1000) + 's; Error=' + (info['error']) + '; Epochs=' + info['epoch']);
        return info['error'];
    }
}
;
class NeuralNetworkTrainAdam {
    config = {
        learn_rate: 0.001,
        min_error: 0.1,
        max_epoch: 1000,
        beta1: 0.901,
        beta2: 0.999,
        epsilon: 0.000000001
    }

    train(network, trains, config = {}) {
        this.config = Object.assign(config, this.config);

        for (let l = 0; l < network.layers.length; l++) {
            const layer = network.layers[l];
            layer.momentM = [];
            layer.momentV = [];
            for (let i = 0; i < layer.inputSize + 1; i++) { // +1 for biases moments
                layer.momentM[i] = [];
                layer.momentV[i] = [];
                for (let j = 0; j < layer.outputSize; j++) {
                    layer.momentM[i][j] = 0;
                    layer.momentV[i][j] = 0;
                }
            }
        }

        let cost = 0;
        let epoch = 0;
        do {
            cost = 0;
            for (let t = 0; t < trains.length; t++) {
                network.forwardPropagate(trains[t].inputs);
                cost += network.backPropagate(trains[t].outputs) / trains.length;

                for (let l = 0; l < network.layers.length; l++) {
                    const layer = network.layers[l];
                    const biasIdx = layer.inputSize;

                    for (let j = 0; j < layer.outputSize; j++) {
                        const bgrad = layer.biases[j] * layer.gradients[j]
                        layer.momentM[biasIdx][j] = this.config.beta1 * layer.momentM[biasIdx][j] + (1.0 - this.config.beta1) * bgrad
                        layer.momentV[biasIdx][j] = this.config.beta2 * layer.momentV[biasIdx][j] + (1.0 - this.config.beta2) * bgrad * bgrad;
                        const m = layer.momentM[biasIdx][j] / (1 - this.config.beta1);
                        const v = layer.momentV[biasIdx][j] / (1 - this.config.beta2);
                        layer.biases[j] -= this.config.learn_rate * m / (Math.sqrt(v) + this.config.epsilon);

                        for (let i = 0; i < layer.inputSize; i++) {
                            const wgrad = layer.inputs[i] * layer.gradients[j];
                            layer.momentM[i][j] = this.config.beta1 * layer.momentM[i][j] + (1.0 - this.config.beta1) * wgrad;
                            layer.momentV[i][j] = this.config.beta2 * layer.momentV[i][j] + (1.0 - this.config.beta2) * wgrad * wgrad;
                            const m = layer.momentM[i][j] / (1 - this.config.beta1);
                            const v = layer.momentV[i][j] / (1 - this.config.beta2);
                            layer.weights[i][j] -= this.config.learn_rate * m / (Math.sqrt(v) + this.config.epsilon);
                        }
                    }
                }
            }
        } while (cost > this.config.min_error && ++epoch < this.config.max_epoch);

        return {'error': cost, 'epoch': epoch};
    }
}
;// SGD + Back Propagation inside, +15% speed
class NeuralNetworkTrainSGDBP {
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
;
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
;class NeuralNetworkPrint {
    static printNetwork(network) {
        console.log('#Network');
        for (let l = 0; l < network.layers.length; l++) {
            const layer = network.layers[l];
            console.log('Layer ' + l + ':');
            let lineb = '';
            for (let i = 0; i < layer.inputSize; i++) {
                let linew = 'W' + i + ': ';
                for (let j = 0; j < layer.outputSize; j++) {
                    linew += String(Math.round(100*layer.weights[i][j])/100).padStart(10);
                    if (i == 0) {
                        lineb += String(Math.round(100*layer.biases[i])/100).padStart(10) + 'b';
                    }
                }
                console.log(linew);
            }
            console.log('B: ' + lineb);
        }
    }

    static printArray(data, title) {
        console.log(title ? title + ' ' : '#Array');
        let line = '';
        for (let i = 0; i < data.length; i++) {
            line += String(Math.round(10000*data[i])/10000).padStart(10);
        }
        console.log(line);
    }

    static printMatrix(data, title) {
        console.log(title ? title + ' ' : '#Matrix');
        for (let i = 0; i < data.length; i++) {
            let lineb = i + ':';
            for (let j = 0; j < data[i].length; j++) {
                lineb += String(Math.round(1000*data[i][j])/1000).padStart(10);
            }
            console.log(lineb);
        }
    }
}

class NeuralNetworkVisualizer {
    static drawNetwork(ctx, network, outputLabels = []) {
        const margin = 20;

        const top = margin;
        const left = margin;
        const width = ctx.canvas.width - 2*margin;
        const height = ctx.canvas.height - 2*margin;
        const layerHeight = height/network.layers.length;

        for (let i = network.layers.length - 1; i >= 0; i--) {
            const layerTop = top + NeuralNetworkVisualizer.#lerp(network.layers, i, height-layerHeight, 0);
            NeuralNetworkVisualizer.drawLayer(
                ctx,
                network.layers[i],
                left, layerTop,
                width, layerHeight,
                i == network.layers.length-1 ? outputLabels : []
            );
        }
    }

    static drawLayer(ctx, layer, left, top, width, height, outputLabels) {
        const right = left + width;
        const bottom = top + height;
        const nodeRadius = 18;
        const {activation, inputs, outputs, weights, biases} = layer;

        ctx.setLineDash([7, 3]);
        for (let i = 0; i < layer.inputSize; i++) {
            for (let j = 0; j < layer.outputSize; j++) {
                ctx.beginPath();
                ctx.moveTo(NeuralNetworkVisualizer.#lerp(inputs, i, left, right), bottom);
                ctx.lineTo(NeuralNetworkVisualizer.#lerp(outputs, j, left, right), top)
                ctx.lineWidth = 2;
                ctx.strokeStyle = this.getRGBA(weights[i][j]);
                ctx.stroke();
            }
        }
        ctx.setLineDash([]);

        ctx.font = "16px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(activation, left - 10, bottom - 30);

        for (let i = 0; i < layer.inputSize; i++) {
            const x = NeuralNetworkVisualizer.#lerp(inputs, i, left, right);

            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius, 0, 2*Math.PI);
            ctx.fillStyle = "black";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, bottom, 0.6*nodeRadius, 0, 2*Math.PI);
            ctx.fillStyle = this.getRGBA(inputs[i]);
            ctx.fill();
        }

        for (let i = 0; i < layer.outputSize; i++) {
            const x = NeuralNetworkVisualizer.#lerp(outputs, i, left, right);

            ctx.beginPath();
            ctx.arc(x, top, nodeRadius, 0, 2*Math.PI);
            ctx.fillStyle = "black";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, top, 0.6*nodeRadius, 0, 2*Math.PI);
            ctx.fillStyle = this.getRGBA(outputs[i]);
            ctx.fill();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.arc(x, top, 0.8*nodeRadius, 0, 2*Math.PI);
            ctx.setLineDash([3, 3]);
            ctx.strokeStyle = this.getRGBA(biases[i]);
            ctx.stroke();
            ctx.setLineDash([]);

            if (outputLabels[i]) {
                ctx.beginPath();
                ctx.font = (1.2*nodeRadius) + "px Arial";
                ctx.textAlign = "center";
                ctx.textBaseLine = "middle";
                ctx.fillStyle = "black";
                ctx.fillText(outputLabels[i], x, top + nodeRadius*0.2);
                ctx.lineWidth = 0.5;
                ctx.strokeStyle = "white";
                ctx.strokeText(outputLabels[i], x, top + nodeRadius*0.2);
            }
        }
    }

    static #lerp(nodes, index, A, B) {
        const t = nodes.length == 1 ? 0.5 : index / (nodes.length - 1);
        return A + t*(B - A);
    }

    static getRGBA(value) {
        const alpha = Math.abs(value);
        const R = value < 0 ? 0 : 255;
        const G = value < 0 ? 0 : 255;
        const B = value > 0 ? 0 : 255;
        return "rgba(" + R + ", " + G + ", " + B + ", " + alpha + ")";
    }
}
