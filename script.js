const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;






class Bonus {


    constructor(canvas, context, game, x, y) {
        this.canvas = canvas;
        this.context = context;
        this.game = game;
        this.x = x;
        this.y = y;
        this.image = this.game.healthBonusImage;
        this.yOffsetDown = this.y + 5;
        this.yOffsetUp = this.y - 5;
        this.direction = 'down';
    }


    draw() {

        this.context.drawImage(this.image, this.x, this.y, 30, 30);
    }

    update() {
        if((this.y < (this.yOffsetDown)) && (this.direction == 'down')) {
            this.y += 0.1
        } else {
            this.direction = 'up';
        }

        if ((this.y > this.yOffsetUp) && (this.direction == 'up')) {
            this.y -= 0.1
        } else {
            this.direction = 'down';
        }

    }
}


class Ammo extends Bonus {

    constructor(canvas, context, game, x, y) {

        super(canvas, context, game, x, y);
        this.image = this.game.ammoBonusImage;
    }




}


// ENEMY CLASSES

class Enemy {
    
    constructor(canvas, context, game) {

        this.canvas = canvas;
        this.context = context;
        this.game = game;
        this.x = this.canvas.width;
        this.y = this.canvas.height-90;
        this.image = this.game.enemy1ImageWalkLeft;
        this.imageIdle = this.game.enemy1ImageIdle;
        this.imageWalk = this.game.enemy1ImageWalkLeft;
        this.imageHurt = this.game.enemy1ImageHurt;
        this.imageAttack = this.game.enemy1ImageAttackLeft;
        this.imageDeath = this.game.enemy1ImageDeath;
        this.attacking = false;
        this.health = 100;
        this.frameCount = 5;
        this.currentFrame = 0;
        this.frameOffset = 1;
        this.frameCap = 5;
        this.xVel = -2;
        this.direction = 'left';
        this.attackCount = 0;
        this.spriteWidth = 128;
        this.spriteHeight = 72;
        this.frameWidth = 128;
        this.attackFrameCount = 3;
        this.deathFrameCount = 6;
        this.deathFrameWidth = 110;
        this.dead = false;
    }

    draw() {
        
        this.context.drawImage(
            this.image,
            this.currentFrame * this.frameWidth,
            0, 
            this.spriteWidth,
            this.spriteHeight, 
            this.x, 
            this.y,
            this.spriteWidth,
            this.spriteHeight

        )
    }

    update() {


        // Enemy AI

        // Attack
        if (Math.random()*100 > 99 && !this.dead) {
            this.attacking = true;
            this.image = this.imageAttack;
            this.frameCount = this.attackFrameCount;
            this.attackCount = 0;
            this.game.attacks.push(new Blast(this.canvas, this.context, this.game, this.direction, this.x - 20, this.y + 20))
            this.xVel = 0;
        }

        if (this.attacking) {
            this.attackCount += 1;
            if (this.attackCount >= 30) {
                this.attacking = false;
                this.image = this.imageWalk;
                this.frameCount = 5;
                this.xVel = -2;
            }
        }

            
        if (this.currentFrame >= this.frameCount) {
            if (this.dead) {
                this.game.enemies.splice(0, 1);
                
            } else {
                this.currentFrame = 0;
            }
            
            
        }

        if (this.frameOffset > 7) {
            this.frameOffset = 1;
            this.currentFrame += 1;
        }

        this.frameOffset += 1;


        // MOVEMENT
        if (!this.dead) {
            this.x += this.xVel;
        }
        

        if (this.x < 0) {
            this.game.enemies.splice(0, 1);
        } else if (this.health <= 0 && this.image != this.imageDeath) {
            this.game.score += 10;
            this.dead = true;
            this.image = this.imageDeath;
            this.frameCount = this.deathFrameCount;
            this.frameWidth = this.deathFrameWidth;
            this.currentFrame = 0
            
        }

        
    }
}


class Enemy2 extends Enemy {

