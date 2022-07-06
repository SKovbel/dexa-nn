class QLearningEngine {
    static matrixName = 'ql-tic-tac-toe-matrix';
    static policyName = 'ql-tic-tac-toe-policy';

    constructor() {
        this.matrix = null;
        this.policy = null;
        this.games = [];
    }

    code() {
        return 'qlearning';
    }

    start (game) {
        null; // nothing here
    }

    move(game) {
        this.#load();

        const turn = game.turn();
        let bestValue = -Infinity;
        let bestMove = null;
        for(let i = 0; i < game.fields.length; i++) {
            if (game.fields[i] != 0) { // skip moved squares (1 and -1)
                continue;
            }
            game.fields[i] = turn;
            const index = this.#getPositionIndex(game.fields)
            const value = this.#getPositionValue(index);
            if (value > bestValue) {
                bestValue = value;
                bestMove = i;
            } else if (value == null && bestValue < 0) {
                bestValue = 0;
                bestMove = i;
            }
            game.fields[i] = 0;
        }
        return bestMove
    }

    end(game) {
        this.#load(true);

        let gameIdx = this.#getGameIndex(game.hist)
        if (gameIdx in this.policy) {
            this.policy[gameIdx] = this.policy[gameIdx] + 1;
            this.#save();
            return;
        }

        let fields = [...game.fields];
        let reward = Math.abs(game.status()) != 0 ? 2 : 1;
        for (let i = game.hist.length - 1; i >=0; i--,i--) {
            let posIdx = this.#getPositionIndex(fields)
            const gameValue = this.#getPositionValue(posIdx, 0);
            reward = gameValue + 0.9 * (reward - gameValue);
            this.matrix[posIdx] = reward;
            fields[game.hist[i]] = 0;
            fields[game.hist[i - 1]] = 0;
        }

        fields = [...game.fields];
        const last = game.hist[game.hist.length - 1];
        fields[last] = 0;
        reward = Math.abs(game.status()) != 0 ? -1 : 1;
        for (let i = game.hist.length - 2; i >=0; i--,i--) {
            fields[game.hist[i + 1]] = 0;
            let posIdx = this.#getPositionIndex(fields)
            const gameValue = this.#getPositionValue(posIdx, 0);
            reward = gameValue + 0.9 * (reward - gameValue);
            this.matrix[posIdx] = reward;
            fields[game.hist[i]] = 0;
            fields[game.hist[i - 1]] = 0;
        }

        this.policy[gameIdx] = 1;
        this.#save();
    }

    #getGameIndex(hist) {
        let value = '';
        for (let i = 0; i < hist.length; i++) {
            value += '' + hist[i];
        }
        return value; 
    }

    #getPositionIndex(fields) {
        let value = '';
        for (let i = 0; i < fields.length; i++) {
            let val = '-';
            val = fields[i] == 1 ? 'X' : val;
            val = fields[i] == -1 ? '0' : val;
            value += val;
        }
        return value; 
    }

    #getPositionValue(index, def = null) {
        return index in this.matrix ? this.matrix[index] : def;
    }

    #load(forse = false) {
        if (this.matrix && !forse) {
            return;
        }
        if (localStorage.getItem(QLearningEngine.matrixName)) {
            this.matrix = JSON.parse(localStorage.getItem(QLearningEngine.matrixName));
            this.policy = JSON.parse(localStorage.getItem(QLearningEngine.policyName));
        } else {
            this.matrix = {};
            this.policy = {};
        }
    }

    #save() {
        localStorage.setItem(QLearningEngine.matrixName, JSON.stringify(this.matrix));
        localStorage.setItem(QLearningEngine.policyName, JSON.stringify(this.policy));
    }

    static discard() {
        localStorage.removeItem(QLearningEngine.matrixName);
        localStorage.removeItem(QLearningEngine.policyName);
    }
}
