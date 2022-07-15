;;class NeuralNetworkActivation {
    static RELU = 'relu';
    static TANH = 'tanh';
    static SIGMOID = 'sigmoid';
    static SOFTMAX = 'softmax';

    static init(layer) {
        switch (layer.activation) {
            case NeuralNetworkActivation.RELU:
                layer.activationFunction = this.relu;
                layer.derivateFunction = this.drelu;
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
        for (let i = 0; i < this.outputs.length; i++) {
            let x = this.biases[i];
            for (let j = 0; j < this.inputs.length; j++) {
                x += this.inputs[j] * this.weights[j][i];
            }
            this.outputs[i] = Math.tanh(x);
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
        for (let i = 0; i < this.outputs.length; i++) {
            let x = this.biases[i];
            for (let j = 0; j < this.inputs.length; j++) {
                x += this.inputs[j] * this.weights[j][i];
            }
            this.outputs[i] = 1 / (1 + Math.exp(-x));
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
        for (let i = 0; i < this.outputs.length; i++) {
            let x = this.biases[i];
            for (let j = 0; j < this.inputs.length; j++) {
                x += this.inputs[j] * this.weights[j][i];
            }
            this.outputs[i] = x > 0 ? 1 : 0;
        }
    }
    static drelu(inputs, errors) {
        let result = [];
        for (let i = 0; i < inputs.length; i++) {
            const deriviate = inputs[i] > 0 ? 1 : -0 * inputs[i];
            result[i] = errors[i] * deriviate;
        }
        return result;
    }

    // SOFTMAX -------------------------------

    static softmax() { // 0..1, sum(all) = 1
        let sum = 0;
        let exp = [];
        for (let i = 0; i < this.outputs.length; i++) {
            let x = this.biases[i];
            for (let j = 0; j < this.inputs.length; j++) {
                x += this.inputs[j] * this.weights[j][i];
            }
            exp[i] = Math.exp(x);
            sum += exp[i];
        }
        for (let i = 0; i < this.outputs.length; i++) {
            this.outputs[i] = exp[i] / sum;
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

    static train(network, algorithm, trains, rate = 0.01, error = 0.1, epoch = 1000) {
        const t0 = performance.now();
        let totalError  = 0;

        if (algorithm == NeuralNetworkTrain.ADAM) {
            totalError = NeuralNetworkTrainAdam.train(network, trains, rate, error, epoch);

        } else if (algorithm == NeuralNetworkTrain.SGDBP) {
            totalError = NeuralNetworkTrainSGDBP.train(network, trains, rate, error, epoch);

        } else { //SGD, default
            totalError = NeuralNetworkTrainSGD.train(network, trains, rate, error, epoch);
        }

        const t1 = performance.now();
        console.log('Time: ' + (Math.round((t1 - t0), 2) / 1000) + 's Error=' + totalError);
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
            if (key == 'inputs' || key == 'outputs' || key == 'gradients') {
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
            for (let i = 0; i < layer.inputs.length; i++) {
                newWeights[i] = [];
                for (let j = 0; j < layer.outputs.length; j++) {
                    newWeights[i][j] = layer.weights[i][j];
                }
            }
            for (let j = 0; j < layer.outputs.length; j++) {
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
            for (let j = 0; j < layer.outputs.length; j++) {
                for (let i = 0; i < layer.inputs.length; i++) {
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
    static train(network, trains, rate = 0.001, minError = 0.1, maxEpoch = 1000) {
        const layers = network.layers;

        let epoch = 0;
        let error = 0;

        const beta1 = 0.8;
        const beta2 = 0.8;
        const epsilon = 0.000000001;

        for (let l = 0; l < layers.length; l++) {
            layers[l].momentM = [];
            layers[l].momentV = [];
            for (let j = 0; j < layers[l].outputs.length + 1; j++) {
                layers[l].momentM[j] = 0;
                layers[l].momentV[j] = 0;
            }
        }

        do {
            for (let t = 0; t < trains.length; t++) {
                NeuralNetwork.forwardPropagate(network, trains[t].inputs);
                error += NeuralNetwork.backPropagate(network, trains[t].outputs);
                NeuralNetworkPrint.printNetwork(network);

                for (let l = layers.length - 1; l >= 0; l--) {
                    const layer = layers[l];
                    const bPos = layer.outputs.length;

                    for (let j = 0; j < layer.outputs.length; j++) {
                        layer.momentM[bPos] = beta1 * layer.momentM[bPos] + (1.0 - beta1) * layer.gradients[j];
                        layer.momentV[bPos] = beta2 * layer.momentV[bPos] + (1.0 - beta2) * layer.gradients[j] * layer.gradients[j];
                        let m = layer.momentM[bPos] / (1 - beta1);
                        let v = layer.momentV[bPos] / (1 - beta2);
                        layer.biases[j] -= layer.biases[j] - rate * m / (Math.sqrt(v) + epsilon);
    
                        for (let i = 0; i < layer.inputs.length; i++) {
                            layer.momentM[i] = beta1 * layer.momentM[i] + (1.0 - beta1) * layer.gradients[j];
                            layer.momentV[i] = beta2 * layer.momentV[i] + (1.0 - beta2) * layer.gradients[j] * layer.gradients[j];
                            let m = layer.momentM[i] / (1 - beta1);
                            let v = layer.momentV[i] / (1 - beta2);
                            layer.weights[i][j] -= layer.weights[i][j] - rate * m / (Math.sqrt(v) + epsilon);
                            layer.gradients[i] = 0;
                        }
                        NeuralNetworkPrint.printArray(layer.gradients, 'Grad')
                        NeuralNetworkPrint.printArray(layer.momentM, 'M')
                        NeuralNetworkPrint.printArray(layer.momentV, 'V');
                    }
                }
            }
            epoch++;
        } while (error > minError && epoch < maxEpoch);
        return error;
    }
}
;// SGD + Back Propagation inside
class NeuralNetworkTrainSGDBP {
    static train(network, trains, rate = 0.01, minError = 0.1, maxEpoch = 1000) {
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
                for (let j = 0; j < last.outputs.length; j++) {
                    errorLayer[j] = last.outputs[j] - trains[t].outputs[j];
                    error += errorLayer[j] * errorLayer[j];
                }
                errorLayers[layers.length-1] = last.derivateFunction(last.outputs, errorLayer);
        
                // hidden layers
                for (let l = layers.length - 1; l > 0; l--) {
                    for (let j = 0; j < layers[l].outputs.length; j++) {
                        layers[l].biases[j] -= rate * errorLayers[l][j];
                    }
                    for (let i = 0; i < layers[l].inputs.length; i++) {
                        errorLayer[i] = 0;
                        for (let j = 0; j < layers[l].outputs.length; j++) {
                            errorLayer[i] += layers[l].weights[i][j] * errorLayers[l][j];
                            layers[l].weights[i][j] -= rate * layers[l].inputs[i] * errorLayers[l][j];
                        }
                    }
                    errorLayers[l-1] = layers[l-1].derivateFunction(layers[l].inputs, errorLayer);
                }
        
                // execute first layer
                for (let j = 0; j < first.outputs.length; j++) {
                    first.biases[j] -= rate * errorLayers[0][j];
                    for (let i = 0; i < first.inputs.length; i++) {
                        first.weights[i][j] -= rate * first.inputs[i] * errorLayers[0][j];
                    }
                }
            }
            epoch++;
            if (epoch % 10000 == 0) 
                console.log('Epoch: ' + epoch + '; ' + 'Error: ' + error + '; ');
        } while (error > minError && epoch < maxEpoch)
        return error;
    } //4.742s, 4.428s 4.7, 4.44
}
;
class NeuralNetworkTrainSGD {
    static train(network, trains, rate = 0.001, minError = 0.1, maxEpoch = 1000) {
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
                        layers[l].biases[j] -= rate * layers[l].gradients[j];
                        for (let i = 0; i < layers[l].inputs.length; i++) {
                            layers[l].weights[i][j] -= rate * layers[l].inputs[i] * layers[l].gradients[j];
                        }
                    }
                }
            }

            if (epoch % 10000 == 0) 
                console.log('Epoch: ' + epoch + '; ' + 'Total Error: ' + error + '; ');

        } while (error > minError && ++epoch < maxEpoch); // 4.508s

        return error;
    }
} // 4.996s, 4.9, 5.19
;class NeuralNetworkPrint {
    static printNetwork(network) {
        console.log('#Network');
        for (let l = 0; l < network.layers.length; l++) {
            const layer = network.layers[l];
            console.log('Layer ' + l);
            let lineb = '';
            for (let i = 0; i < layer.inputs.length; i++) {
                let linew = 'W' + i + ': ';
                for (let j = 0; j < layer.outputs.length; j++) {
                    linew += String(Math.round(100*layer.weights[i][j])/100).padStart(10);
                    if (i == 0) {
                        lineb += String(Math.round(100*layer.biases[i])/100).padStart(10) + 'b';
                    }
                }
                console.log(linew);
            }
            console.log('B: ' + lineb);
        }
        console.log('#end');
    }
    static printArray(data, title) {
        console.log(title ? title + ' ' : '#Array');
        let line = '';
        for (let i = 0; i < data.length; i++) {
            line += String(Math.round(10000*data[i])/10000).padStart(10);
        }
        console.log(line);
        console.log('#end');
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
        for (let i = 0; i < inputs.length; i++) {
            for (let j = 0; j < outputs.length; j++) {
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

        for (let i = 0; i < inputs.length; i++) {
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

        for (let i = 0; i < outputs.length; i++) {
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
