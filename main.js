let canvas = document.getElementById('myCanvas');
let c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;
const SCREEN_X = canvas.width;
const SCREEN_Y = canvas.height;
const DEFAULT_PLAYER_X = canvas.width/2;
const DEFAULT_PLAYER_Y = canvas.height/2;
const DEFAULT_PLAYER_RADIUS = 10;
const DEFAULT_PLAYER_COLOR = 'white';
const DEFAULT_PLAYER_SPEED = 0.8;
let animateId;
let score = 0;
let player = new Players(DEFAULT_PLAYER_X,DEFAULT_PLAYER_Y,DEFAULT_PLAYER_RADIUS,DEFAULT_PLAYER_COLOR,true,false,null,null,DEFAULT_PLAYER_SPEED,1,1);
let bullet_Sample = new Bullet();
let enemy_Sample = new Players();
let spell_Sample = new Spells();
let bullets = [];
let enemies = [];
let spells = [];
let fragments = [];
let img_background = new Image();
img_background.src = "img/sky.jpg";
let lvl0_shot = new Audio('audio/lvl-0-shot.mp3');
let lvl1_shot = new Audio('audio/lvl-1-shot.mp3');
let lvl2_shot = new Audio('audio/lvl-2-shot.mp3');
let explosion = new Audio('audio/explosion.mp3');
let clash = new Audio('audio/clash.mp3');
let endGame = new Audio('audio/end-game.mp3');
let endGame2 = new Audio('audio/end-game-2.mp3');
let upgrade = new Audio('audio/upgrade.mp3');
let downgrade = new Audio('audio/downgrade.mp3');

window.addEventListener('click',event => {
    player.shootingStatus = true;
    let x = event.clientX;
    let y = event.clientY;
    if (player.weapon_level <= 0) {
        lvl0_shot.play();
        bullet_Sample.setAngle(x,y);
        bullet_Sample.setVelocity();
        bullets.push(new Bullet(player.x,player.y,5,'white',bullet_Sample.velocity,bullet_Sample.angle,true));
    }
    else if (player.weapon_level===1) {
        lvl1_shot.play();
        bullet_Sample.setAngle(x,y-20);
        bullet_Sample.setVelocity();
        bullets.push(new Bullet(player.x,player.y,5,'red',bullet_Sample.velocity,bullet_Sample.angle,true));
        bullet_Sample.setAngle(x,y+20);
        bullet_Sample.setVelocity();
        bullets.push(new Bullet(player.x,player.y,5,'red',bullet_Sample.velocity,bullet_Sample.angle,true));
    }
    else {
        lvl2_shot.play();
        bullet_Sample.setAngle(x,y);
        bullet_Sample.setVelocity();
        bullets.push(new Bullet(player.x,player.y,5,'green',bullet_Sample.velocity,bullet_Sample.angle,true));
        bullet_Sample.setAngle(x,y-20);
        bullet_Sample.setVelocity();
        bullets.push(new Bullet(player.x,player.y,5,'green',bullet_Sample.velocity,bullet_Sample.angle,true));
        bullet_Sample.setAngle(x,y+20);
        bullet_Sample.setVelocity();
        bullets.push(new Bullet(player.x,player.y,5,'green',bullet_Sample.velocity,bullet_Sample.angle,true));
    }

    player.shootingStatus = false;
});
function animate() {
    animateId = requestAnimationFrame(animate);

    // c.drawImage(img_background,0,0,SCREEN_X,SCREEN_Y);
    c.fillStyle = 'rgba(0 , 0, 0, 0.05)';
    c.fillRect(0,0,SCREEN_X,SCREEN_Y);
    player.draw();
    player.move();
    if (player.x - player.radius < 0) {
        player.x = player.radius;
    }
    if (player.x + player.radius > SCREEN_X) {
        player.x = SCREEN_X - player.radius;
    }
    if (player.y - player.radius < 0) {
        player.y = player.radius;
    }
    if (player.y + player.radius > SCREEN_Y) {
        player.y = SCREEN_Y - player.radius;
    }
    fragments.forEach((frags, index) => {
        if(frags.alpha <= 0){
            fragments.splice(index, 1)
        } else {
            frags.update();
        }
    })

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
            explosion.play();
            enemies.splice(index,1);
            player.decreateShield();
            setTimeout(() => {
                endGame2.play();
            },500);
            if (player.shield < 0) {
                player.status = false;
                cancelAnimationFrame(animateId);
                endGame.play();

            }
        }
        bullets.forEach((bullet, bulletIndex) => {
            let distanceToEnemy = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);
            if (distanceToEnemy - bullet.radius - enemy.radius < 1) {
                for(let i = 0; i < enemy.radius * 2; i++){
                    fragments.push( new Fragments(bullet.x, bullet.y, Math.random()*2, enemy.color, {x: (Math.random() - 0.5) * (Math.random() * 10), y: (Math.random() - 0.5) * (Math.random() * 10)}))
                }
                bullet.status = false;
                if (enemy.radius - 10 > 10) {
                    clash.play();
                    enemy.radius -= 10;
                    setTimeout(() => {
                        bullets.splice(bulletIndex,1);
                    })
                }
                else {
                    explosion.play();
                    setTimeout(() => {
                        bullets.splice(bulletIndex,1);
                        enemies.splice(index,1);
                        enemy.status = false;
                    })
                }
                score += 100;
            }
        })
    });
    spells.forEach((spell, index) => {
        spell.draw();
        bullets.forEach((bullet, bulletIndex) => {
            let distanceToSpellBox = Math.hypot(bullet.x - spell.x, bullet.y - spell.y);
            if (distanceToSpellBox - bullet.radius - spell.radius < 1) {
                spell.setSpell(spell.type);
                    setTimeout(() => {
                        bullets.splice(bulletIndex,1);
                        spells.splice(index,1);
                        spell.status = false;
                    })
                }
        })
    })
    document.getElementById('spell').innerHTML = player.weapon_level;
    document.getElementById('score').innerHTML = score;
    document.getElementById('shield').innerHTML = player.shield;

}
function createEnemy() {
    setInterval(() => {
        enemy_Sample.setRandomRadius();
        enemy_Sample.setRandomSpawn();
        enemy_Sample.setRandomColor();
        enemy_Sample.setAngle();
        enemy_Sample.setVelocity();
        enemies.push(new Players(enemy_Sample.x,enemy_Sample.y,enemy_Sample.radius,enemy_Sample.color,true,null,enemy_Sample.velocity,2,null));
    },1000)
}
function createSpellBox() {
    setInterval(() => {
        if (Math.random() > 0.2) {
            Math.random() < 0.5 ? spell_Sample.setTypeSpell(0) : spell_Sample.setTypeSpell(1);
        }
        else {
            spell_Sample.setTypeSpell(2);
        }
        spell_Sample.setRandomRespawn();
        spell_Sample.setColorSpell();
        spell_Sample.setSpell();
        spells.push(new Spells(spell_Sample.x,spell_Sample.y,10,spell_Sample.type,spell_Sample.color,true));
    },1000);
}
animate();
createEnemy();
createSpellBox();