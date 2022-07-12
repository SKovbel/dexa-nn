;function getGetParam(parameterName) {
    let result = null;
    let tmp = [];
    location.search.substr(1).split('&').forEach(function (item) {
        tmp = item.split("=");
        if (tmp[0] === parameterName) {
            result = decodeURIComponent(tmp[1]);
        }
    });
    return result;
}
;function lerp(A, B, t) {
    return A + t*(B - A);
}

function getIntersection(A, B, C, D) {
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    if (bottom != 0) {
        const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
        const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);

        const t = tTop / bottom;
        const u = uTop / bottom;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t
            }
        }
    }
    return null;
}

function polysIntersect(poly1, poly2) {
    for (let i = 0; i< poly1.length; i++) {
        for (let j = 0; j < poly2.length; j++) {
            const touch = getIntersection(
                poly1[i],
                poly1[(i+1)%poly1.length],
                poly2[j],
                poly2[(j+1)%poly2.length]
            );
            if (touch) {
                return true;
            }
        }
    }
    return false;
}
;;;class NeuralNetworkBackPropagation {
    static SGD = 'sgd';
    static ADAM = 'adam';

    static init(network) {
        for (let l = 0; l < network.layers.length; l++) {
            network.layers[l].errors = [];
            NeuralNetworkDerivate.init(network.layers[l]);
        }
    }

    static train(network, algorithm, trains, rate = 0.01, error = 0.1, epoch = 1000) {
        const t0 = performance.now();
        NeuralNetworkBackPropagation.init(network);
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


class NeuralNetworkDerivate {
    static init(layer) {
        switch (layer.activation) {
            case NeuralNetworkActivation.RELU:
                layer.derivateFunction = NeuralNetworkDerivate.relu;
                break;
            case NeuralNetworkActivation.TANH:
                layer.derivateFunction = NeuralNetworkDerivate.tanh;
                break;
            case NeuralNetworkActivation.SIGMOID:
                layer.derivateFunction = NeuralNetworkDerivate.sigmoid;
                break;
            case NeuralNetworkActivation.SOFTMAX:
                layer.derivateFunction = NeuralNetworkDerivate.softmax;
                break;
        }
    }

    static tanh(inputs, errors) {
        let result = [];
        for (let i = 0; i < inputs.length; i++) {
            let tanh = Math.tanh(inputs[i]);
            const deriviate  = 1 - tanh * tanh;
            result[i] = errors[i] * deriviate;
        }
        return result;
    }

    static relu(inputs, errors) {
        let result = [];
        for (let i = 0; i < inputs.length; i++) {
            const deriviate = inputs[i] > 0 ? 1 : -0 * inputs[i];
            result[i] = errors[i] * deriviate;
        }
        return result;
    }

    static sigmoid(inputs, errors) {
        let result = [];
        for (let i = 0; i < inputs.length; i++) {
            const deriviate = inputs[i] * (1 - inputs[i]);
            result[i] = errors[i] * deriviate;
        }
        return result;
    }

    static softmax(inputs, errors) {
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
;
class NeuralNetworkBackPropagationAdam {
    static train(network, trains, rate = 0.01, error = 0.1, epoch = 1000) {
        
    }
};
class NeuralNetworkBackPropagationSGD {
    static train(network, trains, rate = 0.01, error = 0.1, epoch = 1000) {
        let e = 0;
        let totalError  = 0;
        do {
            totalError  = 0;
            for (let t = 0; t < trains.length; t++) {
                NeuralNetwork.feedforward(network, trains[t].inputs);
                totalError += this.backpPropagation(network, trains[t].outputs, rate);
            }
            e++;
            if (e % 10000 == 0) console.log('Epoch: ' + e + '; ' + 'Error: ' + totalError + '; ');
        } while (totalError > error && e < epoch)
        return totalError;
    }

    static backpPropagation(network, outputs, rate) {
        const layers = network.layers;
        const lastIdx = layers.length - 1;
        const first = layers[0];
        const last = layers[lastIdx];

        let totalError = 0;
        let errorLayer = [];
        let errorLayers = [layers.length];

        // output layer
        for (let j = 0; j < last.outputs.length; j++) {
            errorLayer[j] = last.outputs[j] - outputs[j];
            totalError += errorLayer[j] * errorLayer[j];
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

        return totalError;
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

    static feedforward(network, inputs) {
        network.layers[0].inputs = inputs;
        network.layers[0].activationFunction();
        for (let l = 1; l < network.layers.length; l++) {
            network.layers[l].inputs = network.layers[l - 1].outputs;
            network.layers[l].activationFunction();
        }
        return network.layers[network.layers.length - 1].outputs;
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


class NeuralNetworkActivation {
    static RELU = 'relu';
    static TANH = 'tanh';
    static SIGMOID = 'sigmoid';
    static SOFTMAX = 'softmax';

    static init(layer) {
        switch (layer.activation) {
            case NeuralNetworkActivation.RELU:
                layer.activationFunction = NeuralNetworkActivation.relu;
                layer.derivateFunction = NeuralNetworkActivation.drelu;
                break;
            case NeuralNetworkActivation.TANH:
                layer.activationFunction = NeuralNetworkActivation.tanh;
                break;
            case NeuralNetworkActivation.SIGMOID:
                layer.activationFunction = NeuralNetworkActivation.sigmoid;
                layer.derivateFunction = NeuralNetworkActivation.dsigmoid;
                break;
            case NeuralNetworkActivation.SOFTMAX:
                layer.activationFunction = NeuralNetworkActivation.softmax;
                break;
        }
    }

    static tanh() { // -1..1
        for (let i = 0; i < this.outputs.length; i++) {
            let x = this.biases[i];
            for (let j = 0; j < this.inputs.length; j++) {
                x += this.inputs[j] * this.weights[j][i];
            }
            this.outputs[i] = Math.tanh(x);
        }
    }

    static sigmoid() { // 0..1
        for (let i = 0; i < this.outputs.length; i++) {
            let x = this.biases[i];
            for (let j = 0; j < this.inputs.length; j++) {
                x += this.inputs[j] * this.weights[j][i];
            }
            this.outputs[i] = 1 / (1 + Math.exp(-x));
        }
    }

    static relu() { // 0..1
        for (let i = 0; i < this.outputs.length; i++) {
            let x = this.biases[i];
            for (let j = 0; j < this.inputs.length; j++) {
                x += this.inputs[j] * this.weights[j][i];
            }
            this.outputs[i] = x > 0 ? 1 : 0;
        }
    }

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
}
;class NeuralNetworkTools {
    /**
     * @param json|object data
     * @param int mutation 
     * @returns 
     */
    static import(data, mutation = 0) {
        const network = (typeof data === 'string') ? JSON.parse(data) : data;
        for (let l = 0; l < network.layers.length; l++) {
            NeuralNetworkLayer.init(network.layers[l]);
        }
        NeuralNetworkTools.mutate(network, mutation);
        return network;
    }

    static export(network) {
        return JSON.stringify(network, (key, value) => {
            if (key == 'inputs' || key == 'outputs' || key == 'errors') {
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
        return NeuralNetworkTools.import(newNetwork, mutation);
    }

    static mutate(network, mutation = 0) {
        for (let l = 0; mutation != 0 && l < network.layers.length; l++) {
            const layer = network.layers[l];
            for (let j = 0; j < layer.outputs.length; j++) {
                for (let i = 0; i < layer.inputs.length; i++) {
                    layer.weights[i][j] = lerp(layer.weights[i][j], 2*Math.random() - 1, mutation);
                }
                layer.biases[j] = lerp(layer.biases[j], 2*Math.random() - 1, mutation);
            }
        }
    }
}
;class NeuralNetworkVisualizer {
    static drawNetwork(ctx, network, outputLabels = []) {
        const margin = 20;

        const top = margin;
        const left = margin;
        const width = ctx.canvas.width - 2*margin;
        const height = ctx.canvas.height - 2*margin;
        const layerHeight = height/network.layers.length;

        for (let i = network.layers.length - 1; i >= 0; i--) {
            const layerTop = top + NeuralNetworkVisualizer.lerp(network.layers, i, height-layerHeight, 0);
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
                ctx.moveTo(NeuralNetworkVisualizer.lerp(inputs, i, left, right), bottom);
                ctx.lineTo(NeuralNetworkVisualizer.lerp(outputs, j, left, right), top)
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
            const x = NeuralNetworkVisualizer.lerp(outputs, i, left, right);

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

    static #erp(nodes, index, A, B) {
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
