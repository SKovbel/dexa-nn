class TicTacToeEngine {
    code = 'unknown';

    start(game) {

    }

    end(game) {

    }

    move(game) {

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
