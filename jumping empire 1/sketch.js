let dino;
let obstacles = [];
let score = 0;
let gameOverFlag = false;

let dinoSprites = [];
let currentSpriteIndex = 0;
let spriteUpdateInterval = 5; // 이미지 업데이트 간격 설정

let jumpImage; // 점프 이미지를 저장할 변수

function preload() {
  for (let i = 0; i <= 6; i++) {
    dinoSprites.push(loadImage('assets/image_' + i + '.png'));
  }
  jumpImage = loadImage('assets/jump.png'); // 점프 이미지를 미리 로드
}

function setup() {
  createCanvas(1200, 300); // 캔버스 크기를 2배로 확대
  dino = new Dino();
  obstacles.push(new Obstacle());
}

function draw() {
  background(220);

  if (!gameOverFlag) {
    // Display score
    textSize(40); // 글꼴 크기를 크게 변경
    text('Score: ' + score, 20, 50); // 위치를 조금 이동
    
    // Update and display the dino
    dino.update();
    dino.show();
    
    // Create new obstacles
    if (frameCount % 60 === 0) {
      obstacles.push(new Obstacle());
    }
    
    // Update and display obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
      obstacles[i].update();
      obstacles[i].show();
      
      // Check for collision with dino
      if (obstacles[i].hits(dino)) {
        gameOver();
      }
      
      // Remove offscreen obstacles
      if (obstacles[i].offscreen()) {
        obstacles.splice(i, 1);
        score++;
      }
    }
    
    // Update dino sprite animation
    if (frameCount % spriteUpdateInterval === 0) {
      currentSpriteIndex = (currentSpriteIndex + 1) % dinoSprites.length;
    }
  } else {
    // Display game over message
    textSize(64); // 글꼴 크기를 크게 변경
    textAlign(CENTER, CENTER);
    fill(255, 0, 0);
    text('Game Over', width / 2, height / 2);
    textSize(40); // 글꼴 크기를 크게 변경
    text('Press Space to Restart', width / 2, height / 2 + 50); // 위치를 조금 이동
  }
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
    this.y = height - 100; // 조금 위로 이동
    this.velocityY = 0;
    this.gravity = 2; // 중력을 강화
    this.isJumping = false;
  }
  
  jump() {
    if (!this.isJumping) {
      this.velocityY = -35; // 점프 강도를 강화
      this.isJumping = true;
    }
  }
  
  update() {
    this.velocityY += this.gravity;
    this.y += this.velocityY;
    
    if (this.y >= height - 100) {
      this.y = height - 100;
      this.velocityY = 0;
      this.isJumping = false;
    }
  }
  
  show() {
    if (this.isJumping) { // 점프 중인 경우 jumpImage 표시
      image(jumpImage, this.x, this.y, 100, 100); // 크기를 2배로 확대
    } else { // 그 외의 경우 dinoSprites 표시
      image(dinoSprites[currentSpriteIndex], this.x, this.y, 100, 100); // 크기를 2배로 확대
    }
  }
}

class Obstacle {
  constructor() {
    this.x = width;
    this.y = height - 80; // 조금 위로 이동
    this.width = 60; // 장애물의 너비를 크게 변경
    this.height = 40; // 장애물의 높이를 크게 변경
    this.speed = 9; // 속도를 빠르게 변경
    this.img = loadImage('assets/craft.png'); // craft.png 이미지를 불러옴
  }
  
  update() {
    this.x -= this.speed;
  }
  
  show() {
    image(this.img, this.x, this.y, this.width, this.height); // 이미지로 장애물 표시
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