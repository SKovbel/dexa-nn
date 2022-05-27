class NeuralNetworkBackPropagation {
    static train(network, trains, rate = 0.01, error = 0.1, epoch = 1000) {
        for (let e = 0; e < epoch; e++) {
            let totalError  = 0;
            for (let t = 0; t < trains.length; t++) {
                const result = NeuralNetwork.feedforward(network, trains[t].inputs);
                //console.log(JSON.stringify(result))
                totalError += this.backpPropagation(network, trains[t].outputs, rate);
                //console.log(totalError);
            }
            if (totalError < error) {
                return;
            }
        }
    }

    static backpPropagation(network, outputs, rate) {
        const layers = network.layers;
        const lastIdx = layers.length - 1;
        const first = layers[0];
        const last = layers[lastIdx];

        let error = 0;
        let errors = Array.from(Array(layers.length), () => new Array())

        // output+last layer
        for (let j = 0; j < last.outputs.length; j++) {
            const difference = last.outputs[j] - outputs[j];
            error += difference * difference;
            errors[lastIdx][j] = difference * last.dereviateFunction(last.outputs[j]);
            last.biases[j] -= rate * errors[lastIdx][j];
        }

        // last+mid layers
        for (let l = layers.length - 1; l > 0; l--) {
            for (let i = 0; i < layers[l].inputs.length; i++) {
                let sum = 0;
                for (let j = 0; j < layers[l].outputs.length; j++) {
                    sum += layers[l].weights[i][j] * errors[l][j];
                    layers[l].weights[i][j] -= rate * layers[l].inputs[i] * errors[l][j];
                }
                errors[l - 1][i] = sum * layers[l].dereviateFunction(layers[l].inputs[i]);
                layers[l - 1].biases[i] -= rate * errors[l - 1][i];
            }
        }

        // first layer
        for (let i = 0; i < first.inputs.length; i++) {
            for (let j = 0; j < first.outputs.length; j++) {
                first.weights[i][j] -= rate * first.inputs[i] * errors[0][j];
            }
        }
        return error;
    }
}
/*
 in1  in2
out1 out2 out3   3 bias
 |     |    |
in1   in2  in3   1 bias
      out1


*/