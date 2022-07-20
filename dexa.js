;;class NeuralNetworkActivation {
    static RELU = 'relu';
    static LRELU = 'leaky-relu';
    static TANH = 'tanh';
    static SIGMOID = 'sigmoid';
    static SOFTMAX = 'softmax';

    static init(layer) {
        switch (layer.activation) {
            case NeuralNetworkActivation.RELU:
                layer.activationFunction = this.relu;
                layer.derivateFunction = this.drelu;
                break;
            case NeuralNetworkActivation.LRELU:
                layer.activationFunction = this.lrelu;
                layer.derivateFunction = this.dlrelu;
                break;
            case NeuralNetworkActivation.TANH:
                layer.activationFunction = this.tanh;
                layer.derivateFunction = this.dtanh;
                break;
            case NeuralNetworkActivation.SIGMOID:
                layer.activationFunction = this.sigmoid;
                layer.derivateFunction = this.dsigmoid;
                break;
            case NeuralNetworkActivation.SOFTMAX:
                layer.activationFunction = this.softmax;
                layer.derivateFunction = this.dsoftmax;
                break;
        }
    }

    // TANH ----------------------------------

    static tanh() { // -1..1
        for (let j = 0; j < this.outputSize; j++) {
            let x = this.biases[j];
            for (let i = 0; i < this.inputSize; i++) {
                x += this.inputs[i] * this.weights[i][j];
            }
            this.outputs[j] = Math.tanh(x);
        }
    }
    static dtanh(inputs, errors) {
        let result = [];
        for (let i = 0; i < inputs.length; i++) {
            let tanh = Math.tanh(inputs[i]);
            const deriviate  = 1 - tanh * tanh;
            result[i] = errors[i] * deriviate;
        }
        return result;
    }

    // SIGMOID ------------------------------

    static sigmoid() { // 0..1
        for (let j = 0; j < this.outputSize; j++) {
            let x = this.biases[j];
            for (let i = 0; i < this.inputSize; i++) {
                x += this.inputs[i] * this.weights[i][j];
            }
            this.outputs[j] = 1 / (1 + Math.exp(-x));
        }
    }
    static dsigmoid(inputs, errors) {
        let result = [];
        for (let i = 0; i < inputs.length; i++) {
            const deriviate = inputs[i] * (1 - inputs[i]);
            result[i] = errors[i] * deriviate;
        }
        return result;
    }

    // RELU ----------------------------------

    static relu() { // 0..1
        for (let j = 0; j < this.outputSize; j++) {
            let x = this.biases[j];
            for (let i = 0; i < this.inputSize; i++) {
                x += this.inputs[i] * this.weights[i][j];
            }
            this.outputs[j] = x > 0 ? 1 : 0;
        }
    }
    static drelu(inputs, errors) {
        let result = [];
        for (let i = 0; i < inputs.length; i++) {
            const deriviate = inputs[i] > 0 ? 1 : 0 * inputs[i];
            result[i] = errors[i] * deriviate;
        }
        return result;
    }

    // LEAKY RELU ----------------------------------

    static lrelu() { // 0..1
        for (let j = 0; j < this.outputSize; j++) {
            let x = this.biases[j];
            for (let i = 0; i < this.inputSize; i++) {
                x += this.inputs[i] * this.weights[i][j];
            }
            this.outputs[j] = x > 0 ? 1 : 0.01 * x;
        }
    }
    static dlrelu(inputs, errors) {
        let result = [];
        for (let i = 0; i < inputs.length; i++) {
            const deriviate = inputs[i] > 0 ? 1 : 0.01 * inputs[i];
            result[i] = errors[i] * deriviate;
        }
        return result;
    }

    // SOFTMAX -------------------------------

    static softmax() { // 0..1, sum(all) = 1
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
    static dsoftmax(inputs, errors) {
        let x = [];
        let exp = [];
        let sum = 0;
        let result = [];

        // activation
        for (let i = 0; i < inputs.length; i++) {this
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
;class NeuralNetwork {
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
        for (let j = 0; j < last.outputSize; j++) {
            errors[j] = last.outputs[j] - outputs[j];
            error += errors[j] * errors[j];
        }
        last.gradients = last.derivateFunction(last.outputs, errors);

        // hidden layers
        for (let l = layers.length - 1; l > 0; l--) {
            errors = [];
            for (let i = 0; i < layers[l].inputSize; i++) {
                errors[i] = 0;
                for (let j = 0; j < layers[l].outputSize; j++) {
                    errors[j] += layers[l].weights[i][j] * layers[l].gradients[j];
                }
            }
            layers[l-1].gradients = layers[l-1].derivateFunction(layers[l].inputs, errors);
        }
        return error;
    }
}


class NeuralNetworkLayer {
    constructor(inputCount, outputCount, activation = NeuralNetworkActivation.SIGMOID) {
        this.biases = new Array(outputCount);
        this.weights = new Array(inputCount);
        this.activation = activation;
        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
        }
        NeuralNetworkLayer.init(this);
        NeuralNetworkLayer.randomize(this);
    }

    // public init, used in load
    static init(layer) {
        layer.inputSize = layer.weights.length;
        layer.outputSize = layer.biases.length; 
        layer.inputs = new Array(layer.inputSizeh);
        layer.outputs = new Array(layer.outputSize);
        NeuralNetworkActivation.init(layer);
    }

    static randomize(layer) {
        for (let j = 0; j < layer.outputSize; j++) {
            for (let i = 0; i < layer.inputSize; i++) {
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

    static train(network, algorithm , trains, learnRate = 0.01, minError = 0.1, maxEpoch = 1000) {
        const t0 = performance.now();
        const  totalError = 0;
        let info = {'error': 0, 'epoch': 0};
        switch(algorithm) {
            case NeuralNetworkTrain.ADAM:
                info = NeuralNetworkTrainAdam.train(network, trains, learnRate, minError, maxEpoch);
                break;
            case NeuralNetworkTrain.SGDBP:
                info = NeuralNetworkTrainSGDBP.train(network, trains, learnRate, minError, maxEpoch);
                break;
            case NeuralNetworkTrain.SGD:
                info = NeuralNetworkTrainSGD.train(network, trains, learnRate, minError, maxEpoch);
                break;
        }
        const t1 = performance.now();
        console.log('Time: ' + (Math.round((t1 - t0), 2) / 1000) + 's; Error=' + (info['error']) + '; Epochs=' + info['epoch']);
        return totalError;
    }
}
;class NeuralNetworkTool {
    static import(data, mutation = 0) {
        const network = (typeof data === 'string') ? JSON.parse(data) : data;
        for (let l = 0; l < network.layers.length; l++) {
            NeuralNetworkLayer.init(network.layers[l]);
        }
        NeuralNetworkTool.mutate(network, mutation);
        return network;
    }

    static export(network) {
        return JSON.stringify(network, (key, value) => {
            if (['inputs', 'outputs', 'gradients', 'momentM', 'momentV', 'inputSize', 'outputSize'].indexOf(key) >= 0 ) {
                return;
            }
            return value;
        });
    }

    static clone(network, mutation = 0) {
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

    static mutate(network, mutation = 0) {
        for (let l = 0; mutation != 0 && l < network.layers.length; l++) {
            const layer = network.layers[l];
            for (let j = 0; j < layer.outputSize; j++) {
                for (let i = 0; i < layer.inputSize; i++) {
                    layer.weights[i][j] = this.#lerp(layer.weights[i][j], 2*Math.random() - 1, mutation);
                }
                layer.biases[j] = this.#lerp(layer.biases[j], 2 * Math.random() - 1, mutation);
            }
        }
    }

    static #lerp(A, B, t) {
        return A + t*(B - A);
    }
}
;;
class NeuralNetworkTrainAdam {
    static options = {
        rateScale: {
            epochStep: 10000,
            multiply: 0.95
        },
        mutate: 0.1
    }

    static train(network, trains, learnRate = 0.001, minError = 0.1, maxEpoch = 1000, options = {}) {
        options = Object.assign(options, this.options);
        const layers = network.layers;

        let epoch = 0;
        let error = 0;
        let prevError = 0;

        const beta1 = 0.901;
        const beta2 = 0.999;
        const epsilon = 0.000000001;

        for (let l = 0; l < layers.length; l++) {
            const layer = layers[l];
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

        do {
            prevError = error;
            error = 0;
            for (let t = 0; t < trains.length; t++) {
                NeuralNetwork.forwardPropagate(network, trains[t].inputs);
                error += NeuralNetwork.backPropagate(network, trains[t].outputs);

                for (let l = 0; l < layers.length; l++) {
                    const layer = layers[l];
                    const biasIdx = layer.inputSize;

                    for (let j = 0; j < layer.outputSize; j++) {
                        const bgrad = layer.biases[j] * layer.gradients[j]
                        layer.momentM[biasIdx][j] = beta1 * layer.momentM[biasIdx][j] + (1.0 - beta1) * bgrad
                        layer.momentV[biasIdx][j] = beta2 * layer.momentV[biasIdx][j] + (1.0 - beta2) * bgrad * bgrad;
                        const m = layer.momentM[biasIdx][j] / (1 - beta1);
                        const v = layer.momentV[biasIdx][j] / (1 - beta2);
                        layer.biases[j] -= learnRate * m / (Math.sqrt(v) + epsilon);

                        for (let i = 0; i < layer.inputSize; i++) {
                            const wgrad = layer.inputs[i] * layer.gradients[j];
                            layer.momentM[i][j] = beta1 * layer.momentM[i][j] + (1.0 - beta1) * wgrad;
                            layer.momentV[i][j] = beta2 * layer.momentV[i][j] + (1.0 - beta2) * wgrad * wgrad;
                            const m = layer.momentM[i][j] / (1 - beta1);
                            const v = layer.momentV[i][j] / (1 - beta2);
                            layer.weights[i][j] -= learnRate * m / (Math.sqrt(v) + epsilon);
                        }
                    }
                }
            }
            if (epoch % options.rateScale.epochStep == 0) {
                learnRate *= this.options.rateScale.multiply;
                //console.log('Epoch: ' + epoch + '; ' + 'New Learning rate: ' + learnRate + '; ');
            }
            if (epoch % 10000 == 0 && epoch) {
                //console.log('Epoch: ' + epoch + '; ' + 'Total Error: ' + (error) + '; ');
            }
            if (options.mutate && prevError == error) {
                NeuralNetworkTool.mutate(network, options.mutate);
            }
        } while (error > minError && ++epoch < maxEpoch);

        return {'error': error, 'epoch': epoch};
    }
}
;// SGD + Back Propagation inside, +15% speed
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
;
class NeuralNetworkTrainSGD {
    static train(network, trains, learnRate = 0.001, minError = 0.1, maxEpoch = 1000, options = {}) {
        const layers = network.layers;

        let epoch = 0;
        let error = 0;
        do {
            error = 0;
            for (let t = 0; t < trains.length; t++) {
                NeuralNetwork.forwardPropagate(network, trains[t].inputs);
                error +=  NeuralNetwork.backPropagate(network, trains[t].outputs);

                for (let l = 0; l < layers.length - 1; l++) {
                    for (let j = 0; j < layers[l].outputSize; j++) {
                        layers[l].biases[j] -= learnRate * layers[l].gradients[j];
                        for (let i = 0; i < layers[l].inputSize; i++) {
                            layers[l].weights[i][j] -= learnRate * layers[l].inputs[i] * layers[l].gradients[j];
                        }
                    }
                }
            }

            if (epoch % 10000 == 0) {
                console.log('Epoch: ' + epoch + '; ' + 'Total Error: ' + (error) + '; ');
            }

        } while (error > minError && ++epoch < maxEpoch); // 4.508s

        return {'error': error, 'epoch': epoch};
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
