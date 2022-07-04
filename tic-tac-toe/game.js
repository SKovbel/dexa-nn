class Game {
    // constructor with set two engine
    constructor(engineX, engineO) {
        this.engineX = engineX;
        this.engineO = engineO;
        this.game();
    }

    // new game
    game() {
        this.hist = [];
        this.fields = new Array(9);
        for (let i = 0; i < this.fields.length; i++) {
            this.fields[i] = 0;
        }
        this.engineX.start(this); // says engine about start game
        this.engineO.start(this);
    }

    // who's turn X=1, O=-1
    turn() {
        return this.hist.length % 2 == 0 ? 1 : -1;
    }

    // make move
    move() {
        let status = this.status();
        if (status !== null) { // game already finished
            return status;
        }

        const turn = this.turn();
        const bestMove = turn == 1 ? this.engineX.move(this) : this.engineO.move(this);
        this.hist.push(bestMove);
        this.fields[bestMove] = turn;

        status = this.status();
        if (status !== null) { // game is finished
            this.engineX.end(this);
            this.engineO.end(this);
        }
        return status;
    }

    /**
     *  1   - X won
     *  0   - draw
     * -1   - 0 won
     * null - game is not finished
     */
    status(fields = []) {
        fields = fields.length == 0 ? this.fields : fields;

        const rules = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // horz
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // vert
            [0, 4, 8], [2, 4, 6] // diag
        ];
        let isDraw = true;
        for (let i = 0; i < rules.length; i++) {
            const line = rules[i];
            const absSum = Math.abs(fields[line[0]] + fields[line[1]] + fields[line[2]]);
            if (absSum == 3) {
                return fields[line[0]]; // win
            }
            if (isDraw) {
                const sumAbs = Math.abs(fields[line[0]]) + Math.abs(fields[line[1]]) + Math.abs(fields[line[2]]);
                if (absSum == sumAbs) {
                    isDraw = false;
                }
            }
        }
        return isDraw ? 0 : null; // draw or not finished game (null)
    }
}
