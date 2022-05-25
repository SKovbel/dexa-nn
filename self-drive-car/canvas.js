class Canvas {
    constructor() {
        this.carCanvas = document.getElementById("carCanvas");
        const carCtx = this.carCanvas.getContext("2d");
        this.carCanvas.width = 200;

        this.networkCanvas = document.getElementById("networkCanvas");
        const networkCtx = this.networkCanvas.getContext("2d");
        this.networkCanvas.width = 500;
    }
}