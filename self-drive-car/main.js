/**
 * https://www.youtube.com/watch?v=Rs_rAxEsAvI
 */
class Main {
    static nnName = 'nn-self-car-drive'
    constructor() {
        this.mutationAmount = 0.3;
        this.mutationDelta = 0.03;
        this.maxIter = 1000;
        this.maxCars = 500;
        this.minTrafics = 3;
        this.maxTrafics = 30;
        this.maxLength = 15;
        this.minTraficSpeed = 1;
        this.maxTraficSpeed = 3;
    }

    init() {
        this.iter = 0;
        this.generateField();
        this.generateCars();
        this.generateTrafics();
    }

    generateField() {
        this.carCanvas = document.getElementById("carCanvas");
        this.carCtx = this.carCanvas.getContext("2d");
        this.carCanvas.width = 200;
        
        this.networkCanvas = document.getElementById("networkCanvas");
        this.networkCtx = this.networkCanvas.getContext("2d");
        this.networkCanvas.width = 500;

        this.road = new Road(this.carCanvas.width/2, this.carCanvas.width * 0.9, 3);
    }

    generateCars() {
        this.cars = [];
        for (let i = 0; i < this.maxCars; i++) {
            this.cars.push(new Car(this.road.getLaneCenter(1), 100, 30, 50, "AI", 3));
        }
        this.LoadNN();
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
            ))
        }
    }

    saveNN() {
        console.log('Saved');
        localStorage.setItem(Main.nnName, JSON.stringify(this.bestCar.nn));
    }

    LoadNN() {
        if (localStorage.getItem(Main.nnName)) {
            for (let i = 0; i < this.cars.length; i++) {
                this.cars[i].nn = NeuralNetwork.load(
                    JSON.parse(localStorage.getItem(Main.nnName)), 
                    i == 0 ? 0 : this.mutationAmount
                );
            }
        }
    }

    discardNN() {
        localStorage.removeItem(Main.nnName);
    }

    fitness() {
        return this.cars.find(c=>c.y==Math.min(...this.cars.map(c=>c.y)));
    }
    
    animate(time) {
        this.iter++;
        for (let i = 0; i < this.traffics.length; i++) {
            this.traffics[i].update(this.road.borders, []);
        }
    
        for (let i = 0; i < this.cars.length; i++) {
            this.cars[i].update(this.road.borders, this.traffics);
        }
    
        this.bestCar = this.fitness();
    
        carCanvas.height = window.innerHeight;
        networkCanvas.height = window.innerHeight;
    
        this.carCtx.save();
        this.carCtx.translate(0, -this.bestCar.y + this.carCanvas.height * 0.7);
    
        this.road.draw(this.carCtx);
        for (let i = 0; i < this.traffics.length; i++) {
            this.traffics[i].draw(this.carCtx, "brown");
        }
        this.carCtx.globalAlpha = 0.2;
        for (let i = 0; i < this.cars.length; i++) {
            this.cars[i].draw(this.carCtx, "grey");
        }
        this.carCtx.globalAlpha = 1;
    
        this.bestCar.draw(this.carCtx, "blue", true);
        this.carCtx.restore();
    
        this.networkCtx.lineDashOffset = time/50;
        NeuralNetworkVisualizer.drawNetwork(this.networkCtx, this.bestCar.nn);
    
        if (this.iter % 50 == 0) console.log(this.iter);
        if (this.iter > this.maxIter) {
            this.saveNN();
            this.mutationAmount -= this.mutationDelta;
            console.log('Mutation K = ' + this.mutationAmount);
            this.init();
        }

        if (this.mutationAmount > 0) {
            requestAnimationFrame(this.animate.bind(this));
        }

    }
}

// load



const main = new Main();

function save() {
    main.saveNN();
}

function discard() {
    main.discardNN();
}

main.init();
main.animate();
