class NeuralNetworkVisualizer {
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