    constructor(canvas, context, game) {
        super(canvas, context, game);
        this.image = this.game.enemy2ImageWalk;
        this.y = this.canvas.height-90;
        this.frameCount = 3;
        this.imageIdle = this.game.enemy2ImageIdle;
        this.imageWalk = this.game.enemy2ImageWalk;
        this.imageHurt = this.game.enemy2ImageHurtLeft;
        this.imageAttack = this.game.enemy2ImageAttack1Left;
        this.imageDeath = this.game.enemy2ImageDeath;
        this.deathFrameCount = 2;
        this.deathFrameWidth = 90;
    }
}


class Raider extends Enemy {

    constructor(canvas, context, game) {
        super(canvas, context, game)
        this.image = this.game.raiderImageWalkLeft;
        this.imageWalk = this.game.raiderImageWalkLeft;
        this.imageHurt = this.game.raiderImageHurt;
        this.imageIdle = this.game.raiderImageIdle;
        this.imageAttack = this.game.raiderImageAttackLeft;
        this.imageDeath = this.game.raiderImageDeath;

        this.frameCount = 7;
        this.y = this.canvas.height-90;
        this.attackFrameCount = 15;
        this.deathFrameCount = 3;
    }


}


class Drone extends Enemy{


    constructor(canvas, context, game, direction) {
        super(canvas, context, game);
        this.canvas = canvas;
        this.context = context;
        this.game = game;
        this.direction = direction;
        this.image = this.game.drone1Image;
        this.frameCount = 4;
        this.spriteWidth = 90;
        

        if (this.direction == 'left') {
            this.x = this.canvas.width;
            this.xVel = -5;
        } else {

            this.x = 0;
            this.xVel = 5;
        }
       
      
  
        this.y = 200;
        this.yVel = 0;

        if (this.x < 0) {
            this.game.enemies.splice(0, 1);
        } else if (this.x > this.game.canvas.width) {
            this.game.enemies.splice(0, 1);
        }

    }



    update() {

        this.x += this.xVel;
        this.y += this.yVel;

        if(Math.random() >= 0.8) {
            this.dropBomb();
        }
        
    }

    dropBomb() {

        this.game.bombs.push(new Bomb(this.canvas, this.context, this.game, this.x, this.y));

    }
}


class Bomb {
    constructor(canvas, context, game, x, y) {

        this.canvas = canvas;
        this.context = context;
        this.game = game;
        this.x = x;
        this.y = y;   
        this.xVel = 0;
        this.yVel = 5;
        this.image = this.game.bombImage;
    }


    draw() {

        this.context.drawImage(this.image, this.x, this.y, 30, 30);
    }

    update() {

        this.x += this.xVel;
        this.y += this.yVel;
    }
}

class Blast {

    constructor(canvas, context, game, direction, x, y) {
        this.canvas = canvas;
        this.context = context;
        this.game = game;
        this.x = x - 20;
        this.y = y;
        this.image = this.game.attackImage1;
        this.direction = direction;
    }

