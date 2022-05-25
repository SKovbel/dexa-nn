class Main {
    constructor(boardCanvas, networkCanvas) {
        this.bestWins = -Infinity;
        this.bestLosts = Infinity;
        this.maxGames = 1000;
        this.iteration = 0;
        this.maxIteration = Infinity;
        this.resetIteration = 400;
        this.boardCanvas = boardCanvas;
        this.boardCanvas.width = 400;
        this.boardCanvas.height = 400;
        this.boardCtx = this.boardCanvas.getContext('2d');

        this.networkCanvas = networkCanvas;
        this.networkCtx = this.networkCanvas.getContext('2d');
        this.networkCanvas.width = 500;

        this.board = new Board(this.boardCtx);
        this.games = [];
        this.#train();
    }

    #train() {
        this.games = [];

        const depth = 4;
        const mutation = 0.5;
        for (let i = 0; i < this.maxGames / 2; i++) {
            this.games.push(new Game(
                new MinimaxEngine(depth),
                new NetworkEngine(i == 0 ? 0 : mutation)
            ));
            this.games.push(new Game(
                new NetworkEngine(i == 0 ? 0 : mutation),
                new MinimaxEngine(depth)
            ));
        }
    }

    #fitness() {
        return this.games.find(c=>c.wins==Math.max(...this.games.map(g=>g.wins)));
    }

    animate(time) {
        for (let i = 0; i < this.games.length; i++) {
            const game = this.games[i];
            const status = game.move();
            if (status === null) {
                continue;
            }
            if ((status > 0 && game.engineX.code == 'network') || (status < 0 && game.engineO.code == 'network')) {
                game.wins++;
            } else if (status == 0) {
                game.draws++;
            } else {
                game.losts++;
            }
            game.restart();
        }

        const bestGame = this.#fitness();
        this.board.draw(bestGame);

        this.networkCanvas.height = window.innerHeight;
        const nn = bestGame.engineX.code == 'network' ? bestGame.engineX.nn : bestGame.engineO.nn;
        //NeuralNetworkVisualizer.drawNetwork(this.networkCtx, nn, []);

        this.iteration++;
        if (this.maxIteration > 0 && (this.iteration % this.resetIteration == 0)) {
            console.log('wins: ' + bestGame.wins + '; losts: ' + bestGame.losts + '; draw: ' + bestGame.draws + '; best wins = ' + this.bestWins + '; best losts = ' + this.bestLosts);
            if (bestGame.wins >= this.bestWins) {
                this.bestWins = bestGame.wins;
                bestGame.engineX.code == 'network' ? bestGame.engineX.saveNN() : bestGame.engineO.saveNN();
            }
            if (bestGame.losts <= this.bestLosts) {
                this.bestLosts = bestGame.losts;
                bestGame.engineX.code == 'network' ? bestGame.engineX.saveNN() : bestGame.engineO.saveNN();
            }
            this.#train();
        }
        if (this.iteration < this.maxIteration) {
            requestAnimationFrame(this.animate.bind(this));
        }
    }
}

if (getGetParam('test')) {
    const test = new Test();
    test.run();
}

const main = new Main(
    document.getElementById('board-canvas'),
    document.getElementById('network-canvas')
);
main.animate();


function save() {
    main.save();
}

function discard() {
    localStorage.removeItem("bestSelfCardDrive");
}
