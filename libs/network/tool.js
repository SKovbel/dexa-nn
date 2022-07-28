class NeuralNetworkTool {
    import(data, mutation = 0) {
        const nnData = (typeof data === 'string') ? JSON.parse(data) : data;
        const network = new NeuralNetwork(nnData.config, nnData.layers);
        this.mutate(network, mutation);
        return network;
    }

    export(network) {
        let layers = [];
        for (let l = 0; l < network.layers; l++) {
            layers[l] = {
                'biases': layers[l].biases,
                'weights': layers[l].weights
            }
        }
        return JSON.stringify({
            'config': network.config,
            'layers': layers
        });
    }

    clone(network, mutation = 0) {
        let layers = [];
        for (let l = 0; l < network.layers.length; l++) {
            const layer = network.layers[l];
            let biases = [];
            let weights = [];
            for (let j = 0; j < layer.outputSize; j++) {
                biases[j] = layer.biases[j];
            }
            for (let i = 0; i < layer.inputSize; i++) {
                weights[i] = [];
                for (let j = 0; j < layer.outputSize; j++) {
                    weights[i][j] = layer.weights[i][j];
                }
            }
            layers.push({'weights': weights, 'biases': biases});
        }
        return this.import({
            'config': network.config,
            'layers': layers
        }, mutation);
    }

    mutate(network, mutation = 0) {
        const lerp = function (A, B, t) {
            return A + t*(B - A);
        }
        for (let l = 0; mutation != 0 && l < network.layers.length; l++) {
            const layer = network.layers[l];
            for (let j = 0; j < layer.outputSize; j++) {
                for (let i = 0; i < layer.inputSize; i++) {
                    layer.weights[i][j] = lerp(layer.weights[i][j], 2 * Math.random() - 1, mutation);
                }
                layer.biases[j] = lerp(layer.biases[j], 2 * Math.random() - 1, mutation);
            }
        }
    }
}
