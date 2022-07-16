class Main {
    constructor(statsElement, boardCanvas, networkCanvas) {
        this.statsElement = statsElement;
        this.boardCanvas = boardCanvas;
        this.networkCanvas = networkCanvas;
        //this.boardCtx = this.boardCanvas.getContext('2d');
        this.networkCtx = this.networkCanvas.getContext('2d');
        this.networkCanvas.width = 500;
        //this.board = new Board(this.boardCtx);

        this.#resetStats();
        this.#restart();
    }

    #getRandomEngine(n = null) {
        n = n ? n : Math.floor(3 * Math.random() + 1);

        if (n == 2) return new QLearningEngine();
        if (n == 3) return new NetworkEngine();
        
        let depth = Math.round(6 * Math.random());
        return new MinimaxEngine(4);
    }

    #restart() {
        const a = this.#getRandomEngine(1);
        const b = this.#getRandomEngine(3);
        if (Math.random() > 0.5) {
            this.game = new Game(a, b);
        } else {
            this.game = new Game(b, a);
        }
    }

    // loop to the end of game, after restart game
    play() {
        this.#resetStats();
        let maxGames = 2000;
        do {
            if (this.game.move() === null) {
                continue; // is not finished game, just return
            }
            for (let i = 0; i < 5; i++) {
                (new NetworkEngine).train([[[...this.game.fields], [...this.game.hist]]] , 0.001, 10000);
            }
            maxGames--;
            this.#addStats(this.game);
            this.#restart();
        } while (maxGames > 0);
        this.#printStats();

        setTimeout(() => this.play(), 2000);
    }

    animate(time) {
        const nnEngine = this.game.engineX.code == 'network' ? this.game.engineX : this.game.engineO;
        this.networkCanvas.height = window.innerHeight;
        NeuralNetworkVisualizer.drawNetwork(this.networkCtx, nnEngine.nn, []);
        requestAnimationFrame(this.animate.bind(this));
    }

    #resetStats() {
        this.stats = {'game':{}, 'won': {}, 'draw': {}, 'lost': {}, 'won-X': {}, 'lost-X': {}, 'won-0': {}, 'lost-0': {}};
    }

    #addStats(game) {
        let incStats = (index, who) => {
            this.stats[index] = index in this.stats ? this.stats[index] : {};
            this.stats[index][who] = who in this.stats[index] ? this.stats[index][who] : 0;
            this.stats[index][who]++;
        };
        const status = game.status();
        const wwin = status == 1 ? 'X' : '0';
        const wlost = status == 1 ? '0' : 'X';
        const win = status == 1 ? game.engineX : game.engineO;
        const lost = status == 1 ? game.engineO : game.engineX;

        incStats('game', win.code);
        incStats('game', lost.code);

        if (status != 0) {
            incStats('won', win.code);
            incStats('lost', lost.code);
            incStats('won-' + wwin, win.code);
            incStats('lost-' + wlost, lost.code);
        } else {
            incStats('draw', win.code);
        }
    }

    #printStats() {
        let line = "".padStart(10);
        let keys2 = {};
        for (const key in this.stats) {
            line += key.padStart(10);
            for (let key2 in this.stats[key]) {
                keys2[key2] = key2;
            }
        }
        line += "\n";
        for (const key2 in keys2) {
            line += key2.padStart(10);
            for (const key in this.stats) {
                const val = key2 in this.stats[key] ? this.stats[key][key2] : 0;
                line += ('' + val).padStart(10);
            }
            line += "\n";
        }

        const msg = document.createElement('p');
        msg.innerText = line;
        this.statsElement.append(msg);
    }

    dev() {
        do {
            if (this.game.move() === null) {
                continue; // is not finished game, just return
            }
            var trainData = [[[...this.game.fields], [...this.game.hist]]];
            console.log([...this.game.fields]);
            console.log(trainData);
            (new NetworkEngine).train(trainData, 0.01, 100);
            return;
        } while (true);
    }
}
