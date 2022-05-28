//Canvas
let canvas = document.getElementById('myCanvas');
let c = canvas.getContext('2d');
//Lấy chiều dài rộng màn hình
canvas.width = innerWidth - 50;
canvas.height = innerHeight - 50;
const SCREEN_X = canvas.width;
const SCREEN_Y = canvas.height;
//Vị trí ban đầu player ở trung tâm, độ lớn, màu, tốc độ chạy
const DEFAULT_PLAYER_X = canvas.width / 2;
const DEFAULT_PLAYER_Y = canvas.height / 2;
const DEFAULT_PLAYER_RADIUS = 15;
const DEFAULT_PLAYER_COLOR = 'white';
const DEFAULT_PLAYER_SPEED = 0.8;
let animateId;
let spawnEnemiesID;
let createSpellsBoxID;
let scores = [];
let score = 0;
let finalScore = 0;
let player = new Players(DEFAULT_PLAYER_X, DEFAULT_PLAYER_Y, DEFAULT_PLAYER_RADIUS, DEFAULT_PLAYER_COLOR,  null, null, DEFAULT_PLAYER_SPEED, 0, 1);
let bullet_Sample = new Bullet(); //tạo đối tượng mẫu
let enemy_Sample = new Players();
let spell_Sample = new Spells();
let bullets = [];
let enemies = [];
let spells = [];
let fragments = [];
let savedLevelWeapon = player.weapon_level;
let savedShield = player.shield;
// let img_background = new Image(); //Chèn hình ---> mất hiệu ứng bóng mờ
// img_background.src = "img/sky.jpg";
let menu = document.getElementById('menu');
let board = document.getElementById('board');
let settingsMenu = document.getElementById('settingsMenu');
let menuWeapon = document.getElementById('menuWeapon');
let menuShield = document.getElementById('menuShield');
board.style.display = 'none';
settingsMenu.style.display = 'none';
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

function reset() {
    player = new Players(DEFAULT_PLAYER_X, DEFAULT_PLAYER_Y, DEFAULT_PLAYER_RADIUS, DEFAULT_PLAYER_COLOR, null, null, DEFAULT_PLAYER_SPEED, player.weapon_level, player.shield);
    bullet_Sample = new Bullet(); //underfined
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
    c.fillRect(0, 0, SCREEN_X, SCREEN_Y);
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
        if (frags.alpha <= 0) {
            fragments.splice(index, 1)
        } else {
            frags.update();
        }
    })
    //Xóa đạn khi đạn bay ra khỏi Canvas
    bullets.forEach((bullet, index) => {
        bullet.draw();
        bullet.update();
        if (bullet.x + bullet.radius < 0 || bullet.x - bullet.radius > canvas.width || bullet.y + bullet.radius < 0 || bullet.y - bullet.radius > canvas.height) {

            bullets.splice(index, 1);

        }
    });
    enemies.forEach((enemy, index) => {
        enemy.draw();
        enemy.update();
        //Enemy nảy lại từ viền
        if (enemy.x + enemy.radius < 0 || enemy.x - enemy.radius > canvas.width || enemy.y + enemy.radius < 0 || enemy.y - enemy.radius > canvas.height) {
            let x = enemy.x = 0 - enemy.x;
            let y = enemy.y = 0 - enemy.y;
            enemy.setAngle(x, y);
            enemy.setVelocity();
        }
        //Kiểm tra Enemy va vào Player
        let distanceToPlayer = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (distanceToPlayer - player.radius - enemy.radius < -1) {
            explosion.play();
            enemies.splice(index, 1);
            player.decreateShield();
            //End Game
            if (player.shield < 0) {
                player.shield = savedShield;
                player.weapon_level = savedLevelWeapon;
                window.clearInterval(spawnEnemiesID);
                window.clearInterval(createSpellsBoxID);
                cancelAnimationFrame(animateId);
                endGame.play();
                finalScore = score;
                scores.push(finalScore);
                document.getElementById('bigscorepoint').innerHTML = score;
                menu.style.display = 'flex';
                board.style.display = 'none';
            }
            else {
                endGame2.play();
            }
        }
        //Kiểm tra đạn bắn trúng Enemy
        bullets.forEach((bullet, bulletIndex) => {
            let distanceToEnemy = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);
            if (distanceToEnemy - bullet.radius - enemy.radius < 0) {
                //Hiệu ứng vỡ
                for (let i = 0; i < enemy.radius * 2; i++) {
                    fragments.push(new Fragments(bullet.x, bullet.y, Math.random() * 2, enemy.color, {
                        x: (Math.random() - 0.5) * (Math.random() * 10),
                        y: (Math.random() - 0.5) * (Math.random() * 10)
                    }))
                }
                //Enemy bị nhỏ lại nếu quá lớn khi bị bắn trúng
                if (enemy.radius - 10 > 5) {
                    clash.play();
                    enemy.radius -= 10;

                    bullets.splice(bulletIndex, 1);

                } else {
                    enemies.splice(index, 1);
                    bullets.splice(bulletIndex, 1);
                    explosion.play();
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
                bullets.splice(bulletIndex, 1);
                spells.splice(index, 1);

            }
        })
    })
    document.getElementById('spell').innerHTML = player.weapon_level;
    document.getElementById('score').innerHTML = score;
    document.getElementById('shield').innerHTML = player.shield;
}

