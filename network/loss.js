// cost, loss, total error
class NeuralNetworkLoss {
    static ME = 'me'; // Mean Error
    static MAE = 'mae'; // Mean Absolute Error
    static MSE = 'mse'; // Mean Squared Error
    static RMSE = 'rmse';
    static CROSS_ENTROPY = 'cross_entropy';

    constructor(network, loss) {
        switch (loss) {
            case NeuralNetworkLoss.ME:
                network.loss = this.me;
                break;
            case NeuralNetworkLoss.MAE:
                network.loss = this.mae;
                break;
            case NeuralNetworkLoss.MSE:
                network.loss = this.mse;
                break;
            case NeuralNetworkLoss.RMSE:
                network.loss = this.rmse;
                break;
            case NeuralNetworkLoss.CROSS_ENTROPY:
                network.loss = this.crossEntropy;
                break;
        }
    }

    // ME ----------------------------------
    me(targets) {
        let loss = 0;
        let errors = [];
        for (let j = 0; j < this.lastLayer.outputSize; j++) {
            loss += this.lastLayer.outputs[j] - targets[j];
            errors[j] = this.lastLayer.outputs[j] - targets[j];
        }
        return {
            'loss': loss / this.lastLayer.outputSize,
            'errors': errors
        }
    }

    // MAE ----------------------------------
    mae(targets) {
        let loss = 0;
        let errors = [];
        for (let j = 0; j < this.lastLayer.outputSize; j++) {
            errors[j] = this.lastLayer.outputs[j] - targets[j];
            const error = this.lastLayer.outputs[j] - targets[j];
            loss += error >= 0 ? error : -error; // abs
        }
        return {
            'loss': loss / this.lastLayer.outputSize,
            'errors': errors
        }
    }

    // MSE ----------------------------------
    mse(targets) {
        let loss = 0;
        let errors = [];
        for (let j = 0; j < this.lastLayer.outputSize; j++) {
            errors[j] = this.lastLayer.outputs[j] - targets[j];
            loss += 0.5 * errors[j] * errors[j];
        }
        return {
            'loss': loss / this.lastLayer.outputSize,
            'errors': errors
        }
    }

    // RMSE ----------------------------------
    rmse(targets) {
        let result = this.mse(targets);
        result.loss = Math.sqrt(this.mse(result.loss));
        return result;
    }

    // CROSS_ENTROPY ----------------------------------
    crossEntropy(targets) {
        let loss = 0;
        let errors = [];
        for (let j = 0; j < this.lastLayer.outputSize; j++) {
            errors[j] = this.lastLayer.outputs[j] - targets[j];
            loss += -1 * targets[j] * Math.log(this.lastLayer.outputs[j]);
        }
        return {
            'loss': loss / this.lastLayer.outputSize,
            'errors': errors
        }
    }
}
