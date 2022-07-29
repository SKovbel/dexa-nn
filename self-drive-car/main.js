/**
 * https://www.youtube.com/watch?v=Rs_rAxEsAvI
 */
class Main {
    static nnName = 'network-self-car-drive'
    constructor() {
        this.carStartsY = 0;
        this.mutationAmount = 0.2;
        this.mutationDelta = 0.03;
        this.maxIter = 1000;
        this.maxCars = 500;
        this.minTrafics = 3;
        this.maxTrafics = 30;
        this.maxLength = 15;
        this.minTraficSpeed = 1;
        this.maxTraficSpeed = 3;
        this.networkTool = new NeuralNetworkTool();
    }

    init() {
        this.cars = [];
        this.iter = 0;
        this.generateField();
        this.generateCars();
        this.generateTrafics();
    }

    generateField() {
        this.carCanvas = document.getElementById("car-canvas");
        this.carCtx = this.carCanvas.getContext("2d");
        this.carCanvas.width = 200;
        
        this.networkCanvas = document.getElementById("network-canvas");
        this.networkCtx = this.networkCanvas.getContext("2d");
        this.networkCanvas.width = 500;

        this.road = new Road(this.carCanvas.width/2, this.carCanvas.width * 0.9, 3);
    }

    generateCars() {
        for (let i = 0; i < this.maxCars; i++) {
            this.cars.push(new Car(this.road.getLaneCenter(1), this.carStartsY, 30, 50, "AI", 3));
        }
        this.load();
        this.bestCar = this.cars[0];
    }

    generateTrafics(N) {
        this.traffics = [];

        let maxLane = 3;
        let trafficCount =  Math.floor(Math.random() * (this.maxTrafics - this.minTrafics + 1)) + this.minTrafics;
        for (let i = 0; i < trafficCount; i++) {
            let lane =  Math.floor(Math.random() * (maxLane + 1)) + 0;
            let position = Math.floor(Math.random() * (this.maxLength)) + 1;
            let speed =  (Math.floor(Math.random() * (2*this.maxTraficSpeed - this.minTraficSpeed + 1)) + this.minTraficSpeed) / 2;
            this.traffics.push(new Car(
                this.road.getLaneCenter(lane), -100 * position, 30, 50, "DUMMY", speed
            ));
        }
    }

    save() {
        console.log('Saved');
        const data = this.networkTool.export(this.bestCar.network);
        localStorage.setItem(Main.nnName, JSON.stringify(data));
    }

    load() {
        const data = localStorage.getItem(Main.nnName);
        if (data) {
            for (let i = 0; i < this.cars.length; i++) {
                this.cars[i].network = this.networkTool.import(JSON.parse(data), i == 0 ? 0 : this.mutationAmount);
            }
        }
    }

    discard() {
        localStorage.removeItem(Main.nnName);
    }

    fitness() {
        return this.cars.find(c=>c.y==Math.min(...this.cars.map(c=>c.y)));
    }
    
    animate(time) {
        for (let i = 0; i < this.traffics.length; i++) {
            this.traffics[i].update(this.road.borders, []);
        }
    
        for (let i = 0; i < this.cars.length; i++) {
            this.cars[i].update(this.road.borders, this.traffics);
        }
    
        this.bestCar = this.fitness();
    
        this.carCanvas.height = window.innerHeight;
        this.networkCanvas.height = window.innerHeight;
    
        this.carCtx.save();
        this.carCtx.translate(0, -this.bestCar.y + this.carCanvas.height * 0.7);
    
        this.road.draw(this.carCtx);
        for (let i = 0; i < this.traffics.length; i++) {
            this.traffics[i].draw(this.carCtx, "brown");
        }

        let cntUsefulCars = 0;
        this.carCtx.globalAlpha = 0.2;
        for (let i = 0; i < this.cars.length; i++) {
            this.cars[i].draw(this.carCtx, "yellow");
            cntUsefulCars += this.cars[i].damaged || this.cars[i].y < this.carStartsY || this.cars[i].friction > 0.05 ? 0 : 1;
        }
        this.carCtx.globalAlpha = 1;
    
        this.bestCar.draw(this.carCtx, "blue", true);
        this.carCtx.restore();
    
        this.networkCtx.lineDashOffset = time/50;
        NeuralNetworkVisualizer.drawNetwork(this.networkCtx, this.bestCar.network, ["🠭", "🠬", "🠮", "🠯"]);

        if (this.iter % 50 == 0) {
            console.log(this.iter + '; ' + cntUsefulCars);
        }
        if (this.iter > this.maxIter || cntUsefulCars == 0) {
            if (cntUsefulCars) {
                this.save();
            }
            this.mutationAmount -= this.mutationDelta;
            console.log('Mutation K = ' + this.mutationAmount);
            this.init();
        }

        if (this.mutationAmount > 0) {
            requestAnimationFrame(this.animate.bind(this));
        }
        this.iter++;
    }
}

