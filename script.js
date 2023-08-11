const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

this.blastImage = new Image();
this.blastImage.src = '4 Shoot_effects/blast.png';


class Blast {

    constructor(canvas, context, game, image) {
        this.canvas = canvas;
        this.context = context;
        this.game = game;
        this.x = this.game.playerX + 5;
        this.y = this.game.playery;
        this.image = image;
    }

    update() {
        this.x += 5;
        if (this.x > this.canvas.width) {
            this.game.attacks.pop(this);
        }
    }

    draw() {
        console.log('draw');
        this.context.drawImage(
            this.image,
            this.x,
            this.y
        )
    }

    
}



class Game {

    constructor(ctx, canvas) {
        this.canvas = canvas;
        this.context = ctx;
        this.playerX = 50;
        this.playerY = canvas.height - 100;
        this.playerVelX = 0;
        this.playerVelY = 0;
        this.isJumping = false;
        this.spriteWidth = 128;
        this.spriteHeight = 72;
        this.backgroundImage = new Image();
        this.backgroundImage.src = 'background.jpg';
        this.attacks = [];

        
        // PLayer Images
       
        // Idle
        this.playerImageIdle = new Image();
        this.playerImageIdle.src = './Infantryman/Idle.png';
        // Jump
        this.playerImageJump = new Image();
        this.playerImageJump.src = './Infantryman/Shutdown.png';
        // Move
        this.playerImageMove = new Image();
        this.playerImageMove.src = './Infantryman/Walk.png';
        // Shot
        this.playerImageShot = new Image();
        this.playerImageShot.src = './Infantryman/Shot_1.png';

        this.playerImage = this.playerImageIdle;
        this.playerFrameWidth = 128;
        this.currentPlayerFrame = 1;
        this.frameOffset = 1;



        // Attack Images

        // Blast
        this.blastImage = new Image();
        this.blastImage.src = '4 Shoot_effects/blast.png';


        // Platform Positions

        this.platformPositions = [[200, this.canvas.height-415, 420, 20],
                                    [420, this.canvas.height-515, 230, 20],
                                    [75, this.canvas.height-335, 140, 20],
                                    [78, this.canvas.height-250, 350, 20],
                                    [420, this.canvas.height-195, 280, 20]
                                ]
    

        

        // attack variables
        this.attacking = false;

        // Event Handling
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                this.playerVelX = -5;
                this.playerImage = this.playerImageMove;
            } else if (event.key === 'ArrowRight') {
                this.playerVelX = 5;
                this.playerImage = this.playerImageMove;
            } else if (event.key === 'ArrowUp' && !this.isJumping) {
                this.playerVelY = -12;
                this.isJumping = true;
                this.playerImage = this.playerImageJump;
            } else if (event.key === 'w') {
                this.attacks.push(new Blast(this.canvas, this.context, this, this.blastImage))
                this.playerImage = this.playerImageShot;
                this.attacking = true;
                this.currentPlayerFrame = 0;
            }
        });

        document.addEventListener('keyup', (event) => {

            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                this.playerVelX = 0;
                this.playerImage = this.playerImageIdle;
            }
        });

    }   



    update() {

        // attack logic

        

        // Update player position
        this.playerX += this.playerVelX;
        this.playerY += this.playerVelY;

        // Apply gravity
        this.playerVelY += 0.5;

        // Check for collision with ground
        if (this.playerY > this.canvas.height - 90) {
            this.playerY = this.canvas.height - 90;
            this.playerVelY = 0;
            this.isJumping = false;
        }

        // Check for collision with platforms

        for (let i=0; i<this.platformPositions.length; i++) {
            let position = this.platformPositions[i];
            let x = position[0];
            let y = position[1];
            let length = position[2];
            let height = position[3];
            if (
                (this.playerX > x && this.playerX < x + length) &&
                (this.playerY < y && this.playerY > y - height)) {
                    this.playerVelY =0;
                    this.isJumping = false;
            }
        }

        // Clear canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);


        // Draw background

        this.context.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height)
       
       
        

        // Draw player
        // this.context.fillStyle = 'red';
        // this.context.fillRect(this.playerX, this.playerY, 50, 50);

        this.context.drawImage(
            this.playerImage,
            this.currentPlayerFrame * this.playerFrameWidth,
            0, 
            this.spriteWidth,
            this.spriteHeight, 
            this.playerX, 
            this.playerY,
            this.spriteWidth,
            this.spriteHeight
            );

        if (this.frameOffset > 7) {
            this.frameOffset = 1;
            this.currentPlayerFrame += 1;
        }
        this.frameOffset += 1;
        
        if (this.currentPlayerFrame > 5) {
            if (this.attacking) {
                this.attacking = false;
                this.playerImage = this.playerImageIdle;
            }
            this.currentPlayerFrame = 0;
        }


        // Draw attacks
        for (let i=0; i < this.attacks.length; i++) {
            let attack = this.attacks[i];
            attack.update();
            attack.draw();
        }
    

        // Schedule next frame update
        requestAnimationFrame(this.update.bind(this));
    }

}


const game = new Game(ctx, canvas);
game.update();