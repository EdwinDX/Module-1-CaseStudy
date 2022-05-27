//Canvas
let canvas = document.getElementById('myCanvas');
let c = canvas.getContext('2d');
//Lấy chiều dài rộng màn hình
canvas.width = innerWidth-50;
canvas.height = innerHeight-50;
const SCREEN_X = canvas.width;
const SCREEN_Y = canvas.height;
//Vị trí ban đầu player ở trung tâm, độ lớn, màu, tốc độ chạy
const DEFAULT_PLAYER_X = canvas.width/2;
const DEFAULT_PLAYER_Y = canvas.height/2;
const DEFAULT_PLAYER_RADIUS = 10;
const DEFAULT_PLAYER_COLOR = 'white';
const DEFAULT_PLAYER_SPEED = 0.8;
let animateId;
let scores = [];
let score = 0;
let finalScore = 0;
let player = new Players(DEFAULT_PLAYER_X,DEFAULT_PLAYER_Y,DEFAULT_PLAYER_RADIUS,DEFAULT_PLAYER_COLOR,true,false,null,null,DEFAULT_PLAYER_SPEED,0,1);
let bullet_Sample = new Bullet(); //tạo đối tượng mẫu
let enemy_Sample = new Players();
let spell_Sample = new Spells();
let bullets = [];
let enemies = [];
let spells = [];
let fragments = [];
// let img_background = new Image(); //Chèn hình ---> mất hiệu ứng bóng mờ
// img_background.src = "img/sky.jpg";
let menu = document.getElementById('menu');
let board = document.getElementById('board');
let settingsMenu = document.getElementById('settingsMenu');
let menuDifficult = document.getElementById('menuDifficult');
let menuWeapon = document.getElementById('menuWeapon');
let menuShield = document.getElementById('menuShield');
board.style.display = 'none';
settingsMenu.style.display = 'none';
menuDifficult.style.display = 'none';
menuWeapon.style.display = 'none';
menuShield.style.display = 'none';
//Âm thanh
let lvl0_shot = new Audio('audio/lvl-0-shot.mp3');
let lvl1_shot = new Audio('audio/lvl-1-shot.mp3');
let lvl2_shot = new Audio('audio/lvl-2-shot.mp3');
let explosion = new Audio('audio/explosion.mp3');
let clash = new Audio('audio/clash.mp3');
let endGame = new Audio('audio/end-game.mp3');
let endGame2 = new Audio('audio/end-game-2.mp3');
let upgrade = new Audio('audio/upgrade.mp3');
let downgrade = new Audio('audio/downgrade.mp3');
let gameMusic = new Audio('audio/game.mp3');

function reset(){
    player = new Players(DEFAULT_PLAYER_X,DEFAULT_PLAYER_Y,DEFAULT_PLAYER_RADIUS,DEFAULT_PLAYER_COLOR,true,false,null,null,DEFAULT_PLAYER_SPEED,player.weapon_level,this.shield);
    bullet_Sample = new Bullet();
    enemy_Sample = new Players();
    spell_Sample = new Spells();
    score = 0;
    scores.push(score);
    finalScore = 0;
    bullets = [];
    enemies = [];
    spells = [];
    fragments = [];
}

