class Players {
    x;
    y;
    radius;
    color;
    status;
    shootingStatus;
    velocity;
    level_speed;
    speed;
    weapon_level;
    shield;
    constructor(x, y, radius, color, status, shootingStatus,velocity,level_speed,speed,weapon_level,shield) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.status = status;
        this.shootingStatus = shootingStatus;
        this.velocity = velocity;
        this.level_speed = level_speed;
        this.speed = speed;
        this.weapon_level = weapon_level;
        this.shield = shield;
        document.addEventListener('keydown', this.keyDown);
        document.addEventListener('keyup', this.keyUp);
    }
    upgradeWeapon() {
        this.weapon_level++;
    }
    downgradeWeapon() {
        this.weapon_level--;
    }
    increateShield() {
        this.shield++;
    }
    decreateShield() {
        this.shield--;
        console.log(typeof this.shield);
    }
    draw() {
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        c.fillStyle = this.color;
        c.fill();

        c.closePath();
    }
    getWeaponLevel() {
        if (this.weapon_level <= 0) {
            return '1 GUN';
        }
        if (this.weapon_level === 1) {
            return '2 GUN';
        }
        if (this.weapon_level > 1) {
            return '3 GUN';
        }
    }
    getShield() {
        return this.shield;
    }
    setVelocity() {
        this.velocity = { x:Math.cos(this.angle)*2,y:Math.sin(this.angle)*2};
    }
    setRandomRadius() {
        this.radius = Math.random() * (50-5) + 5;
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
        this.angle = Math.atan2( player.y - this.y, player.x - this.x);
    }
    update() {
        this.x += this.velocity.x/3 * this.level_speed;
        this.y += this.velocity.y/3 * this.level_speed;
    }
    keyDown = (event) => {
        if (event.code === 'ArrowUp') {
            this.upPressed = true;
        }
        if (event.code === 'ArrowDown') {
            this.downPressed = true;
        }
        if (event.code === 'ArrowRight') {
            this.rightPressed = true;
        }
        if (event.code === 'ArrowLeft') {
            this.leftPressed = true;
        }
    }
    keyUp = (event) => {
        if (event.code === 'ArrowUp') {
            this.upPressed = false;
        }
        if (event.code === 'ArrowDown') {
            this.downPressed = false;
        }
        if (event.code === 'ArrowRight') {
            this.rightPressed = false;
        }
        if (event.code === 'ArrowLeft') {
            this.leftPressed = false;
        }
    }
    move() {
        if (this.upPressed) {
            this.y -= this.speed;
        }
        if (this.downPressed) {
            this.y += this.speed;
        }
        if (this.rightPressed) {
            this.x += this.speed;
        }
        if (this.leftPressed) {
            this.x -= this.speed;
        }
    }

}