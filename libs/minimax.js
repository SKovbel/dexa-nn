class Minimax {
    /**
     * fields - flat array [-1, 0, 0, -1, ]
     * turn -1 or 1
     * callbackResult return -1, 0, 1
     */
    static minimax(fields, turn, depth, maxDepth, callbackResult) {
        if (depth) {
            const result = callbackResult(fields);
            if (result !== null) {
                return result / depth;
            }
        }

        if (depth >= maxDepth) {
            return 0;
        }

        let bestScore = turn > 0 ? -Infinity : Infinity;
        let bestFields = []
        for (let i; i < fields.length; i++) {

            if (fields[i] != 0) { // skip 1 and -1
                continue;
            }
            fields[i] = turn;
            const score = Minimax.minimax(fields, -turn, depth + 1, maxDepth, callbackResult);
            if (turn > 0 && score >= bestScore) {
                //this.#debug(fields, depth, score + '>=', bestScore);
                if (bestScore != score) {
                    bestFields = [];
                }
                bestScore = score;
                if (depth == 0) {
                    bestFields.push(i);
                }
            } else
            if (turn < 0 && score <= bestScore) {
                //this.#debug(fields, depth, score + '<=', bestScore);
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

    #debug(fields, depth, score, bestScore) {
        let msg = '';
        if (depth > 1) return;
        for (let i = 0; i < fields.length; i++) {
            let piece = fields[i] > 0 ? 'X' : (fields[i] < 0 ? '0' : ' ');
            msg += piece  + ((i+1)%3==0 ? '   ' : '|');
        }
        console.log(msg + ';;; ' + depth + '; ' + score + ' ' + bestScore)
    }
}