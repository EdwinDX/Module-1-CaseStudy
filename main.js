let canvas = document.getElementById('myCanvas');
let c = canvas.getContext('2d');
const SCREEN_X = canvas.width;
const SCREEN_Y = canvas.height;
const DEFAULT_PLAYER_X = canvas.width/2;
const DEFAULT_PLAYER_Y = canvas.height/2;
const DEFAULT_PLAYER_RADIUS = 10;
const DEFAULT_PLAYER_COLOR = 'white';
let animateId;
let player = new Players(DEFAULT_PLAYER_X,DEFAULT_PLAYER_Y,DEFAULT_PLAYER_RADIUS,DEFAULT_PLAYER_COLOR,true,false,null);
let bullet = new Bullet();
let bullets = [];

window.addEventListener('click',event => {
    bullet.setAngle(event);
    bullet.setVelocity();
    bullets.push(new Bullet(DEFAULT_PLAYER_X,DEFAULT_PLAYER_Y,5,'white',bullet.velocity,null,true));
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
    })
}
animate();