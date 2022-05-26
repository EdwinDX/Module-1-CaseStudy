class Spells {
    x;
    y;
    radius;
    type;
    color;
    status;
    constructor(x, y, radius, type, color, status) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.type = type;
        this.color = color;
        this.status = status;
    }
    setRandomRespawn() {
        if (Math.random()<0.5) {
            this.x = Math.random()*canvas.width;
            if (Math.random()<0.5) {
                this.y = 0;
            }
            else {
                this.y = canvas.height;
            }
        }
        else {
            this.y = Math.random()*canvas.height;
            if (Math.random()<0.5) {
                this.x = 0;
            }
            else {
                this.x = canvas.width;
            }
        }
    }
    setColorSpell() {
        switch (this.type) {
            case 0:
                this.color = 'red';
                break;
            case 1:
                this.color = 'green';
                break;
            case 2:
                this.color = 'blue';
                break;
        }
    }
    setTypeSpell(type) {
        this.type = type;
    }
    setSpell(type) {
        switch (type) {
            case 0:
                downgrade.play();
                player.downgradeWeapon();
                break;
            case 1:
                upgrade.play();
                player.upgradeWeapon();
                break;
            case 2:
                player.increateShield();
                break;
        }
    }
    draw() {
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    }
}