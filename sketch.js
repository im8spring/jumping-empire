let dino;
let obstacles = [];
let score = 0;
let gameOverFlag = false;

let dinoSprites = [];
let currentSpriteIndex = 0;
let spriteUpdateInterval = 5;

let jumpImage;

const GAME_WIDTH = 1200;
const GAME_HEIGHT = 300;
const GAME_X_OFFSET = 50;
const GAME_Y_OFFSET = 200;

function preload() {
  for (let i = 0; i <= 6; i++) {
    dinoSprites.push(loadImage('assets/image_' + i + '.png'));
  }
  jumpImage = loadImage('assets/jump.png');
}

function setup() {
  createCanvas(1300, 1000); // 캔버스를 더 크게 만듦
  dino = new Dino();
  obstacles.push(new Obstacle());
}

function draw() {
  background(000,051,000);
  
  // 게임 영역을 설정
  push();
  translate(GAME_X_OFFSET, GAME_Y_OFFSET);
  stroke(255);
  noFill();
  fill(051,000,000)
  rect(0, 0, GAME_WIDTH, GAME_HEIGHT); // 게임 영역을 나타내는 사각형
  
  if (!gameOverFlag) {
    textSize(40);
    fill(255);
    text('Score: ' + score, 20, 50);

    dino.update();
    dino.show();

    if (frameCount % 60 === 0) {
      obstacles.push(new Obstacle());
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
      obstacles[i].update();
      obstacles[i].show();

      if (obstacles[i].hits(dino)) {
        gameOver();
      }

      if (obstacles[i].offscreen()) {
        obstacles.splice(i, 1);
        score++;
      }
    }

    if (frameCount % spriteUpdateInterval === 0) {
      currentSpriteIndex = (currentSpriteIndex + 1) % dinoSprites.length;
    }
  } else {
    textSize(64);
    textAlign(CENTER, CENTER);
    fill(255, 0, 0);
    text('Game Over', GAME_WIDTH / 2, GAME_HEIGHT / 2);
    textSize(40);
    text('Press Space to Restart', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50);
  }

  pop();
}

function keyPressed() {
  if (key === ' ') {
    if (gameOverFlag) {
      resetGame();
    } else {
      dino.jump();
    }
  }
}

function gameOver() {
  noLoop();
  gameOverFlag = true;
  console.log('Game Over');
}

function resetGame() {
  score = 0;
  obstacles = [];
  gameOverFlag = false;
  dino = new Dino();
  loop();
}

class Dino {
  constructor() {
    this.x = 100;
    this.y = GAME_HEIGHT - 100;
    this.velocityY = 0;
    this.gravity = 2;
    this.isJumping = false;
  }

  jump() {
    if (!this.isJumping) {
      this.velocityY = -35;
      this.isJumping = true;
    }
  }

  update() {
    this.velocityY += this.gravity;
    this.y += this.velocityY;

    if (this.y >= GAME_HEIGHT - 100) {
      this.y = GAME_HEIGHT - 100;
      this.velocityY = 0;
      this.isJumping = false;
    }
  }

  show() {
    if (this.isJumping) {
      image(jumpImage, this.x, this.y, 100, 100);
    } else {
      image(dinoSprites[currentSpriteIndex], this.x, this.y, 100, 100);
    }
  }
}

class Obstacle {
  constructor() {
    this.x = GAME_WIDTH;
    this.y = GAME_HEIGHT - 80;
    this.width = 60;
    this.height = 40;
    this.speed = 9;
    this.img = loadImage('assets/craft.png');
  }

  update() {
    this.x -= this.speed;
  }

  show() {
    image(this.img, this.x, this.y, this.width, this.height);
  }

  offscreen() {
    return this.x + this.width < 0;
  }

  hits(dino) {
    return (
      dino.x + 100 > this.x &&
      dino.x < this.x + this.width &&
      dino.y + 100 > this.y
    );
  }
}