    update() {

        if (this.direction == 'left') {
            this.x -= 10;
        } else {
            this.x += 10;
            
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

class Charge extends Blast{

    constructor(canvas, context, game, direction, x, y) {
        super(canvas, context, game, direction, x, y)
        this.canvas = canvas;
        this.context = context;
        this.game = game;
        this.x = x - 20;
        this.y = y;
        this.image = this.game.attackImage2;
        this.direction = direction;
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
        this.spriteWidth = 120;
        this.spriteHeight = 72;
        this.backgroundImage = new Image();
        this.backgroundImage.src = 'background.jpg';
        this.attacks = [];
        this.bombs = [];
        this.enemies = [];
        this.bonuses = [];
        this.frameCount = 5;
        this.playerHealth = 100;
        this.playerHealthBars = 5;
        this.playerDead = false;
        this.playerShield = false;
        this.playerMeleeAttack = false;
        this.playerHurt = false;
        this.playerShieldPower = 100;
        this.playerShieldDrain = false;
        this.playerChargeAmmo = 5;

        this.win = false;

        
        // CODEC
        
        this.codec = false;
        this.codecMessages = [
            "Well done RX-5!"
        ];
        

        this.score = 0;

        // Directionality
        this.direction = 'right';




        // Game Sounds

        this.audioObjects = [];

        this.jumpSfx = new Audio("./Sounds/jump.wav");
        this.bonusSfx = new Audio("./Sounds/bonus.wav");
        this.chargeSfx = new Audio("./Sounds/charge.wav");
        this.blastSfx = new Audio("./Sounds/blast.wav");
        this.shieldSfx = new Audio("./Sounds/shield.wav");


        
        // Player Images
       
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

        this.playerImageShot2 = new Image();
        this.playerImageShot2.src = './Infantryman/Shot_2.png';

        this.playerImageShot2Left = new Image();
        this.playerImageShot2Left.src = './Infantryman/Shot_2Left.png';

        // Attack

        this.playerImageAttack = new Image();
        this.playerImageAttack.src = './Infantryman/Attack_1.png';

        this.playerImageAttackLeft = new Image();
        this.playerImageAttackLeft.src = './Infantryman/Attack_1Left.png';


        this.playerImage = this.playerImageIdle;
        this.playerFrameWidth = 128;
        this.currentPlayerFrame = 1;
        this.frameOffset = 1;


        // Hurt

        this.playerImageHurt = new Image();
        this.playerImageHurt.src = './Infantryman/Hurt.png';

        // Dead
        this.playerImageDead = new Image();
        this.playerImageDead.src = './Infantryman/Dead.png'
        this.playerImageDeadLeft = new Image();
        this.playerImageDeadLeft.src = './Infantryman/DeadLeft.png';


        

        // ENEMY IMAGES

        // DESTROYER
      
        this.enemy1ImageIdle = new Image();
        this.enemy1ImageIdle.src = './Destroyer/IdleLeft.png';

        this.enemy1ImageWalkLeft = new Image();
        this.enemy1ImageWalkLeft.src = './Destroyer/WalkLeft.png';

        this.enemy1ImageHurt = new Image();
        this.enemy1ImageHurt.src = './Destroyer/HurtLeft.png';

        this.enemy1ImageAttack = new Image();
        this.enemy1ImageAttack.src = './Destroyer/Attack_1.png';

        this.enemy1ImageAttackLeft = new Image();
        this.enemy1ImageAttackLeft.src = './Destroyer/Shot_1Left.png';


        this.enemy1ImageDeath = new Image();
        this.enemy1ImageDeath.src = './Destroyer/Dead.png';
   
        
        // SWORDSMAN
        this.enemy2ImageIdle = new Image();
        this.enemy2ImageIdle.src = './Swordsman/Idle.png';

        this.enemy2ImageWalk = new Image();
        this.enemy2ImageWalk.src = './Swordsman/Pick_UpLeft.png';


        this.enemy2ImageHurt = new Image();
        this.enemy2ImageHurt.src = './Swordsman/Hurt.png';

        this.enemy2ImageHurtLeft = new Image();
        this.enemy2ImageHurtLeft.src = './Swordsman/HurtLeft.png';

        this.enemy2ImageAttack1Left = new Image();
        this.enemy2ImageAttack1Left.src = './Swordsman/Attack_1Left.png';

        this.enemy2ImageDeath = new Image();
        this.enemy2ImageDeath.src = './Swordsman/Dead.png';


        // DRONE 1

        this.drone1Image = new Image();
        this.drone1Image.src = './1 Drones/4/Idle.png';


        // RAIDER

        this.raiderImageWalk = new Image();
        this.raiderImageWalk.src = './Raider_1/Walk.png';

        this.raiderImageWalkLeft = new Image();
        this.raiderImageWalkLeft.src = './Raider_1/WalkLeft.png';

        this.raiderImageHurt = new Image();
        this.raiderImageHurt.src = './Raider_1/Hurt.png';

        this.raiderImageIdle = new Image();
        this.raiderImageIdle.src = './Raider_1/Idle.png';

        this.raiderImageIdleLeft = new Image();
        this.raiderImageIdleLeft.src = './Raider_1/Idle.png';


        this.raiderImageAttackLeft = new Image();
        this.raiderImageAttackLeft.src = './Raider_1/Shot.png';


        this.raiderImageDeath = new Image();
        this.raiderImageDeath.src = './Raider_1/Dead.png';


        // ATTACK IMAGES


        // Bomb

        this.bombImage = new Image();
        this.bombImage.src = './SCML/Bombs/Bomb_01_1.png'

        // Blast
        this.blastImage = new Image();
        this.blastImage.src = './5 Bullets/9.png';


        // ATTACK IMAGE
        this.attackImage1 = new Image();
        this.attackImage1.src = './Infantryman/Charge_1-1.png';

        this.attackImage1Left = new Image();
        this.attackImage1Left.src = './Infantryman/Charge_1-1Left.png';


        this.attackImage2 = new Image();
        this.attackImage2.src = './Infantryman/Charge_2.png';

        this.attackImage2Left = new Image();
        this.attackImage2Left.src = './Infantryman/Charge_2Left.png';



        // BONUS IMAGES

        this.healthBonusImage = new Image();
        this.healthBonusImage.src = './PNG/Bonus_Items/HP_Bonus.png';


        this.ammoBonusImage = new Image();
        this.ammoBonusImage.src = './PNG/Bonus_Items/Rockets_Bonus.png';

        // CODEC

        this.doctorImage = new Image();
        this.doctorImage.src = './pixie(4)_resized.png';




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
            if (event.key === 'ArrowLeft' && !this.playerDead) {
                this.direction = 'left';
                this.playerVelX = -5;
                this.playerImage = this.playerImageMoveLeft;
               
            } else if (event.key === 'ArrowRight' && !this.playerDead) {
                this.direction = 'right';
                this.playerVelX = 5;
                this.playerImage = this.playerImageMoveRight;
  
            } else if (event.key === 'ArrowUp' && !this.isJumping && !this.playerDead) {
                this.playerVelY = -12;
                this.isJumping = true;
                this.playSoundEffect('./Sounds/jump.wav');
                if (this.direction == 'left') {
                    this.playerImage = this.playerImageJumpLeft;
                } else {
                    this.playerImage = this.playerImageJump;
                }
            } else if (event.key === 'ArrowDown' && !this.playerShield && (this.playerShieldPower > 30)) {
                this.playSoundEffect('./Sounds/shield.wav');
                this.playerShield = true;
                this.playerShieldDrain = true;
                

            }
            
            else if (event.key === 'w' && !this.playerDead) {
                
                this.playSoundEffect('./Sounds/blast.wav');
                
                if(this.direction == 'left') {
                    this.playerImage = this.playerImageShotLeft;
                    this.attacks.push(new Blast(this.canvas, this.context, this, this.direction, this.playerX - 20, this.playerY + 20))
                } else {
                    this.playerImage = this.playerImageShot;
                    this.attacks.push(new Blast(this.canvas, this.context, this, this.direction, this.playerX + 70, this.playerY + 20))
                }
                
                this.attacking = true;
                this.currentPlayerFrame = 0;
                this.frameCount = 11;

            } else if (event.key === 'e' && !this.playerDead) {
                
                if (this.playerChargeAmmo <= 0) {
                    console.log('Not enough charge ammo')
                } else {

                    this.playSoundEffect('./Sounds/charge.wav');
                    this.playerChargeAmmo -= 1;

                    if(this.direction == 'left') {
                        this.playerImage = this.playerImageShot2Left;
                        this.attacks.push(new Charge(this.canvas, this.context, this, this.direction, this.playerX - 20, this.playerY + 20))
                        
                    } else {
                        this.playerImage = this.playerImageShot2;
                        this.attacks.push(new Charge(this.canvas, this.context, this, this.direction, this.playerX + 70, this.playerY + 20))
                    }
                    
                    this.attacking = true;
                    this.currentPlayerFrame = 0;
                    this.frameCount = 4;

                }
                 

            } else if (event.key === 'q' && !this.playerDead) {
                

                if(this.direction == 'left') {
                    this.playerImage = this.playerImageAttackLeft;
                    this.frameCount = 16;
                    
                    
                } else {
                    this.playerImage = this.playerImageAttack;
                    this.frameCount = 16;
                }
                
                this.playerMeleeAttack = true;
                this.currentPlayerFrame = 0;
                

            } 
        });

        document.addEventListener('keyup', (event) => {

            if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && (!this.playerDead)) {
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

            } else if (event.key === 'ArrowDown') {
                this.playerShieldDrain = false;
                this.playerShield = false;
                this.frameCount = 5;
            } else if (event.key === 'q') {

                
            }
        });

    }   


