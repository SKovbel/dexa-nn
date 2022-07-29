class Main {
    constructor(contentElement, networkCanvas) {
        this.contentElement = contentElement;
        this.networkCanvas = networkCanvas;

        this.network = new NeuralNetwork({
            loss: NeuralNetworkLoss.CROSS_ENTROPY,
            train: NeuralNetworkTrain.SGD,
            layers: [
                {inputSize: 4, activation: NeuralNetworkActivation.LRELU},
                {inputSize: 4, activation: NeuralNetworkActivation.RELU},
                {inputSize: 4, activation: NeuralNetworkActivation.TANH},
                {inputSize: 4, activation: NeuralNetworkActivation.SIGMOID},
                {inputSize: 4, activation: NeuralNetworkActivation.SOFTMAX},
                {inputSize: 3},
            ]
        });
    }

    train() {
        var train = simpleData.data.filter(item => item.train == true);
        this.network.train(train, {learn_rate: 0.01, min_error: 0.01, max_epoch: 10000});
    }

    test() {
        const trains = simpleData.data.sort((x, y) => x.train - y.train);
        let bad = 0;
        for (let t = 0; t < trains.length; t++) {
            let result = this.network.forwardPropagate(trains[t].inputs);
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
            msg.style.color = 'green';
            if (String(result1) == String(trains[t].outputs) ) {
                msg.style.color = 'red';
                bad++;
            }
            this.contentElement.append(msg);
        }
        this.contentElement.append('Bad: ' + bad + ' / ' + Math.round(100*(bad/trains.length)) + '%');
        window.scrollTo(0, document.body.scrollHeight);
}

    animate(time) {
        this.networkCtx = this.networkCanvas.getContext('2d');
        this.networkCanvas.height = window.innerHeight;
        this.networkCanvas.width = 500;
        //NeuralNetworkVisualizer.drawNetwork(this.networkCtx, this.network, []);
        //requestAnimationFrame(this.animate.bind(this));
    }
}

