class Main {
    constructor(contentElement, networkCanvas) {
        this.contentElement = contentElement;
        this.networkCanvas = networkCanvas;

        this.network = new NeuralNetwork([
            //{size: 4, activation: NeuralNetworkActivation.RELU},
            {size: 4, activation: NeuralNetworkActivation.TANH},
            {size: 4, activation: NeuralNetworkActivation.SIGMOID},
            {size: 4, activation: NeuralNetworkActivation.SOFTMAX},
            {size: 3},
        ]);
    }

    train() {
        var train = simpleData.data.filter(item => item.train == true);
        NeuralNetworkTrain.train(this.network, NeuralNetworkTrain.ADAM, train, 0.01, 0.1, 10000);
    }

    test() {
        const trains = simpleData.data.sort((x, y) => x.train - y.train);
        for (let t = 0; t < trains.length; t++) {
            let result = NeuralNetwork.forwardPropagate(this.network, trains[t].inputs);
            let result1 = [];
            let result2 = [];
            for (let i = 0; i < result.length; i++) {
                result1[i] = Math.round(result[i], 0);
                result2[i] = Math.round(100 * result[i]) / 100;
            }

            let ins = '';
            for (let i = 0; i < trains[t].inputs.length; i++) {
                ins += trains[t].inputs[i] + ' ';
            }
            let out = '';
            for (let i = 0; i < trains[t].outputs.length; i++) {
                out += trains[t].outputs[i] + ' ';
            }
            const msg = document.createElement('p');
            msg.innerText = '(' + (trains[t].train ? 'train' : 'skip!') + ') ' + 
                'Test   [ ' + ins + '] => [ ' + out + '], Result: [' + String(result2) + '], ';
            msg.style.color = String(result1) == String(trains[t].outputs) ? 'green' : 'red';
            this.contentElement.append(msg);
        }
    }

    animate(time) {
        this.networkCtx = this.networkCanvas.getContext('2d');
        this.networkCanvas.height = window.innerHeight;
        this.networkCanvas.width = 500;
        //NeuralNetworkVisualizer.drawNetwork(this.networkCtx, this.network, []);
        //requestAnimationFrame(this.animate.bind(this));
    }
}

