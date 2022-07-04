class QLearningEngine {
    static name = 'ql-tic-tac-toe';

    constructor() {
        this.matrix = {};
        this.games = [];
        this.code = 'qlearning';
    }

    start (game) {
        null; // nothing here
    }

    move(game) {
        const turn = game.turn();
        let bestValue = -Infinity;
        let bestMove = null;
        for(let i = 0; i < game.fields.length; i++) {
            if (game.fields[i] != 0) { // skip moved squares (1 and -1)
                continue;
            }
            game.fields[i] = turn;
            const index = this.#gameToIndex(game.fields)
            const gameValue = this.#findValue(index);
            if (gameValue) {
                if (gameValue > bestValue) {
                    bestValue = gameValue;
                    bestMove = i;
                }
            } else if (bestValue < 0) {
                bestValue = 0;
                bestMove = i;
            }
            game.fields[i] = 0;
        }
        return bestMove
    }

    end(game) {
        this.load();

        let fields = [...game.fields];

        let index = this.#gameToIndex(fields)
        if (index in this.matrix) {
            return;
        }

        let reward = Math.abs(game.status()) != 0 ? 2 : 1;
        for (let i = game.hist.length - 1; i >=0; i--,i--) {
            let index = this.#gameToIndex(fields)
            const gameValue = this.#findValue(index, 0);
            reward = gameValue + 0.9 * (reward - gameValue);
            this.matrix[index] = reward;
            fields[game.hist[i]] = 0;
            fields[game.hist[i - 1]] = 0;
        }

        fields = [...game.fields];
        const last = game.hist[game.hist.length - 1];
        fields[last] = 0;
        reward = Math.abs(game.status()) != 0 ? -1 : 1;
        for (let i = game.hist.length - 2; i >=0; i--,i--) {
            fields[game.hist[i + 1]] = 0;
            let index = this.#gameToIndex(fields)
            const gameValue = this.#findValue(index, 0);
            reward = gameValue + 0.9 * (reward - gameValue);
            this.matrix[index] = reward;
            fields[game.hist[i]] = 0;
            fields[game.hist[i - 1]] = 0;
        }

        this.save();
    }

    #gameToIndex(fields) {
        let value = '';
        for (let i = 0; i < fields.length; i++) {
            let val = '-';
            val = fields[i] == 1 ? 'X' : val;
            val = fields[i] == -1 ? '0' : val;
            value += val;
        }
        return value; 
    }

    #findValue(index, def = null) {
        if (index in this.matrix) {
            return this.matrix[index];
        }
        return def;
    }

    load(i) {
        if (localStorage.getItem(QLearningEngine.name)) {
            this.matrix = JSON.parse(localStorage.getItem(QLearningEngine.name));
        }
    }

    save() {
        const dataJson = JSON.stringify(this.matrix);
        localStorage.setItem(QLearningEngine.name, dataJson);
    }
}
