class NeuralNetworkTool {
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
