const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

class Enemy {
    
    constructor(canvas, context, game) {

        this.canvas = canvas;
        this.context = context;
        this.game = game;
        this.x = this.canvas.width;
        this.y = this.canvas.height-90;
        this.image = this.game.enemyImageIdle;
        this.attacking = false;
    }

    draw() {
        
        

        this.context.drawImage(
            this.image,
            this.game.currentPlayerFrame * this.game.playerFrameWidth,
            0, 
            this.game.spriteWidth,
            this.game.spriteHeight, 
            this.x, 
            this.y,
            this.game.spriteWidth,
            this.game.spriteHeight

        )
    }

    update() {
        // Enemy AI

        // Attack
        if (Math.random()*100 > 99) {
            this.attacking = true;
            console.log('Enemy attacking');
        }



        this.x -= 2;

        if (this.x < 0) {
            this.game.enemies.pop();
        }

    }

}

class Blast {

    constructor(canvas, context, game, direction) {
        this.canvas = canvas;
        this.context = context;
        this.game = game;
        this.x = this.game.playerX + 12;
        this.y = this.game.playerY + 12;
        this.image = this.game.blastImage;
        this.direction = direction;
    }

    update() {

        if (this.direction == 'left') {
            this.x -= 5;
        } else {
            this.x += 5;
        }
        
        if (this.x > this.canvas.width || this.x < 0) {
            this.game.attacks.pop();
        }
        
    }

    draw() {
        
        // this.context.fillStyle = 'red';
        // this.context.fillRect(this.x, this.y, 50, 50);

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
        this.enemies = [];
        this.frameCount = 5;

        
        // PLayer Images
       
        // Idle
        this.playerImageIdle = new Image();
        this.playerImageIdle.src = './Infantryman/Idle.png';
        // Idle Left
        this.playerImageIdleLeft = new Image();
        this.playerImageIdleLeft.src = './Infantryman/IdleLeft.png'
        // Jump
        this.playerImageJump = new Image();
        this.playerImageJump.src = './Infantryman/Shutdown.png';
        this.playerImageJumpLeft = new Image();
        this.playerImageJumpLeft.src = './Infantryman/ShutdownLeft.png';
        // Move Right
        this.playerImageMoveRight = new Image();
        this.playerImageMoveRight.src = './Infantryman/Walk.png';
        // Move Left
        this.playerImageMoveLeft = new Image();
        this.playerImageMoveLeft.src = './Infantryman/WalkLeft.png';
        // Shot
        this.playerImageShot = new Image();
        this.playerImageShot.src = './Infantryman/Shot_1.png';
        this.playerImageShotLeft = new Image();
        this.playerImageShotLeft.src = './Infantryman/Shot_1Left.png';

        this.playerImage = this.playerImageIdle;
        this.playerFrameWidth = 128;
        this.currentPlayerFrame = 1;
        this.frameOffset = 1;


        // Enemy Images

        this.enemyImageIdle = new Image();
        this.enemyImageIdle.src = './Destroyer/WalkLeft.png';

        // Directionality
        this.direction = 'right';
        

        // Attack Images

        // Blast
        this.blastImage = new Image();
        this.blastImage.src = './5 Bullets/9.png';


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
                this.direction = 'left';
                this.playerVelX = -5;
                this.playerImage = this.playerImageMoveLeft;
               
            } else if (event.key === 'ArrowRight') {
                this.direction = 'right';
                this.playerVelX = 5;
                this.playerImage = this.playerImageMoveRight;
  
            } else if (event.key === 'ArrowUp' && !this.isJumping) {
                this.playerVelY = -12;
                this.isJumping = true;
                if (this.direction == 'left') {
                    this.playerImage = this.playerImageJumpLeft;
                } else {
                    this.playerImage = this.playerImageJump;
                }
            } else if (event.key === 'w') {
                this.attacks.push(new Blast(this.canvas, this.context, this, this.blastImage, this.direction))
                
                if(this.direction == 'left') {
                    this.playerImage = this.playerImageShotLeft;
                } else {
                    this.playerImage = this.playerImageShot;
                }
                
                this.attacking = true;
                this.currentPlayerFrame = 0;
                this.frameCount = 11;
            }
        });

        document.addEventListener('keyup', (event) => {

            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                this.playerVelX = 0;
                if (this.direction == 'left') {
                    this.playerImage = this.playerImageIdleLeft;
                    this.frameCount = 5;
                } else {
                    this.playerImage = this.playerImageIdle;
                    this.frameCount = 5;
                } 
                
            } else if (event.key === 'w') {
                this.frameCount = 5;
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
        
        if (this.currentPlayerFrame > this.frameCount) {
            if (this.attacking) {
                this.attacking = false;
                if (this.direction == 'left') {
                    this.playerImage = this.playerImageIdleLeft;
                } else {
                    this.playerImage = this.playerImageIdle;
                }
                
            }
            this.currentPlayerFrame = 0;
        }

        
        // Draw attacks
        for (let i=0; i < this.attacks.length; i++) {
            let attack = this.attacks[i];
            attack.update();
            attack.draw();
        }
    


        // ENEMIES
        if (this.enemies.length <= 0) {

            this.enemies.push(new Enemy(this.canvas, this.context, this))
        }
    

        // Draw enemies
        for (let i=0; i < this.enemies.length; i++) {
            let enemy = this.enemies[i];
            enemy.update();
            enemy.draw();
        }

        // Schedule next frame update
        requestAnimationFrame(this.update.bind(this));
    }

}


const game = new Game(ctx, canvas);
game.update();