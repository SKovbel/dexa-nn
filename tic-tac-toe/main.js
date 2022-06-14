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
        console.log('game start');
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
        console.log(this.game.fields);
        if (status === null) { // move
            this.game.move();
            return; // avoid game restarts

        } else if (status == 0) { // draw
            console.log('draw');

        } else { // won
            const win = status == 1 ? this.game.engineX : this.game.engineO;
            console.log(win.code + ' won');
            /*
            const nnEngine = this.game.engineX.code == 'network' ? this.game.engineX : this.game.engineO;
            const nnWin = (status > 0 && this.game.engineX.code == 'network') || (status < 0 && this.game.engineO.code == 'network');
            for (let i = 0; i < this.trains.length; i++) {
                const turn = i % 2 == 0 ? 1 : -1;
                if (turn == status) {
                    this.batchTrains.push(this.trains[i])
                };
            }
            if (this.batchTrains.length > this.maxIteration) {
                const maxError = 0.1;
                const totalError = NeuralNetworkBackPropagation.train(nnEngine.nn, NeuralNetworkBackPropagation.SGD, this.batchTrains, 0.01, 0.1, 100000);
                //if (totalError <= maxError) {
                    this.maxIteration += 3;
                    console.log('saveNN, error=' + totalError);
                    nnEngine.saveNN();
                //} else {
                //    console.log('error=' + totalError);
                //}
                this.batchTrains = [];
            }*/
        }

        this.#restart();
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
