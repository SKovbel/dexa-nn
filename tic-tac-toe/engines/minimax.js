class MinimaxEngine {
    constructor(maxDepth = 2) {
        this.maxDepth = maxDepth;
    }

    code() {
        return 'minimax-' + this.maxDepth;
    }

    start (game) {

    }

    end(game) {

    }

    move(game) {
        const checkCallback = function(fields) {
            return game.status(fields);
        };
        const bestFields = this.#minimax(game.fields, game.turn(), 0, this.maxDepth, checkCallback);
        return bestFields[Math.floor(Math.random() * bestFields.length)];
    }

    /**
     * fields - flat array [-1, 0, 0, -1, ]
     * turn -1 or 1
     */
    #minimax(fields, turn, depth, maxDepth, checkCallback) {
        if (depth) {
            const win = checkCallback(fields);
            if (win !== null) {
                return win / depth;
            }
        }

        if (depth >= maxDepth) {
            return 0;
        }

        let bestScore = turn > 0 ? -Infinity : Infinity;
        let bestFields = [];
        for (let i = 0; i < fields.length; i++) {
            if (fields[i] != 0) { // skip moved squares (1 and -1)
                continue;
            }

            fields[i] = turn;
            const score = this.#minimax(fields, -turn, depth + 1, maxDepth, checkCallback);
            if (turn > 0 && score >= bestScore) {
                if (bestScore != score) {
                    bestFields = [];
                }
                bestScore = score;
                if (depth == 0) {
                    bestFields.push(i);
                }
            } else if (turn < 0 && score <= bestScore) {
                if (bestScore != score) {
                    bestFields = [];
                }
                bestScore = score;
                if (depth == 0) {
                    bestFields.push(i);
                }
            }
            fields[i] = 0;
        }
        return depth ? bestScore : bestFields;
    }
}
