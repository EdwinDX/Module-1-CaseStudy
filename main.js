let canvas = document.getElementById('myCanvas');
let c = canvas.getContext('2d');
const SCREEN_X = canvas.width;
const SCREEN_Y = canvas.height;
const DEFAULT_PLAYER_X = canvas.width/2;
const DEFAULT_PLAYER_Y = canvas.height/2;
const DEFAULT_PLAYER_RADIUS = 10;
const DEFAULT_PLAYER_COLOR = 'white';
let animateId;
let player = new Players(DEFAULT_PLAYER_X,DEFAULT_PLAYER_Y,DEFAULT_PLAYER_RADIUS,DEFAULT_PLAYER_COLOR,true,false,null,null);
let bullet_Sample = new Bullet();
let enemy_Sample = new Players();
let bullets = [];
let enemies = [];

window.addEventListener('click',event => {
    player.shootingStatus = true;
    bullet_Sample.setAngle(event);
    bullet_Sample.setVelocity();
    bullets.push(new Bullet(DEFAULT_PLAYER_X,DEFAULT_PLAYER_Y,5,'white',bullet_Sample.velocity,null,true));
    player.shootingStatus = false;
});
function animate() {
    animateId = requestAnimationFrame(animate);
    c.fillStyle = 'rgba(0 , 0, 0, 0.1)';
    c.fillRect(0,0,SCREEN_X,SCREEN_Y);
    player.draw();
    bullets.forEach((bullet, index) => {
        bullet.draw();
        bullet.update();
        if (bullet.x+bullet.radius<0 || bullet.x-bullet.radius>canvas.width || bullet.y+bullet.radius<0 || bullet.y-bullet.radius>canvas.height) {
            setTimeout(() => {
                bullets.splice(index,1);
            },0);
        }
    });
    enemies.forEach((enemy, index) => {
        enemy.draw();
        enemy.update();
        let distanceToPlayer = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (distanceToPlayer - player.radius - enemy.radius < 1) {
            player.status = false;
            cancelAnimationFrame(animateId);
        }
        bullets.forEach((bullet, bulletIndex) => {
            let distanceToEnemy = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);
            if (distanceToEnemy - bullet.radius - enemy.radius < 1) {
                bullet.status = false;
                if (enemy.radius - 10 > 10) {
                    enemy.radius -= 10;
                    setTimeout(() => {
                        bullets.splice(bulletIndex,1);
                    })
                }
                else {
                    setTimeout(() => {
                        bullets.splice(bulletIndex,1);
                        enemies.splice(index,1);
                        enemy.status = false;
                    })
                }
            }
        })
    })
}
function createEnemy() {
    setInterval(() => {
        enemy_Sample.setRandomRadius();
        enemy_Sample.setRandomSpawn();
        enemy_Sample.setRandomColor();
        enemy_Sample.setAngle();
        enemy_Sample.setVelocity();
        enemies.push(new Players(enemy_Sample.x,enemy_Sample.y,enemy_Sample.radius,enemy_Sample.color,true,null,enemy_Sample.velocity,1));
    },1000)
}
animate();
createEnemy();