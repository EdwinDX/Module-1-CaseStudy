class Bullet {
    x;
    y;
    radius;
    color;
    velocity;
    angle;
    status;
    constructor(x, y, radius, color, velocity,angle,status) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.angle = angle;
        this.status = status;
    }
    draw() {
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        c.fillStyle = this.color;
        c.fill();
    }
    update() {;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
    isTouching() {

    }
    setAngle(event) {
        this.angle = Math.atan2(event.clientY - DEFAULT_PLAYER_Y,event.clientX - DEFAULT_PLAYER_X);
    }
    setVelocity() {
        this.velocity = { x:Math.cos(this.angle)*5,y:Math.sin(this.angle)*5};
    }
}