
class Main extends Phaser.Scene {

    // This function essentially loads things into our game
    preload() {
    this.load.image('plane', 'assets/plane.png');
    this.load.image('pipe', 'assets/pipe.png');
    this.load.audio('jump', 'assets/jump.wav');
}

    //  it runs once at the beginning of the game and
    //  allows the user to place the things that they’ve preloaded with preload() and
    //  create objects within our game such as animations, collision detectors, text, groups, and much more
    create() {
    //Додаємо літак на сцену
    this.plane = this.physics.add.sprite(0, 0, 'plane')
    //Масштабуємо літак
    this.plane.setScale(0.5, 0.5);
    //Встановлюємо опорну точку літака
    this.plane.setOrigin(-0.1, -3.5);
    this.plane.body.gravity.y = 0;
    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.score = 0;
    this.labelScore = this.add.text(20, 20, "0", {fontSize: 24, color: "black"});
    this.pipes = this.physics.add.group();

    this.timedEvent = this.time.addEvent({
    delay: 1500,
    callback: this.addRowOfPipes, //Цю функцію реалізуємо на наступному кроці
    callbackScope: this,
    loop: true
    });
    this.physics.add.overlap(this.plane, this.pipes, this.hitPipe, null, this);
    }

    // While preload() and create() run only once at the start of the game, update() runs constantly.
    update() {
        if (this.plane.y < 490) {
            this.plane.body.gravity.y = 1000;
        }
        if (this.spaceBar.isDown) {
            this.jump();
        }


    }
    jump() {
        this.tweens.add({
            targets: this.plane,
            duration: 100,
            repeat: 1
        });
        this.plane.body.velocity.y = -350;
        this.plane.body.gravity.y = 1000;
    }
    addOnePipe(x, y) {
        var pipe = this.physics.add.sprite(x, y, 'pipe');
        pipe.setOrigin(0, 0);
        this.pipes.add(pipe);
        pipe.body.velocity.x = -300;
    
        pipe.collideWorldBounds = true;
        pipe.outOfBoundsKill = true;
    }
    //Функція створення труби (стовпчик блоків)
    addRowOfPipes() {
        this.score += 1;
        this.labelScore.text = this.score;
        var i = 0; i < 8; i++ 
                this.addOnePipe(400, 400);
                this.addOnePipe(400, 350);
        
    }
    hitPipe () {
        if (this.plane.alive == false) return;
    
        this.timedEvent.remove(false);
        this.plane.alive = false;
    
        this.pipes.children.each(function(pipe) {
            pipe.body.velocity.x = 0;
        });
    }

};

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 490,
    scene: Main, // Цю сцену ми створимо на 4-му кроці
    backgroundColor: '#71c5cf',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0}
        }
    }
};

const game = new Phaser.Game(config);