    playSoundEffect(soundFile) {
        var audio = new Audio(soundFile);
        this.audioObjects.push(audio);
        audio.play();

        // Remove the audio object from the array when it finishes playing
        audio.addEventListener('ended', () => {
            var index = this.audioObjects.indexOf(audio);
            if (index > -1) {
                this.audioObjects.splice(index, 1);
            }
        })
    }

    drawHUD() {
        const xStartHealth = 20;
        const yStartHealth = 50;
        const xStartShield = this.canvas.width - 200;
        const yStartShield = 50;
        const xStartAmmo = 20;
        const yStartAmmo = 100;


        for (let i = 1; i < this.playerHealthBars+1; i ++) {

            this.context.fillStyle = "lightgreen";
            this.context.fillRect(xStartHealth*i, yStartHealth, 15, 25);
            this.context.strokeStyle = "blue";
            this.context.strokeRect(xStartHealth*i, yStartHealth, 15, 25)
        }

        for (let i = 1; i < this.playerChargeAmmo+1; i ++) {

            this.context.fillStyle = "orange";
            this.context.fillRect(xStartAmmo*i, yStartAmmo, 15, 25);
            this.context.strokeStyle = "blue";
            this.context.strokeRect(xStartAmmo*i, yStartAmmo, 15, 25)
        }

        
        this.context.fillStyle = "white";
        this.context.fillRect(xStartShield, yStartShield, this.playerShieldPower, 25);

        
        this.context.font = "15px Monospace";
        this.context.fillText("Power", xStartHealth, yStartHealth - 5);
        this.context.fillText("Charge Ammo", xStartAmmo, yStartAmmo - 5);

        this.context.fillText("Shield", xStartShield, yStartShield - 5);

        this.context.fillText("Score: " + String(this.score), xStartShield, yStartShield + 50);

    }


