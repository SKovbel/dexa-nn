// cost, loss, total error
class NeuralNetworkLoss {
    static ME = 'me'; // Mean Error
    static MAE = 'mae'; // Mean Absolute Error
    static MSE = 'mse'; // Mean Squared Error
    static RMSE = 'rmse';
    static CROSS_ENTROPY = 'cross_entropy';

    constructor(network) {
        switch (network.config.loss) {
            case NeuralNetworkLoss.ME:
                network.loss = this.me;
                network.dloss = this.dme;
                break;
            case NeuralNetworkLoss.MAE:
                network.loss = this.mae;
                network.dloss = this.dmae;
                break;
            case NeuralNetworkLoss.MSE:
                network.loss = this.mse;
                network.dloss = this.dmse; // deriviate
                break;
            case NeuralNetworkLoss.RMSE:
                network.loss = this.rmse;
                break;
            case NeuralNetworkLoss.CROSS_ENTROPY:
                network.loss = this.crossEntropy;
                network.dloss = this.dcrossEntropy;
                break;
        }
    }

    // ME ----------------------------------
    me(targets) {
        let loss = 0;
        for (let j = 0; j < this.lastLayer.outputSize; j++) {
            loss += this.lastLayer.outputs[j] - targets[j];
        }
        return loss / this.lastLayer.outputSize;
    }

    dme(targets) {
        let loss = [];
        for (let j = 0; j < this.lastLayer.outputSize; j++) {
            loss[j] = 1;
        }
        return loss;
    }

    // MAE ----------------------------------
    mae(targets) {
        let loss = 0;
        for (let j = 0; j < this.lastLayer.outputSize; j++) {
            const error = this.lastLayer.outputs[j] - targets[j];
            loss += error >= 0 ? error : -error; // abs
        }
        return loss / this.lastLayer.outputSize;
    }
    dmae(targets) {
        let loss = [];
        for (let j = 0; j < this.lastLayer.outputSize; j++) {
            loss[j] = targets[j] > this.lastLayer.outputs[j] ? 1 : -1;
        }
        return loss;
    }

    // MSE ----------------------------------
    mse(targets) {
        let loss = 0;
        for (let j = 0; j < this.lastLayer.outputSize; j++) {
            const error = this.lastLayer.outputs[j] - targets[j];
            loss += 0.5 * error * error;
        }
        return loss / this.lastLayer.outputSize;
    }

    dmse(targets) {
        let loss = [];
        for (let j = 0; j < this.lastLayer.outputSize; j++) {
            loss[j] = this.lastLayer.outputs[j] - targets[j];
        }
        return loss;
    }

    // RMSE ----------------------------------
    rmse(targets) {
        return Math.sqrt(this.mse(targets));
    }

    // CROSS_ENTROPY ----------------------------------
    crossEntropy(targets) {
        let loss = 0;
        for (let j = 0; j < this.lastLayer.outputSize; j++) {
            loss += -1 * targets[j] * Math.log(this.lastLayer.outputs[j]);
        }
        return loss / this.lastLayer.outputSize
    }

    dcrossEntropy(targets) {
        let loss = [];
        for (let j = 0; j < this.lastLayer.outputSize; j++) {
            loss[j] = this.lastLayer.outputs[j] - targets[j];
        }
        return loss;
    }
}
