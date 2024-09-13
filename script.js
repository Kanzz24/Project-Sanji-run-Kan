// Default, Player
let board;
let boardWidth = 1000;
let boardHeight = 300;
let context;
let playerWidth = 100 ;
let playerHeight = 95;
let playerX = 60;
let playerY = 210;
let playerImg;
let player = {
    x: playerX,
    y: playerY,
    width: playerWidth,
    height: playerHeight
};
let gameOver = false;
let score = 0;
let time = 0;
let live = 3;

// Object
let boxImg;
let boxWidth = 85;
let boxHeight = 85;
let boxX = 1000;
let boxY = 225;

// Setting Object
let boxesArray = [];
let boxSpeed = -8;

// Gravity, Velocity
let VelocityY = 0;
let Gravity = 0.25;

let Retry = document.getElementById("RetryButton");

console.log(player);
window.onload = function () {
    // Display
    board = document.getElementById("Board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    
    playerImg = new Image();
    playerImg.src = "main2.png";
    playerImg.onload = function () {
        context.drawImage(playerImg, player.x, player.y, player.width, player.height);
    };

    // Request animation frame
    requestAnimationFrame(update);

    document.addEventListener("keydown", movePlayer);
    Retry.addEventListener("click", gameReset);

    boxImg = new Image();
    boxImg.src = "a5.png";//TODO
    
    createBoxWithRandomInterval();
};

// Function to create a box at a random time interval
function createBoxWithRandomInterval() {
    setTimeout("", 2);
    if (gameOver) {
        return;
    }

    createBox(); // Create a box

    // Generate a random time between 1 and 3 seconds (1000 to 3000 milliseconds)
    let randomTime = rnd(1000, 2500);

    // Use setTimeout instead of setInterval to create boxes at random times
    setTimeout(createBoxWithRandomInterval, randomTime);
}
// Function to create a box at a random time interval
function createBoxWithRandomInterval() {
    if (gameOver) return;

    createBox(); // Create a box

    let randomTime = rnd(1000, 2500);
    setTimeout(createBoxWithRandomInterval, randomTime);
}

// Function to create a cloud at a random time interval
function createCloudWithRandomInterval() {
    if (gameOver) return;

    createCloud(); // Create a cloud

    let randomTime = rnd(3000, 5000); // Adjust timing if needed
    setTimeout(createCloudWithRandomInterval, randomTime);
}
function rnd(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
}

// Update Function
function update() {
    requestAnimationFrame(update); // Always update animation

    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);
    VelocityY += Gravity;

    player.y = Math.min(player.y + VelocityY, playerY);
    context.drawImage(playerImg, player.x, player.y, player.width, player.height);

    for (let index = 0; index < boxesArray.length; index++) {
        let box = boxesArray[index];
        box.x += boxSpeed;
        context.drawImage(box.img, box.x, box.y, box.width, box.height);

        if (onCollision(player, box)) {
            gameOver = true;
            live -= 1;

            context.font = "normal bold 37px Arial";
            context.textAlign = "center";
            context.fillStyle = "#b0120a";
            context.fillText("GameOver!", boardWidth / 2, boardHeight / 2);
            context.fillText("Your Score : "+score,boardWidth/2 ,(boardHeight/2)+50);


            setTimeout(() => {
                Retry.style.display = "block";
            }, 500);
        }
    }
    score++;
    time += 0.01;
    context.font = "normal bold 35 px Arial";
    context.textAlign = "left";
    context.fillStyle = "#212121";
    context.fillText("Score : " + score, 750 , 30);
    context.fillText("Time : " + time.toFixed(1 ), 20, 30);
    context.fillText("Live  : " + live, 20, 65);
    if (time >= 60) {
        gameOver = true;
        context.font = "normal bold 40px Arial";
        context.textAlign = "center";
        context.fillText("You Won! With Score :" + score, boardWidth / 2, boardHeight / 2);
        



        setTimeout(() => {
            Retry.style.display = "block";
        }, 500);
    }
}

function movePlayer(e) {
    if (gameOver) {
        return;
    }

    if (e.code === "Space" && player.y === playerY) {
        VelocityY = -10;
    }
}

function createBox(e) {
    if (gameOver) {
        return;
    }

    let box = {
        img: boxImg,
        x: boxX,
        y: boxY,
        width: boxWidth,
        height: boxHeight
    };

    boxesArray.push(box);

    if (boxesArray.length > 5) {
        boxesArray.shift();
    }
}

function onCollision(obj1, obj2) {
    return obj1.x < (obj2.x + obj2.width) && (obj1.x + obj1.width) > obj2.x 
        && obj1.y < (obj2.y + obj2.height) && (obj1.y + obj1.height) > obj2.y; 
}

function gameReset() {
    if (!gameOver) {
        return;
    }

    if (live > 0) {
        gameOver = false;
        Retry.style.display = "none"; 
         

        score = 0;
        time = 0;
        boxesArray = [];
        VelocityY = 0; 
        player.y = playerY; 

        createBoxWithRandomInterval(); 
    }
}
