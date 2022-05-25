class Canvas {
    constructor() {
        this.carCanvas = document.getElementById("car-canvas");
        const carCtx = this.carCanvas.getContext("2d");
        this.carCanvas.width = 200;

        this.networkCanvas = document.getElementById("network-canvas");
        const networkCtx = this.networkCanvas.getContext("2d");
        this.networkCanvas.width = 500;
    }
}