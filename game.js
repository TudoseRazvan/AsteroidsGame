const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let spaceship = { x: canvas.width / 2, y: canvas.height / 2, angle: 0, lives: 3, score: 0, radius: 15 }; 
let asteroids = [];
let rockets = [];
let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
const maxRockets = 3;
const pointsToGainLife = 100;
let canShoot = true;  

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function drawTriangle(x, y, angle, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, -15);
  ctx.lineTo(10, 15);
  ctx.lineTo(-10, 15);
  ctx.closePath();
  ctx.shadowBlur = 10;
  ctx.shadowColor = 'cyan'; 
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function drawCircle(x, y, radius, color) {
  const gradient = ctx.createRadialGradient(x, y, radius * 0.3, x, y, radius);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(1, color);

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.shadowBlur = 15;
  ctx.shadowColor = color; 
  ctx.fill();
  ctx.closePath();
}

function drawText(text, x, y, color = 'white', font = '20px Arial') {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.shadowBlur = 5;
  ctx.shadowColor = 'black';
  ctx.fillText(text, x, y);
}

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, 'black');
  gradient.addColorStop(1, '#001f3f'); 

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawRocket(rocket) {
  const trailGradient = ctx.createRadialGradient(rocket.x, rocket.y, 2, rocket.x, rocket.y, 10);
  trailGradient.addColorStop(0, 'rgba(255, 100, 100, 1)');
  trailGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

  ctx.beginPath();
  ctx.arc(rocket.x, rocket.y, rocket.radius, 0, Math.PI * 2);
  ctx.fillStyle = trailGradient;
  ctx.fill();
  ctx.closePath();
}


function detectCollision(obj1, obj2) {
  const dx = obj1.x - obj2.x;
  const dy = obj1.y - obj2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < obj1.radius + obj2.radius; 
}

function spawnAsteroid() { 
  const hits = Math.floor(random(1, 5)); 
  const radius = random(20, 50); 
  const speed = random(0.5, 2); 
  let color = '';

  switch (hits) {
    case 1:
      color = 'rgb(255, 50, 50)'; 
      break;
    case 2:
      color = 'rgb(50, 255, 50)'; 
      break;
    case 3:
      color = 'rgb(50, 50, 255)'; 
      break;
    case 4:
      color = 'rgb(250, 103, 34)'; 
      break;
  }

  const asteroid = {
    x: Math.random() > 0.5 ? 0 : canvas.width,
    y: random(0, canvas.height),
    dx: random(-1, 1) * speed || 0.5, 
    dy: random(-1, 1) * speed || 0.5, 
    radius,
    hits,
    color
  };
  
  asteroids.push(asteroid);

  if (asteroids.length > 5) asteroids.shift();
}


let rocketCooldown = false;  
let rocketLaunchCount = 0;   
let lastRocketTime = 0;      

function shootRocket() {
  if (rocketCooldown || rockets.length >= maxRockets) return;

  const currentTime = Date.now();

  if (currentTime - lastRocketTime > 1000) {
    rocketLaunchCount = 0;
  }

  if (rocketLaunchCount >= maxRockets - 1) {
    rocketCooldown = true;
    setTimeout(() => {
      rocketCooldown = false;
    }, 1000);
    rocketLaunchCount = 0;
  }

  const rocket = {
    x: spaceship.x,
    y: spaceship.y,
    dx: Math.cos(spaceship.angle - Math.PI / 2) * 5,
    dy: Math.sin(spaceship.angle - Math.PI / 2) * 5,
    radius: 5
  };
  rockets.push(rocket);

  lastRocketTime = currentTime;
  rocketLaunchCount++;
}


function detectAsteroidCollision(asteroid1, asteroid2) {
  const dx = asteroid1.x - asteroid2.x;
  const dy = asteroid1.y - asteroid2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < asteroid1.radius + asteroid2.radius;
}

function handleAsteroidCollision(asteroid1, asteroid2) {
  const dx = asteroid2.x - asteroid1.x;
  const dy = asteroid2.y - asteroid1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const overlap = asteroid1.radius + asteroid2.radius - distance;
  const correctionX = (dx / distance) * overlap / 2;
  const correctionY = (dy / distance) * overlap / 2;

  asteroid1.x -= correctionX;
  asteroid1.y -= correctionY;
  asteroid2.x += correctionX;
  asteroid2.y += correctionY;

  const angle = Math.atan2(dy, dx);
  const speed1 = Math.sqrt(asteroid1.dx ** 2 + asteroid1.dy ** 2);
  const speed2 = Math.sqrt(asteroid2.dx ** 2 + asteroid2.dy ** 2);

  const direction1 = Math.atan2(asteroid1.dy, asteroid1.dx);
  const direction2 = Math.atan2(asteroid2.dy, asteroid2.dx);

  const velocityX1 = speed1 * Math.cos(direction1 - angle);
  const velocityY1 = speed1 * Math.sin(direction1 - angle);
  const velocityX2 = speed2 * Math.cos(direction2 - angle);
  const velocityY2 = speed2 * Math.sin(direction2 - angle);

  const finalVelocityX1 = velocityX2;
  const finalVelocityX2 = velocityX1;

  asteroid1.dx = Math.cos(angle) * finalVelocityX1 + Math.cos(angle + Math.PI / 2) * velocityY1;
  asteroid1.dy = Math.sin(angle) * finalVelocityX1 + Math.sin(angle + Math.PI / 2) * velocityY1;
  asteroid2.dx = Math.cos(angle) * finalVelocityX2 + Math.cos(angle + Math.PI / 2) * velocityY2;
  asteroid2.dy = Math.sin(angle) * finalVelocityX2 + Math.sin(angle + Math.PI / 2) * velocityY2;
}

