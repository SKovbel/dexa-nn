class NeuralNetworkTools {
    static export(network) {
        return JSON.stringify(network, (key, value) => {
            if (key == 'inputs' || key == 'outputs') {
                return;
            }
            return value;
        });
    }

    static import(jsonData, mutation = 0) {
        const network = JSON.parse(jsonData);
        for (let l = 0; l < network.layers.length; l++) {
            NeuralNetworkLayer.init(network.layers[l]);
        }
        NeuralNetworkTools.mutate(network, mutation);
        return network;
    }

    static mutate(network, mutation = 1) {
        if (mutation  == 0) {
            return;
        }
        for (let l = 0; l < network.layers.length; l++) {
            const layer = network.layers[l];
            for (let j = 0; j < layer.outputs.length; j++) {
                for (let i = 0; i < layer.inputs.length; i++) {
                    layer.weights[i][j] = lerp(layer.weights[i][j], 2*Math.random() - 1, mutation);
                }
                layer.biases[j] = lerp(layer.biases[j], 2*Math.random() - 1, mutation);
            }
        }
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