    update() {

        
        // Update player position
        if (!this.playerDead) {
            this.playerX += this.playerVelX;
            this.playerY += this.playerVelY;
        }
        
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
       

        // Draw HUD
        this.drawHUD();


        



        // Draw codec

        if (this.codec) {

            this.context.fillStyle = 'red';
            this.context.fillRect(this.canvas.width- 165, 95, 190, 120)
            this.context.fillStyle = 'blue';
            this.context.fillRect(this.canvas.width- 160, 100, 180, 110)
            this.context.drawImage(this.doctorImage, this.canvas.width - 90, 100);
            this.context.fillStyle = 'white';
            this.context.font = "10px Monospace";
            this.context.fillText(this.codecMessages[0], this.canvas.width - 158, 115);
        }


        // Create bonuses

        if(this.bonuses.length == 0) {

            let x = Math.floor(Math.random()* this.canvas.width);
            let y = Math.floor(Math.random() * this.canvas.height);
            
            if(x >this.canvas.width - 100) {
                x = x-200;
            } else if (x < 100) {
                x = x + 200;
            }

            if (y < 100) {
                y = y + 200;
            } else if (y > this.canvas.height-100) {
                y = y - 200;
            }
            
            
            if ((Math.random()*10) > 5) {
                this.bonuses.push(new Bonus(this.canvas, this.context, this, x, y));
            } else {
                this.bonuses.push(new Ammo(this.canvas, this.context, this, x, y));
            }
            
            
        }


        // Draw bonuses
        this.bonuses.forEach((bonus) => {
            bonus.draw();
            bonus.update();
        })

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
            
            
            // Ensure only one attack image cycle
            if (this.attacking) {
                this.attacking = false;
                // After one attack image cycle ends, switch back to idle
                if (this.direction == 'left') {
                    this.playerImage = this.playerImageIdleLeft;
                } else {
                    this.playerImage = this.playerImageIdle;
                }
                
            } else if (this.playerMeleeAttack) {
                this.playerMeleeAttack = false;
                this.frameCount = 5;
                if (this.direction == 'left') {
                    this.playerImage = this.playerImageIdleLeft;
                } else {
                    this.playerImage = this.playerImageIdle;
                }
            } else if (this.playerHurt) {

                this.playerHurt = false;
                this.frameCount = 5;
                if (this.direction == 'left') {
                    this.playerImage = this.playerImageIdleLeft;
                } else {
                    this.playerImage = this.playerImageIdle;
                }
            }
            
            if (!this.playerDead) {

                this.currentPlayerFrame = 0;
            } else {
                
                this.currentPlayerFrame = 5
            }
        }


