class Board {
    pieces = {
        '-1': '0',
        '0': '',
        '1': 'X'
    }
    status = {
        '-1': 'win O',
        '0': 'draw',
        '1': 'win X',
        null: '...'
    }
    constructor(ctx) {
        this.ctx = ctx;
        this.lines = null;  
    }

    draw(game) {
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.ctx.canvas.clientWidth, this.ctx.canvas.clientHeight);

        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = 'blue';
        this.#getLines().forEach(line => {
            this.ctx.beginPath();
            this.ctx.moveTo(line[0], line[1]);
            this.ctx.lineTo(line[2], line[3]);
            this.ctx.stroke();
        });

        const undoMarging = lerp(0, this.ctx.canvas.clientWidth, 2/17);
        const piecePosition = this.#getPiecePositions();
        game.fields.forEach((piece, index) => {
            piece = piece == null ? ' ' : piece;

            this.ctx.textAlign = "center";
            this.ctx.textBaseLine = "middle";
            this.ctx.fillStyle = "red";
            this.ctx.font = "80px Arial";
            this.ctx.beginPath();
            this.ctx.fillText(this.pieces[piece], piecePosition[index][0], piecePosition[index][1]);

            this.ctx.beginPath();
            this.ctx.textAlign = "right";
            this.ctx.textBaseLine = "middle";
            this.ctx.fillStyle = "green";
            this.ctx.font = "30px Arial";
            this.ctx.fillText(game.hist[index], piecePosition[index][0] + undoMarging, piecePosition[index][1]);
        });

        const msg = 'mv: ' + this.pieces[game.turn()] + '; ' + this.status[game.status()] + '; X:' + game.engineX.code;
        this.ctx.beginPath();
        this.ctx.textAlign = "center";
        this.ctx.textBaseLine = "middle";
        this.ctx.fillStyle = "green";
        this.ctx.font = "30px Arial";
        this.ctx.fillText(msg, 160, 25);

        this.ctx.restore();
    }
    
    #getPiecePositions() {
        if (!this.piecePositions) {
            const h0 = this.ctx.canvas.clientHeight;
            const w0 = this.ctx.canvas.clientWidth;
            this.piecePositions = [
                [lerp(0, w0, 1/6), lerp(0, h0, 2/9)],
                [lerp(0, w0, 3/6), lerp(0, h0, 2/9)],
                [lerp(0, w0, 5/6), lerp(0, h0, 2/9)],
                [lerp(0, w0, 1/6), lerp(0, h0, 5/9)],
                [lerp(0, w0, 3/6), lerp(0, h0, 5/9)],
                [lerp(0, w0, 5/6), lerp(0, h0, 5/9)],
                [lerp(0, w0, 1/6), lerp(0, h0, 8/9)],
                [lerp(0, w0, 3/6), lerp(0, h0, 8/9)],
                [lerp(0, w0, 5/6), lerp(0, h0, 8/9)]
            ]
        }
        return this.piecePositions;
    }

    #getLines() {
        if (!this.lines) {
            const margin = 20;
            const h0 = this.ctx.canvas.clientHeight;
            const w0 = this.ctx.canvas.clientWidth;
            const h1 = lerp(0, h0, 1/3);
            const h2 = lerp(0, h0, 2/3);
            const w1 = lerp(0, w0, 1/3);
            const w2 = lerp(0, w0, 2/3);
            this.lines = [
                [margin, h1 - margin, w0 - margin, h1 - margin],
                [margin, h2 - margin, w0 - margin, h2 - margin],
                [w1, margin, w1, h0 - margin],
                [w2, margin, w2, h0 - margin],
            ];
        }
        return this.lines;
    }
}
