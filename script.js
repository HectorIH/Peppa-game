const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const houseImg = new Image();
houseImg.src = "./img/peppahouse.jpg";

const peppaImg = new Image();
peppaImg.src = "./img/peppa.png";

const obsImg = new Image();
obsImg.src = "./img/ball1.png";



const crashAudio = new Audio();
crashAudio.src = "./sounds/crash.mp3";
crashAudio.volume = 0.5; 

class Component {
  constructor(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
  }

  left() {
    return this.x;
  }

  right() {
    return this.x + this.width;
  }

  top() {
    return this.y;
  }

  bottom() {
    return this.y + this.height;
  }

  isCrashedWith(obstacle) {
    const condition = !(
      this.bottom() < obstacle.top() ||
      this.top() > obstacle.bottom() ||
      this.right() < obstacle.left() ||
      this.left() > obstacle.right()
    );

    return condition;
  }
}

class Obstacle extends Component {
    move() {
      this.y += this.speed;
    }
      // colocar as imagens randomicamente aqui.
    draw() {
      
       ctx.drawImage(obsImg, this.x, this.y, this.width, this.height);     
    
      


    }
  }
  
  class Game {
    constructor(background, player) {
      this.background = background;
      this.player = player;
      this.animationId;
      this.frames = 0;
      this.score = 0;
      this.obstacles = [];
    }
  
    updateGame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      this.background.move();
      this.background.draw();
  
      this.player.move();
      this.player.draw();
  
      this.updateObstacles();
  
      this.updateScore(this.score);
  
      this.animationId = requestAnimationFrame(this.updateGame);
  
      this.checkGameOver();
    };
  
    updateObstacles = () => {
      this.frames++;
  
      if (this.frames % 30 === 0) {
        this.score++;
      }
  
      this.obstacles.map((obstacle) => {
        obstacle.move();
        obstacle.draw();
      });
  
      if (this.frames % 45 === 0) {
        let y = 0;
  
        let minWidth = 80;
        let maxWidth = 80;
        let width = Math.floor(
          Math.random() * (maxWidth - minWidth + 1) + minWidth
        );
  
        let minX = 40;
        let maxX = canvas.width - 40 - width;
        let x = Math.floor(Math.random() * (maxX - minX + 1) + minX); 
  
        const obstacle = new Obstacle(x, y, 40, 40, 5);
  
        this.obstacles.push(obstacle);
      }
    }; 
  
    checkGameOver = () => {
      const crashed = this.obstacles.some((obstacle) => {
        return this.player.isCrashedWith(obstacle);
      });
  
      if (crashed) {
        cancelAnimationFrame(this.animationId);
  
        crashAudio.play();
  
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "40px Arial";
        ctx.fillStyle = "pink";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "red";
        ctx.fillText("Game Over!", canvas.width / 4, 200);
        ctx.fillStyle = "white";
        ctx.fillText(`Your Final Score: ${this.score}`, canvas.width / 6, 400);
      }
    };
  
    updateScore = (score) => {
      ctx.font = "20px Arial";
      ctx.fillStyle = "pink";
  
      ctx.fillText(`Score ${this.score}`, 70, 20);
    };
  }
  
  class Background {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.speed = 0;
    }
  
    move() {
      this.y += this.speed;
  
      if (this.y >= canvas.height) {
        this.y = 0;
      }
    } 
       
    draw() {
      ctx.drawImage(houseImg, this.x, this.y, this.width, this.height);
  
      if (this.speed >= 0) {
        ctx.drawImage(
          houseImg,
          this.x,
          this.y - canvas.height,
          this.width,
          this.height
        );
      }
    }
  } 
  
  class Player extends Component {
    move() {
      this.x += this.speed;
  
      if (this.x <= 40) {
        this.x = 40;
      }
  
      if (this.x >= canvas.width - 100) {
        this.x = canvas.width - 100;
      }
    }
  
    draw() {
      ctx.drawImage(peppaImg, this.x, this.y, this.width, this.height);
    }
  }
  
  window.onload = () => {
    document.getElementById("start-button").onclick = () => {
      startGame();
    };
  
    function startGame() {

    

      const game = new Game(
        new Background(0, 0, canvas.width, canvas.height),
        new Player(canvas.width / 2 - 25, canvas.height - 150, 50, 100, 0)
      );
  
      game.updateGame();
  
      document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
          game.player.speed = -4;
        }
  
        if (event.key === "ArrowRight") {
          game.player.speed = 4;
        }
      });
  
      document.addEventListener("keyup", () => {
        game.player.speed = 0;
      });
    }
  };