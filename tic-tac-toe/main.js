class Main {
    constructor(statsElement, boardCanvas, networkCanvas) {
        this.stats = {};
        this.statsElement = statsElement;
        this.networkCanvas = networkCanvas;
        this.networkCtx = this.networkCanvas.getContext('2d');
        this.networkCanvas.width = 500;

        this.maxGames = 1000;
        this.batchTrains = [];
        this.board = new Board(this.boardCtx);

        this.#restart();
    }

    #restart() {
        let depth = Math.round(8 * Math.random());
        depth = 4;
        if (Math.random() > 0.5) {
            this.game = new Game(
                new MinimaxEngine(depth),
                new QLearningEngine()
            );
        } else {
            this.game = new Game(
                new QLearningEngine(),
                new MinimaxEngine(depth)
            );
        }
    }

    // loop to the end of game, after restart game
    play() {
        do {
            if (this.game.move() === null) {
                continue; // is not finished game, just return
            }
            this.addStats(this.game);
            this.#restart();
            this.maxGames--;
            console.log(this.maxGames);
            //return;
        } while (this.maxGames > 0);
        this.printStats();
    }

    animate(time) {
        const nnEngine = this.game.engineX.code() == 'network' ? this.game.engineX : this.game.engineO;
        this.networkCanvas.height = window.innerHeight;
        NeuralNetworkVisualizer.drawNetwork(this.networkCtx, nnEngine.nn, []);

        //this.#play();
        requestAnimationFrame(this.animate.bind(this));
    }

    addStats(game) {
        let incStats = (index, who) => {
            this.stats[index] = index in this.stats ? this.stats[index] : {};
            this.stats[index][who] = who in this.stats[index] ? this.stats[index][who] : 0;
            this.stats[index][who]++;
        }
        const status = game.status();
        const wwin = status == 1 ? 'X' : '0';
        const wlost = status == 1 ? '0' : 'X';
        const win = status == 1 ? game.engineX : game.engineO;
        const lost = status == 1 ? game.engineO : game.engineX;

        if (status != 0) {
            incStats('won', win.code());
            incStats('lost', lost.code());
            incStats('won-' + wwin, win.code());
            incStats('lost-' + wlost, lost.code());
        } else {
            incStats('draw-' + wwin, win.code());
            incStats('draw-' + wlost, lost.code());
        }
    }

    printStats() {
        let line = "".padStart(10);
        let keys2 = {}
        for (let key in this.stats) {
            line += key.padStart(10);
            for (let key2 in this.stats[key]) {
                keys2[key2] = key2;
            }
        }
        line += "\n";
        for (let key2 in keys2) {
            line += key2.padStart(10);
            for (let key in this.stats) {
                const val = key2 in this.stats[key] ? this.stats[key][key2] : 0;
                line += ('' + val).padStart(10);
            }
            line += "\n";
        }

        const msg = document.createElement('p');
        msg.innerText = line;
        this.statsElement.append(msg);
    }
}
