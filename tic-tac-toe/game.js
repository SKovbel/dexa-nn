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
        if (this.status === null) {
            const best = this.who > 0 ? this.engineX.move(this) : this.engineO.move(this);
            this.fields[best] = this.who;
            //console.log(best + ': ' +this.who);
            this.who = -this.who;
            this.undo[best] = this.fields.filter(v => v !== 0).length;
            this.status = Game.gameStatus(this.fields);
        }
        return this.status;
    }

    /**
     * -1   - win 0
     *  1   - win X 
     *  0   - draw
     * null - game is not finished
     */
    static gameStatus(fields = []) {
        let isDraw = true;
        for (const line of Game.lines) {
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