function animate() {
    animateId = requestAnimationFrame(animate);
    gameMusic.play();
    // c.drawImage(img_background,0,0,SCREEN_X,SCREEN_Y);
    c.fillStyle = 'rgba(0 , 0, 0, 0.05)';
    c.fillRect(0,0,SCREEN_X,SCREEN_Y);
    player.draw();
    player.move();
    //Giới hạn vùng chạy player trong Canvas
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
    //Xóa đạn khi đạn bay ra khỏi Canvas
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
        //Enemy nảy lại từ viền
        if (enemy.x+enemy.radius<0 || enemy.x-enemy.radius>canvas.width || enemy.y+enemy.radius<0 || enemy.y-enemy.radius>canvas.height) {
            let x = enemy.x = 0 - enemy.x;
            let y = enemy.y = 0 - enemy.y;
            enemy.setAngle(x,y);
            enemy.setVelocity();
        }
        //Kiểm tra Enemy va vào Player
        let distanceToPlayer = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (distanceToPlayer - player.radius - enemy.radius < 1) {
            explosion.play();
            enemies.splice(index,1);
            player.decreateShield();
            setTimeout(() => {
                endGame2.play();
            },500);
            //End Game
            if (player.shield < 0) {
                player.status = false;
                cancelAnimationFrame(animateId);
                endGame.play();
                finalScore = score;
                document.getElementById('bigscorepoint').innerHTML = score;
                menu.style.display = 'flex';
                board.style.display = 'none';
            }
        }
        //Kiểm tra đạn bắn trúng Enemy
        bullets.forEach((bullet, bulletIndex) => {
            let distanceToEnemy = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);
            if (distanceToEnemy - bullet.radius - enemy.radius < 1) {
                //Hiệu ứng vỡ
                for(let i = 0; i < enemy.radius * 2; i++){
                    fragments.push( new Fragments(bullet.x, bullet.y, Math.random()*2, enemy.color, {x: (Math.random() - 0.5) * (Math.random() * 10), y: (Math.random() - 0.5) * (Math.random() * 10)}))
                }
                bullet.status = false;
                //Enemy bị nhỏ lại nếu quá lớn khi bị bắn trúng
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
    //Skill của player
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
    console.log(typeof player.shield);
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
    },30000);
}
function startGame() {
    gameMusic.play();
    window.addEventListener('click',event => {
        player.shootingStatus = true;
        let x = event.clientX;
        let y = event.clientY;
        if (player.weapon_level <= 0) {
            lvl0_shot.play();
            bullet_Sample.color = 'white';
            bullet_Sample.setAngle(x,y);
            bullet_Sample.setVelocity();
            bullets.push(new Bullet(player.x,player.y,5,bullet_Sample.color,bullet_Sample.velocity,bullet_Sample.angle,true));
        }
        else if (player.weapon_level===1) {
            lvl1_shot.play();
            bullet_Sample.color = 'red';
            bullet_Sample.setAngle(x,y-20);
            bullet_Sample.setVelocity();
            bullets.push(new Bullet(player.x,player.y,5,bullet_Sample.color,bullet_Sample.velocity,bullet_Sample.angle,true));
            bullet_Sample.setAngle(x,y+20);
            bullet_Sample.setVelocity();
            bullets.push(new Bullet(player.x,player.y,5,bullet_Sample.color,bullet_Sample.velocity,bullet_Sample.angle,true));
        }
        else {
            lvl2_shot.play();
            bullet_Sample.color = 'green';
            bullet_Sample.setAngle(x,y);
            bullet_Sample.setVelocity();
            bullets.push(new Bullet(player.x,player.y,5,bullet_Sample.color,bullet_Sample.velocity,bullet_Sample.angle,true));
            bullet_Sample.setAngle(x,y-20);
            bullet_Sample.setVelocity();
            bullets.push(new Bullet(player.x,player.y,5,bullet_Sample.color,bullet_Sample.velocity,bullet_Sample.angle,true));
            bullet_Sample.setAngle(x,y+20);
            bullet_Sample.setVelocity();
            bullets.push(new Bullet(player.x,player.y,5,bullet_Sample.color,bullet_Sample.velocity,bullet_Sample.angle,true));
        }

        player.shootingStatus = false;
    });
    reset();
    animate();
    createEnemy();
    createSpellBox();
    menu.style.display = 'none';
    board.style.display = 'inline';
    settingsMenu.style.display = 'none';
}
function setGame() {
    menu.style.display = 'none';
    board.style.display = 'none';
    settingsMenu.style.display = 'flex';
}
function  backMenu() {
    menu.style.display = 'flex';
    board.style.display = 'none';
    settingsMenu.style.display = 'none';
}
function backSettingsMenu () {
    settingsMenu.style.display = 'flex';
    menuDifficult.style.display = 'none';
    menuWeapon.style.display = 'none';
    menuShield.style.display = 'none';
}
function setDifficult() {
    settingsMenu.style.display = 'none';

    menuDifficult.style.display = 'flex';
}
function setWeapon() {
    settingsMenu.style.display = 'none';
    document.getElementById('currentGun').innerHTML = player.getWeaponLevel();
    menuWeapon.style.display = 'flex';
}
function setWeaponGun(x) {
    player.weapon_level = x;
    document.getElementById('currentGun').innerHTML = player.getWeaponLevel();
}
function setShield() {
    settingsMenu.style.display = 'none';
    document.getElementById('currentShield').innerHTML = player.shield;
    menuShield.style.display = 'flex';
}
function setShieldNumber(x) {
    player.shield = player.shield+x;
    console.log(typeof x);
    document.getElementById('currentShield').innerHTML = player.shield;
}