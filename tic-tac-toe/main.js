class Main {
    constructor(boardCanvas, networkCanvas) {
        this.bestWins = 0;
        this.maxGames = 1000;
        this.iteration = 0;
        this.maxIteration = 400;
        this.boardCanvas = boardCanvas;
        this.boardCanvas.width = 400;
        this.boardCanvas.height = 400;
        this.boardCtx = this.boardCanvas.getContext('2d');

        this.networkCanvas = networkCanvas;
        this.networkCtx = this.networkCanvas.getContext('2d');

        this.board = new Board(this.boardCtx);
        this.games = [];
        this.init();
    }

    init() {
        this.games = [];
        this.iteration = 0;
        this.#generateTrainGames(2, 0.1);
    }

    #generateTrainGames(depth, mutation) {
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
        for (let game of this.games) {
            if (game.status == null) {
                game.move();
            }
            if (
                (game.status == 1 && game.engineX.code == 'network') ||
                (game.status == -1 && game.engineO.code == 'network')
            ) {
                game.wins++;
                game.restart();
            } else if (game.status == 0) {
                game.draws++;
                //game.wins += 0.25;
                game.restart();
            } else if (game.statys !== null) {
                game.losts++;
            }
        }

        const bestGame = this.#fitness();
        this.board.draw(bestGame);

        this.iteration++;
        if (this.iteration > this.maxIteration) {
            console.log(bestGame);
            if (bestGame.wins >= this.bestWins) {
                console.log(this.bestWins);
                this.bestWins = bestGame.wins;
                bestGame.engineX.code == 'network' ? bestGame.engineX.save() : bestGame.engineO.save();
            }
            this.init();
        } else {
        }
        requestAnimationFrame(this.animate.bind(this));
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

for (let i = 0; i < 10; i++) {
    console.log(i + ' ? ' + !(i%2));
}