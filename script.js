const canvas = document.getElementById("canvas");
const btnStart = document.getElementById("start-button");
const btnRestart = document.getElementById("restart");
const ctx = canvas.getContext("2d");
canvas.width=document.documentElement.clientWidth * 0.99;
canvas.height=document.documentElement.clientHeight * 0.98;


const houseImg = new Image();
houseImg.src = "./img/peppahouse.jpg";

const peppaImg = new Image();
peppaImg.src = "./img/peppa.png";


let img1 =  new Image();
img1.src = "./img/ball1.png";
let img2 = new Image();
img2.src = "./img/dinossauro1.png";
let img3 = new Image();
img3.src = "./img/icecream1.png";
const imagens = [img1,img2,img3];


const crashAudio = new Audio();
crashAudio.src = "./sounds/crash.mp3";
crashAudio.volume = 0.5; 

const hitAudio = new Audio();
hitAudio.src = "./sounds/obshit.mp3"
hitAudio.volume = 0.5;

const failAudio = new Audio();
failAudio.src = "./sounds/fail.mp3"
failAudio.volume = 0.5;


class Component {
  constructor(x, y, width, height, speed, img) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.img = img;
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
     
    draw() {       
        
         ctx.drawImage(this.img, this.x, this.y, this.width, this.height);     
        
      
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
      this.drop = 0;
    }
  
    updateGame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      this.background.move();
      this.background.draw();
  
      this.player.move();
      this.player.draw();
  
      this.updateObstacles();
  
      this.updateScore(this.score);
      this.updateDropped();
  
      this.animationId = requestAnimationFrame(this.updateGame);
  
      this.checkGameOver();
    };
  
    updateObstacles = () => {
      this.frames++;
  
     
  
      this.obstacles.map((obstacle) => {
        obstacle.move();
        obstacle.draw();
      });
  
      if (this.frames % 75 === 0) {
        let y = 0;
        const numberRan = Math.floor(Math.random() * imagens.length);
        let minWidth = 80;
        let maxWidth = 80;
        let width = Math.floor(
          Math.random() * (maxWidth - minWidth + 1) + minWidth
        );
  
        let minX = 40;
        let maxX = canvas.width - 40 - width;
        let x = Math.floor(Math.random() * (maxX - minX + 1) + minX); 
  
        const obstacle = new Obstacle(x, y, 70, 70, 3, imagens[numberRan]);
  
        this.obstacles.push(obstacle);
      }
    }; 
  
    checkGameOver = () => {
    let obsIndex;
      const crashed = this.obstacles.some((obstacle, i) => {


          if(obstacle.y > canvas.height ) {
            this.obstacles.splice(i, 1);
              this.drop++; 
              failAudio.play();                   
          }
          
          if(this.player.isCrashedWith(obstacle)){
            obsIndex = i;
            hitAudio.play();
          }
         return this.player.isCrashedWith(obstacle);
      });
  
      if (crashed) {
            this.obstacles.splice(obsIndex, 1);
            this.score++;
           
      }
           
      if(this.drop > 4) {
        cancelAnimationFrame(this.animationId);
  
        crashAudio.play();
  
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "50px Verdana";
        ctx.fillStyle = "pink";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "red";
        ctx.fillText("Game Over!", canvas.width / 2.5, 200);
        ctx.fillStyle = "white";
        ctx.fillText(`  Your Final Score: ${this.score}`, canvas.width / 3, 400);
        
        
          startGame();
          };
        
      
      
      console.log(this.caiu);
      
         
    }; 
  
    updateScore = (score) => {
      ctx.font = "30px Verdana";
      ctx.fillStyle = "pink";
  
      ctx.fillText(`SCORE ${this.score}`, 80, 40);
    };

    updateDropped = () => {
        ctx.font = "30px Verdana";
        ctx.fillStyle = "pink";
    
        ctx.fillText(`DROPPED ${this.drop}`, 1400, 40);
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
  
      if (this.x >= canvas.width - 200) {
        this.x = canvas.width - 200;
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
       
       btnStart.parentElement.style.display = "none"; 
       //btnRestart.parentElement.style.display = "none"      
       canvas.style.display = "block";

      const game = new Game(
        new Background(0, 0, canvas.width, canvas.height),
        new Player(canvas.width / 2 - 25, canvas.height - 150, 120, 120, 0)
      );
  
      game.updateGame();
  
      document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
          game.player.speed = -6;
        }
  
        if (event.key === "ArrowRight") {
          game.player.speed = 6;
        }
      });
  
      document.addEventListener("keyup", () => {
        game.player.speed = 0;
      });
    }
  };