function updateAsteroids() {
  for (let i = 0; i < asteroids.length; i++) {
    const asteroid1 = asteroids[i];

    asteroid1.x += asteroid1.dx;
    asteroid1.y += asteroid1.dy;

    if (asteroid1.x < 0) asteroid1.x = canvas.width;
    if (asteroid1.x > canvas.width) asteroid1.x = 0;
    if (asteroid1.y < 0) asteroid1.y = canvas.height;
    if (asteroid1.y > canvas.height) asteroid1.y = 0;

    for (let j = i + 1; j < asteroids.length; j++) {
      const asteroid2 = asteroids[j];

      if (detectAsteroidCollision(asteroid1, asteroid2)) {
        handleAsteroidCollision(asteroid1, asteroid2);
      }
    }
  }
}

function updateGameObjects() {
  updateAsteroids();
  
  rockets.forEach((rocket, index) => {
    rocket.x += rocket.dx;
    rocket.y += rocket.dy;

    if (
      rocket.x < 0 ||
      rocket.x > canvas.width ||
      rocket.y < 0 ||
      rocket.y > canvas.height
    ) {
      rockets.splice(index, 1);
    }
  });

  rockets.forEach((rocket, rIndex) => {
    asteroids.forEach((asteroid, aIndex) => {
      if (detectCollision(rocket, asteroid)) {
        rockets.splice(rIndex, 1);
        asteroid.hits -= 1;
        if (asteroid.hits <= 0) {
          asteroids.splice(aIndex, 1);
          spaceship.score += 10;

          if (spaceship.score % pointsToGainLife === 0) {
            spaceship.lives += 1;
          }
        }
      }
    });
  });

  asteroids.forEach((asteroid) => {
    if (detectCollision(spaceship, asteroid)) {
      spaceship.lives -= 1;
      if (spaceship.lives <= 0) {
        endGame();
      } else {
        resetGame();
      }
    }
  });
}



function endGame() {
  highScores.push({ name: prompt('Enter your name:'), score: spaceship.score });
  highScores.sort((a, b) => b.score - a.score);
  highScores = highScores.slice(0, 5);
  localStorage.setItem('highScores', JSON.stringify(highScores));
  alert('Game Over!');
  resetGame(true);
}

function resetGame(fullReset = false) {
  if (fullReset) {
    spaceship = { x: canvas.width / 2, y: canvas.height / 2, angle: 0, lives: 3, score: 0, radius: 15 };
  }
  asteroids = [];
  rockets = [];
}

function draw() {
  drawBackground(); 
  drawTriangle(spaceship.x, spaceship.y, spaceship.angle, 'white'); 

  asteroids.forEach((asteroid) => {
    drawCircle(asteroid.x, asteroid.y, asteroid.radius, asteroid.color);
    drawText(asteroid.hits, asteroid.x - 5, asteroid.y + 5, 'white', '18px Arial');
  });

  rockets.forEach((rocket) => {
    drawRocket(rocket);
  });

  drawText(`Lives: ${spaceship.lives}`, 10, 20, 'lime', 'bold 24px Arial');
  drawText(`Score: ${spaceship.score}`, 10, 50, 'yellow', 'bold 24px Arial');
}


function gameLoop() {
  updateGameObjects();
  draw();
  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      spaceship.y -= 5;  
      break;
    case 'ArrowDown':
      spaceship.y += 5;  
      break;
    case 'ArrowLeft':
      spaceship.x -= 5;  
      break;
    case 'ArrowRight':
      spaceship.x += 5;  
      break;
    case 'z':  
      spaceship.angle -= Math.PI / 10;
      break;
    case 'c':  
      spaceship.angle += Math.PI / 10;
      break;
    case 'x':  
      shootRocket();
      break;
  }
});

document.addEventListener('mousemove', (e) => {
  const mouseX = e.clientX - canvas.offsetLeft; 
  const mouseY = e.clientY - canvas.offsetTop;  

  const deltaX = mouseX - spaceship.x;  
  const deltaY = mouseY - spaceship.y;  

  const angle = Math.atan2(deltaY, deltaX);
  spaceship.angle = angle + Math.PI / 2;  
});

function updateHighScores() {
  const highScoresList = document.getElementById('highScoresList');
  
  highScoresList.innerHTML = '';

  highScores.forEach((score, index) => {
    const scoreItem = document.createElement('li');
    scoreItem.textContent = `${score.name}: ${score.score}`;
    highScoresList.appendChild(scoreItem);
  });
}

updateHighScores();

setInterval(spawnAsteroid, 3500); 

gameLoop();
