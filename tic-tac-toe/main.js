class Main {
    constructor(boardCanvas, networkCanvas) {
        this.maxGames = 1000;

        this.networkCanvas = networkCanvas;
        this.networkCtx = this.networkCanvas.getContext('2d');
        this.networkCanvas.width = 500;

        this.maxIteration = 100;
        this.batchTrains = [];
        this.board = new Board(this.boardCtx);
        this.#restartGame();
    }

    #restartGame() {
        this.trains = [];
        this.maxGames--;
        let depth = 10 * Math.random();
        depth = 1;

        if (Math.random() > 0.5) {
            this.game = new Game(
                new MinimaxEngine(depth),
                new NetworkEngine()
            );
        } else {
            this.game = new Game(
                new NetworkEngine(),
                new MinimaxEngine(depth)
            );
        }
    }

    #playGame() {
        if (this.game.status === null) { // move
            const data = {inputs: [ ...this.game.fields, this.game.who], outputs: [0,0,0, 0,0,0, 0,0,0]};
            this.game.move();
            data.outputs[this.game.lastMove] = 1;
            this.trains.push(data);
            return; // avoid game restarts
        }
        
        if (this.status == 0) { // draw
            console.log('draw');

        } else { // won
            const nnEngine = this.game.engineX.code == 'network' ? this.game.engineX : this.game.engineO;
            const nnWin = (this.status > 0 && this.game.engineX.code == 'network') || (this.status < 0 && this.game.engineO.code == 'network');
            if (nnWin) {
                console.log('Network won');
            } else {
                console.log('MiniMax won');
            }
            for (let i = 0; i < this.trains.length; i++) {
                const who = i % 2 == 0 ? 1 : -1;
                if (who == this.game.status) {
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
            }
        }

        this.#restartGame();
    }

    train() {
        this.#playGame();
        if (this.maxGames) {
            this.train();
        }
    }

    animate(time) {
        const nnEngine = this.game.engineX.code == 'network' ? this.game.engineX : this.game.engineO;
        this.networkCanvas.height = window.innerHeight;
        NeuralNetworkVisualizer.drawNetwork(this.networkCtx, nnEngine.nn, []);

        //this.#playGame();
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
//main.animate();
main.train();


function save() {
    main.save();
}

function discard() {
    localStorage.removeItem("bestSelfCardDrive");
}
