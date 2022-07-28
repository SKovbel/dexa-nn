class NeuralNetworkTrain {
    static SGD = 'sgd';
    static SGDBP = 'sgdbp';
    static ADAM = 'adam';

    constructor(network, train) {
        switch (train) {
            case NeuralNetworkTrain.SGD:
                this.processor = new NeuralNetworkTrainSGD()
                break;
            case NeuralNetworkTrain.SGDBP:
                this.processor = new NeuralNetworkTrainSGDBP()
                break;
            case NeuralNetworkTrain.ADAM:
                this.processor = new NeuralNetworkTrainAdam()
                break;
        }

        // implement train(...) function into network object
        network.train = (trains, config) => {
            this.train(network, trains, config)
        }
    }

    train(network, trains, config) {
        const t0 = performance.now();
        const info = this.processor.train(network, trains, config);
        const t1 = performance.now();
        console.log('Time: ' + (Math.round((t1 - t0), 2) / 1000) + 's; Error=' + (info['error']) + '; Epochs=' + info['epoch']);
        return info['error'];
    }
}
