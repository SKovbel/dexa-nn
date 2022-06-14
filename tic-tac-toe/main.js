class Main {
    constructor(boardCanvas, networkCanvas) {
        this.networkCanvas = networkCanvas;
        this.networkCtx = this.networkCanvas.getContext('2d');
        this.networkCanvas.width = 500;

        this.maxIteration = 10;
        this.batchTrains = [];
        this.board = new Board(this.boardCtx);

        this.#restart();
    }

    #restart() {
        let depth = 10 * Math.random();
        if (Math.random() > 0.5) {
            this.game = new Game(
                new MinimaxEngine(depth),
                new MinimaxEngine(depth)
                //new NetworkEngine()
            );
        } else {
            this.game = new Game(
                //new NetworkEngine(),
                new MinimaxEngine(depth),
                new MinimaxEngine(depth)
            );
        }
    }

    // loop to the end of game, after restart game
    #play() {
        const status = this.game.status();

        if (status === null) { // move
            this.game.move();
            return;

        } else if (status == 0) { // draw
            console.log('draw');
            this.#restart();

        } else { // won
            const win = status == 1 ? this.game.engineX : this.game.engineO;
            console.log(win.code + ' won');
            this.#restart();
        }
    }


    train() {
        this.#play();
        if (this.maxIteration-- > 0) {
            this.train();
        }
    }

    animate(time) {
        const nnEngine = this.game.engineX.code == 'network' ? this.game.engineX : this.game.engineO;
        this.networkCanvas.height = window.innerHeight;
        NeuralNetworkVisualizer.drawNetwork(this.networkCtx, nnEngine.nn, []);

        //this.#play();
        requestAnimationFrame(this.animate.bind(this));
    }
}
