class Game {
    constructor(engineX, engineO) {
        this.engineX = engineX;
        this.engineO = engineO;
        this.game();
    }

    // new game
    game() {
        this.hist = [];
        /* X=1, empty=0, 0=-1  */
        this.fields = new Array(9).fill(0);
        this.engineX.start(this); // says engine about start game
        this.engineO.start(this);
    }

    // who's turn X=1, O=-1
    turn() {
        return this.hist.length % 2 == 0 ? 1 : -1;
    }

    status() {
        return GameStatus.status(this.fields);
    }

    // make move
    move() {
        let status = this.status();
        if (status == null) { // game is not finished
            const turn = this.turn();
            const bestMove = (turn == 1) ? this.engineX.move(this) : this.engineO.move(this);
            if (bestMove < -10)
                console.log(bestMove + (turn == 1 ? this.engineX.code : this.engineO.code));
            this.hist.push(bestMove);
            this.fields[bestMove] = turn;

            status = this.status();
            if (status !== null) { // check again if last move have finished game?
                this.engineX.end(this);
                this.engineO.end(this);
            }
        }
        return status;
    }
}

class GameStatus {
    /**
     *  1   - X won
     *  0   - draw
     * -1   - 0 won
     * null - play
     */
     static status(fields = []) {
        const rules = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // horz
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // vert
            [0, 4, 8], [2, 4, 6] // diag
        ];
        let isDraw = true;
        for (const rule of rules) {
            const absSum = Math.abs(fields[rule[0]] + fields[rule[1]] + fields[rule[2]]);
            if (absSum == 3) {
                return fields[rule[0]]; // won
            }
            if (isDraw) {
                const sumAbs = Math.abs(fields[rule[0]]) + Math.abs(fields[rule[1]]) + Math.abs(fields[rule[2]]);
                isDraw = (absSum == sumAbs)  ? false : isDraw;
            }
        }
        return isDraw ? 0 : null; // draw or play
    }
}

class GameEngine {
    code = 'unknown';

    start(game) {

    }

    move(game) {
        return null;
    }

    end(game) {

    }

    load(def = null) {
        if (localStorage.getItem(this.code)) {
            return JSON.parse(localStorage.getItem(this.code));
        }
        return def;
    }

    save(data) {
        localStorage.setItem(this.code, JSON.stringify(data));
    }

    discard() {
        localStorage.removeItem(this.code);
    }
}
