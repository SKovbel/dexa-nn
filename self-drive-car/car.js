class Car {
    constructor (x, y, width, height, controlType, maxSpeed) {
        this.x = x;
        this.y = y;
        this.damaged = false;
        this.angle = 0;
        this.speed = 0;
        this.width = width;
        this.height = height;
        this.maxSpeed = maxSpeed;
        this.rayCount = 5;
        this.friction = 0.05;
        this.acceleration = 0.2;
        this.useNN = controlType == "AI";
        this.controlType = controlType;
        this.controls = new Controls(controlType);
        if (controlType != "DUMMY") {
            this.sensor = new Sensor(this, this.rayCount);
            this.nn = new NeuralNetwork([
                {count: this.rayCount, activation: NeuralNetworkActivation.RELU},
                {count: 6, activation: NeuralNetworkActivation.RELU},
                {count: 4}
            ]);
        }
    }

    update(roadBorders, traffics) {
        if (!this.damaged) {
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffics);
            if (this.sensor) {
                this.sensor.update(roadBorders, traffics);
                const offsets = this.sensor.readings.map(s => s == null ? 0 : 1 - s.offset);
                const outputs = NeuralNetwork.feedforward(this.nn, offsets);
                if (this.useNN) {
                    this.controls.forward = outputs[0];
                    this.controls.left = outputs[1];
                    this.controls.right = outputs[2];
                    this.controls.re = outputs[3];
                }
            }
        }
    }

    #assessDamage(roadBorders, traffics) {
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }
        for (let i = 0; i < traffics.length; i++) {
            if (polysIntersect(this.polygon, traffics[i].polygon)) {
                return true;
            }
        }
        return false;
    }

    #createPolygon() {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad,
        });
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad,
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
        });
        return points;
    }

    #move() {
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }

        if (this.speed > 0) {
            this.speed -= this.friction;
        }
        if (this.speed < 0) {
            this.speed += this.friction;
        }
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }
        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }

        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1 : -1;
            if (this.controls.left) {
                this.angle += 0.03 * flip;
            }
            if (this.controls.right) {
                this.angle -= 0.03 * flip;
            }

            this.x -= Math.sin(this.angle) * this.speed;
            this.y -= Math.cos(this.angle) * this.speed;
        }
    }

    draw(ctx, color, showSensors = false) {
        ctx.fillStyle = this.damaged ? 'grey' : color;
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
        if (this.sensor && showSensors) {
            this.sensor.draw(ctx);
        }
    }
}   