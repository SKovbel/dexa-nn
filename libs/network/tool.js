class NeuralNetworkTool {
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
