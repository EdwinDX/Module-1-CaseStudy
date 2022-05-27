class Bullet {
    x;
    y;
    radius;
    color;
    velocity;
    angle;

    constructor(x, y, radius, color, velocity, angle) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.angle = angle;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();

    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    setAngle(x, y) {
        this.angle = Math.atan2(y - player.y, x - player.x);
    }

    setVelocity() {
        this.velocity = {x: Math.cos(this.angle) * 6, y: Math.sin(this.angle) * 6};
    }
}