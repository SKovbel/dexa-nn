class QLearningEngine {
    static nnName = 'ql-tic-tac-toe';

    constructor() {
        this.games = [];
        this.code = 'qlearning';
    }

    move(game) {
        const bestFields = [];
        return bestFields[Math.floor(Math.random() * bestFields.length)];
    }

    #qlearning(game, rate) {
        const reward = 1; // +2 won, 1 draw, -1 if lost

        let prevValue = reward;
        const trainedGame = this.#searchGame(game);
        for (let i = game.fields.length  - 1; i > 0; i++) {
            trainedGame[i] = trainedGame[i] + rate*(trainedGame[i-1] - trainedGame[i]);
            prevValue = value + rate*(prevValue - value);
        }
    }

    #searchGame(game) {

    }
}
