class MinimaxEngine {
    constructor(maxDepth = 2) {
        this.code = 'minimax';
        this.maxDepth = maxDepth;
    }

    move(fields, turn) {
        const bestFields = Minimax.minimax(fields, turn, 0, this.maxDepth, Game.gameStatus)
        return bestFields[Math.floor(Math.random() * bestFields.length)];
    }
}