        // check whether shield is on
        if (this.playerShieldPower < 30) {
            this.playerShield = false;
        }
        

        // DRAW SHIELD
        if (this.playerShieldPower > 20) {
            if (this.playerShield) {
                this.context.strokeStyle = "white";
                this.context.beginPath();
                this.context.arc((this.playerX + 20), (this.playerY + 30), 75, 0, (2*Math.PI));
                this.context.stroke();
            } 
        } 

        // UPDATE SHIELD STRENGTH

        if (this.playerShieldDrain && this.playerShieldPower > 0) {
            this.playerShieldPower -= 1;
            
            
        } else {
            if(this.playerShieldPower < 100) {
                this.playerShieldPower += 0.5;
            }
        }
        


        
        // DRAW ATTACKS
        for (let i=0; i < this.attacks.length; i++) {
            let attack = this.attacks[i];
            attack.update();
            attack.draw();
        }
    


        // ENEMIES
        if (this.enemies.length <= 2) {
            let roll = Math.random()*10
            if(roll > 8) {
                console.log(this.enemies);
                this.enemies.push(new Enemy2(this.canvas, this.context, this))
            } else if (roll > 5) {
                console.log(this.enemies);
                this.enemies.push(new Enemy(this.canvas, this.context, this))
            } else if (roll > 3) {
                console.log(this.enemies);
                this.enemies.push(new Raider(this.canvas, this.context, this))
            } else {
                if(Math.random() >= 0.5) {
                    console.log(this.enemies);
                    this.enemies.push(new Drone(this.canvas, this.context, this, 'left'));
                } else {
                    console.log(this.enemies);
                    this.enemies.push(new Drone(this.canvas, this.context, this, 'right'));
                }
                
            }
            
            
        }

    
        // Draw enemies
        for (let i=0; i < this.enemies.length; i++) {
            let enemy = this.enemies[i];
            enemy.update();
            enemy.draw();
        }


        // Check for bonus collision
        for (let i = 0; i < this.bonuses.length; i++) {

            let bonus = this.bonuses[i];

            if (this.playerX <= bonus.x + 30
                && this.playerX >= bonus.x - 30
                && this.playerY >= bonus.y - 30
                && this.playerY <= bonus.y + 30                
                ) {
                    this.playSoundEffect('./Sounds/bonus.wav');
                    let bonus = this.bonuses.pop()
                    if (bonus instanceof Ammo && this.playerChargeAmmo<10) {
                        
                        this.playerChargeAmmo += 1;
                        
                    } else if (bonus instanceof Bonus && this.playerHealthBars<10) {
                        
                        this.playerHealthBars += 1;
                        this.playerHealth += 20;
                    }
                    
                }


        }


        // Ceck for bomb collision