function createEnemy() {
    spawnEnemiesID = setInterval(() => {
        enemy_Sample.setRandomRadius();
        enemy_Sample.setRandomSpawn();
        enemy_Sample.setRandomColor();
        enemy_Sample.setAngle();
        enemy_Sample.setVelocity();
        enemies.push(new Players(enemy_Sample.x, enemy_Sample.y, enemy_Sample.radius, enemy_Sample.color, enemy_Sample.velocity, 2, null));
    }, 700)
}

function createSpellBox() {
    createSpellsBoxID = setInterval(() => {
        if (Math.random() > 0.2) {
            Math.random() < 0.5 ? spell_Sample.setTypeSpell(0) : spell_Sample.setTypeSpell(1);
        } else {
            spell_Sample.setTypeSpell(2);
        }
        spell_Sample.setRandomRespawn();
        spell_Sample.setColorSpell();
        spell_Sample.setSpell();
        spells.push(new Spells(spell_Sample.x, spell_Sample.y, 10, spell_Sample.type, spell_Sample.color));
    }, 11000);
}

function startGame() {
    gameMusic.play();
    reset();
    animate();
    createEnemy();
    createSpellBox();
    menu.style.display = 'none';
    board.style.display = 'inline';
    settingsMenu.style.display = 'none';
}

function setGame() {
    let max = 0;
    scores.forEach((score) => {
        if (score > max) {
            max = score;
        }
    })
    document.getElementById('biggestscorepoint').innerHTML = max;
    menu.style.display = 'none';
    board.style.display = 'none';
    settingsMenu.style.display = 'flex';
}

function backMenu() {
    menu.style.display = 'flex';
    board.style.display = 'none';
    settingsMenu.style.display = 'none';
}

function backSettingsMenu() {
    settingsMenu.style.display = 'flex';

    menuWeapon.style.display = 'none';
    menuShield.style.display = 'none';
}



function setWeapon() {
    settingsMenu.style.display = 'none';
    document.getElementById('currentGun').innerHTML = player.getWeaponLevel();
    menuWeapon.style.display = 'flex';
}

function setWeaponGun(x) {
    player.weapon_level = x;
    document.getElementById('currentGun').innerHTML = player.getWeaponLevel();
    savedLevelWeapon = player.weapon_level;
}

function setShield() {
    settingsMenu.style.display = 'none';
    document.getElementById('currentShield').innerHTML = player.shield;
    menuShield.style.display = 'flex';
}

function setShieldNumber(x) {
    player.shield = player.shield + x;
    console.log(typeof x);
    document.getElementById('currentShield').innerHTML = player.shield;
    savedShield = player.shield;
}