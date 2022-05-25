class MinimaxEngine {
    constructor(maxDepth = 2) {
        this.code = 'minimax';
        this.maxDepth = maxDepth;
    }

    move(game) {
        const bestFields = Minimax.minimax(game.fields, game.who, 0, this.maxDepth, Game.gameStatus)
        return bestFields[Math.floor(Math.random() * bestFields.length)];
    }
}
