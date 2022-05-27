class Game {
    status;
    score;
    constructor(status, score) {
        this.status = status;
        this.score = score;
    }
    isEnd() {
        if (player.status === true) {
            this.status = true;
            return true;
        }
        else {
            this.status = false;
            return false;
        }
    }
    isStart() {

    }
    setReady() {

    }
    drawScreen() {
        c.beginPath();
        c.fillStyle = 'white';
        c.fillRect(0,0,SCREEN_X,SCREEN_Y);

    }

}