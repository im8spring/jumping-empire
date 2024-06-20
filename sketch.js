let dino;
let obstacles = [];
let score = 0;
let gameOverFlag = false;

let dinoSprites = [];
let currentSpriteIndex = 0;
let spriteUpdateInterval = 5;

let jumpImage;
let titleImage;
let rdrImage;
let profImage;
let overImage;

const GAME_WIDTH = 1200;
const GAME_HEIGHT = 300;
const GAME_X_OFFSET = 50;
const GAME_Y_OFFSET = 200;

function preload() {
  for (let i = 0; i <= 6; i++) {
    dinoSprites.push(loadImage(`assets/image_${i}.png`));
  }
  jumpImage = loadImage('assets/jump.png');
  titleImage = loadImage('assets/title.png');
  rdrImage = loadImage('assets/rdr.gif');
  profImage = loadImage('assets/prof.png');
  overImage = loadImage('assets/over.png');
}

function setup() {
  createCanvas(1300, 800);
  dino = new Dino();
  obstacles.push(new Obstacle());

  rdrImageElement = createImg('assets/rdr.gif');
  rdrImageElement.position((width - rdrImageElement.width / 2) / 2, height - rdrImageElement.height - 250);
  rdrImageElement.style('width', '20%');
  rdrImageElement.style('height', 'auto');

  profImageElement = createImg('assets/prof.png');
  let profWidth = profImage.width * 0.3;
  let profHeight = profImage.height * 0.3;
  profImageElement.position((GAME_WIDTH - profWidth) / 0.9, GAME_HEIGHT + 250);
  profImageElement.style('width', `${profWidth}px`);
  profImageElement.style('height', `${profHeight}px`);
}

function draw() {
  background(0, 51, 0);
  push();
  translate(GAME_X_OFFSET, GAME_Y_OFFSET);

  let titleWidth = titleImage.width * 0.3;
  let titleHeight = titleImage.height * 0.3;
  image(titleImage, (GAME_WIDTH - titleWidth) / 2, -titleHeight - 10, titleWidth, titleHeight);

  fill(51, 0, 0);
  rect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  if (!gameOverFlag) {
    displayScore();
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
    // 게임 오버 이미지 전체 화면에 출력
    image(overImage, 0, 0, width, height);
    textSize(40);
    textAlign(CENTER, CENTER);
    fill(255);
    text('Press Space to Restart', width / 2, height / 2 + overImage.height / 2 + 20);
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

function displayScore() {
  textSize(40);
  fill(255);
  text(`Score: ${score}`, 20, 50);
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
    if (
      dino.x + 100 > this.x &&
      dino.x < this.x + this.width &&
      dino.y + 100 > this.y
    ) {
      gameOver();
      return true;
    }
    return false;
  }
}