        this.bombs.forEach((bomb) => {
            bomb.draw();
            bomb.update();
            if(bomb.y >= this.canvas.height - 50) {
                this.bombs.splice(this.bombs.indexOf(bomb), 1);
                
            }

            if(
                bomb.x >= this.playerX - 50 &&
                bomb.x <= this.playerX + 50 &&
                bomb.y >= this.playerY - 50 &&
                bomb.y <= this.playerY + 50
            ) {

                if(this.playerShield) {
                    this.bombs.splice(this.bombs.indexOf(bomb), 1);
                }
                else {
                    this.bombs.splice(this.bombs.indexOf(bomb), 1);
                    this.playerHealth -= 20;
                    this.playerHealthBars -= 1;
                }
               
               
            }

        })

         // Check for blast collision and melee collision
         for (let i = 0; i < this.attacks.length; i++){

            let attack = this.attacks[i];


            if (this.playerShield) {

                if (
                    attack.x <= this.playerX + 75
                    && attack.x >= this.playerX - 75
                    && attack.y >= this.playerY - 75
                    && attack.y <= this.playerY + 75
                ) {                
                    this.attacks.splice(i, 1);
                }


            } else if (
                attack.x <= this.playerX + 5
            && attack.x >= this.playerX - 5
            && attack.y >= this.playerY + 5
            && attack.y <= this.playerY + this.spriteHeight
            && !this.playerDead
            ) {
               
                this.playerImage = this.playerImageHurt;
                this.playerHurt = true;
                this.frameCount = 3;
                this.playerHealth -= 20;
                this.playerHealthBars -= 1;
                
            }


            for (let j = 0; j < this.enemies.length; j++) {
                let enemy = this.enemies[j];
                if (   attack.x <= enemy.x + 5
                    && attack.x >= enemy.x - 5
                    && attack.y >= enemy.y + 5
                    && attack.y <= enemy.y + this.spriteHeight
                    ) {
                    
                        enemy.image = enemy.imageHurt;
                        enemy.frameCount = 1;
                        enemy.frameCap = 2;
                        enemy.xVel = 0;
                        this.attacks.splice(i, 1);
                        if (attack instanceof Charge) {
                            enemy.health -= 100
                        }
                        else if (attack instanceof Blast) {
                            enemy.health -= 20;
                        }
                        
                        
                        
                        // Check for melee collision
                    } else if (enemy.x <= this.playerX + 50
                        && enemy.x >= this.playerX
                        && enemy.y >= this.playerY
                        && enemy.y <= this.playerY + this.spriteHeight
                        && this.playerMeleeAttack                       
                        ) {
                            enemy.image = enemy.imageHurt;
                            enemy.frameCount = 1;
                            enemy.frameCap = 2;
                            enemy.xVel = 0;
                            enemy.health -= 20;
                        }

            }
            
        }

        // Check for codec message

        if ((this.score%100 == 0) && this.score != 0) {
            this.codec = true;
        } else {
            this.codec = false;
        }


        // Check for level end

        if (this.score >= 200) {

            this.win = true;
            this.context.fillStyle = 'lightgreen';
            this.context.font = "30px Monospace";
            this.context.fillText("Mission Success!", this.canvas.width/2 - 100, this.canvas.height/2)
            
        }

        
        // // Check for player death
        if (this.playerDead) {
            this.context.fillStyle = 'lightgreen';
            this.context.font = "30px Monospace";
            this.context.fillText("Mission Failed", this.canvas.width/2 - 100, this.canvas.height/2)
            
            // change image
            if(this.playerImage != this.playerImageDead) {
                this.playerImage = this.playerImageDead;
                // this.currentPlayerFrame = 0;
                this.playerFrameWidth = 92;
                this.frameCount = 2;
                this.spriteWidth = 110
                   
            }
            
        }
        

        if (this.playerHealth <= 0) {
            this.playerDead = true;
        }

        // Schedule next frame update
        if (!this.win) {
            requestAnimationFrame(this.update.bind(this));
        }
        
    }

}


const game = new Game(ctx, canvas);
game.update();