class QLearningEngine extends GameEngine {
    constructor() {
        super();
        this.code = 'qlearning';
        this.matrix = null;
        this.policy = null;
    }

    move(game) {
        [this.matrix, this.policy] = this.matrix ? [this.matrix, this.policy] : this.load([{}, {}]);

        const turn = game.turn();
        let bestValue = -Infinity;
        let bestMove = null;
        for(let i = 0; i < game.fields.length; i++) {
            if (game.fields[i] != 0) { // skip used squares (1 and -1)
                continue;
            }
            game.fields[i] = turn;
            const index = this.#getPositionIndex(game.fields);
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
        const K = 0.9
        const WIN = 1;
        const DRW = 0;
        const LST = -1;

        // game already processed
        let gameIdx = this.#getGameIndex(game.hist);
        if (gameIdx in this.policy) {
            return;
        }

        const status = game.status();
        let fields = [...game.fields];
        let rewardA = Math.abs(status) != 0 ? WIN : DRW; // last move win (if game status = -1 || 1) or draw (if 0). Last move can be as X as O
        let rewardB = Math.abs(status) != 0 ? LST : DRW; // prev move lost (if game status = -1 || 1) or draw
        for (let i = game.hist.length - 1, p = true; i >= 0; i--, p = !p) {
            const posIdx = this.#getPositionIndex(fields);
            const gameValue = this.#getPositionValue(posIdx, 0);
            if (p) { // calculates players X and O separatly
                this.matrix[posIdx] = rewardA;
                rewardA = gameValue + K * (rewardA - gameValue);
            } else {
                this.matrix[posIdx] = rewardB;
                rewardB = gameValue + K * (rewardB - gameValue);
            }
            fields[game.hist[i]] = 0;
        }            //value += (field == 1) ? 'X' : (field == -1) ? '0' : '-';

        let value = '';
        for (const item of hist) {
            value += '' + item;
        }
        return value; 
    }

    #getGameIndex(hist) {
        let value = '';
        for (const item of hist) {
            value += '' + item;
        }
        return value; 
    }

    #posIndexes = {'-1': '0', '0': '-', '1': 'X'}
    #getPositionIndex(fields) {
        let value = '';
        for (const field of fields) {
            value += this.#posIndexes[field];
        }
        return value; 
    }

    #getPositionValue(index, def = null) {
        return index in this.matrix ? this.matrix[index] : def;
    }
}
