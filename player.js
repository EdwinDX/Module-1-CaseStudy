class Players {
    x;
    y;
    radius;
    color;
    status;
    shootingStatus;
    velocity;
    level_speed;
    constructor(x, y, radius, color, status, shootingStatus,velocity,level_speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.status = status;
        this.shootingStatus = shootingStatus;
        this.velocity = velocity;
        this.level_speed = level_speed;
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
        this.velocity = { x:Math.cos(this.angle)*2,y:Math.sin(this.angle)*2};
    }
    setRandomRadius() {
        this.radius = Math.random() * (30-5) + 5;
    }
    setRandomSpawn() {
        if (Math.random() < 0.5) {
            this.x = Math.random() < 0.5 ? 0 - this.radius : SCREEN_X - this.radius;
            this.y = Math.random() * SCREEN_Y;
        }
        else {
            this.x = Math.random() * SCREEN_X;
            this.y = Math.random() < 0.5 ? 0 - this.radius : SCREEN_Y - this.radius;
        }
    }
    setRandomColor() {
        this.color = `hsl(${Math.random() * 360},50%,50%)`;
    }
    setAngle() {
        this.angle = Math.atan2( DEFAULT_PLAYER_Y - this.y, DEFAULT_PLAYER_X - this.x);
    }
    update() {
        this.x += this.velocity.x/3 * this.level_speed;
        this.y += this.velocity.y/3 * this.level_speed;
    }
}