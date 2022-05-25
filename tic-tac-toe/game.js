class Game {
    static lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // horz
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // vert
        [0, 4, 8], [2, 4, 6] // diag
    ];
    
    constructor(engineX, engineO) {
        this.wins = 0; // stats field for engines
        this.losts = 0; // stats field for engines
        this.draws = 0; // stats field for engines

        this.engineX = engineX;
        this.engineO = engineO;
        this.restart();
    }

    restart() {
        this.who = 1;
        this.undo = new Array(9).fill(0);
        this.fields = new Array(9).fill(0);
        this.status = null;
    }

    move() {
        const best = this.who > 0 
            ? this.engineX.move(this.fields, this.who)
            : this.engineO.move(this.fields, this.who);

        this.fields[best] = this.who;

        this.who = -this.who;
        this.undo[best] = this.fields.filter(v => v !== 0).length;
        this.status = Game.gameStatus(this.fields);
    }

    /**
     * -1   - win 0
     *  1   - win X 
     *  0   - draw
     * null - game is not finished
     */
    static gameStatus(fields = []) {
        let zeroCount = fields.filter(v => v == 0).length;

        // make last move of current player
        if (zeroCount == 1) {
            //zeroCount--;
            //fields = fields.map(v => v === 0 ? this.who : v);
        };

        let isDraw = true;
        for (const line of Game.lines) {
            const absSum = Math.abs(fields[line[0]] + fields[line[1]] + fields[line[2]]);
            if (absSum == 3) {
                return fields[line[0]]; // win
            }
            if (isDraw && zeroCount) { // if zeroCount is 0 then we check wins only, game is end
                const sumAbs = Math.abs(fields[line[0]]) + Math.abs(fields[line[1]]) + Math.abs(fields[line[2]]);
                if (absSum == sumAbs) {
                    isDraw = false;
                }
            }
        }
        return isDraw ? 0 : null; // draw or not finished game (null)
    }
}
