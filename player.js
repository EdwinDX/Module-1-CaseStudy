class Players {
    x;
    y;
    radius;
    color;
    status;
    shootingStatus;
    velocity;
    constructor(x, y, radius, color, status, shootingStatus,velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.status = status;
        this.shootingStatus = shootingStatus;
        this.velocity = velocity;
    }
    isShooting() {

    }
    isSurvive() {

    }
    draw() {
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        c.fillStyle = this.color;
        c.fill();
    }
    setVelocity() {

    }
    update() {

    }
}