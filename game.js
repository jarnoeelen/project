const canvas = document.getElementById('flappyCanvas');
const scoreEl = document.getElementById('score');
const messageEl = document.getElementById('gameMessage');
const startBtn = document.getElementById('startGameBtn');
const restartBtn = document.getElementById('restartGameBtn');

if (canvas && scoreEl && messageEl && startBtn && restartBtn) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const birdImg = new Image();
  birdImg.src = 'images/peace.png';
  const sfxFlap = new Audio('audio/button.mp3');
  const sfxLose = new Audio('audio/loser.mp3');
  const bird = {
    x: 86,
    y: height / 2,
    radius: 14,
    velocity: 0,
  };
  const gravity = 0.45;
  const flapStrength = -7.5;
  const pipeWidth = 58;
  const pipeGap = 145;
  const pipeSpeed = 2.2;
  let pipes = [];
  let score = 0;
  let bestScore = 0;
  let running = false;
  let gameOver = false;
  let spawnTimer = 0;
  let lastTimestamp = 0;

  function resetGame() {
    bird.y = height / 2;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    spawnTimer = 0;
    running = false;
    gameOver = false;
    scoreEl.textContent = String(score);
    messageEl.textContent = 'Click or tap to fly.';
    requestAnimationFrame(idleLoop);
  }

  function startGame() {
    if (running) return;
    running = true;
    gameOver = false;
    messageEl.textContent = 'Keep going.';
    lastTimestamp = performance.now();
    requestAnimationFrame(loop);
  }

  function flap() {
    if (!running) {
      startGame();
    }
    if (!gameOver) {
      bird.velocity = flapStrength;
      sfxFlap.currentTime = 0;
      sfxFlap.play();
    }
  }

  function endGame() {
    running = false;
    gameOver = true;
    bestScore = Math.max(bestScore, score);
    sfxLose.currentTime = 0;
    sfxLose.play();
    messageEl.textContent = `Game over. Best score: ${bestScore}.`;
  }

  function spawnPipe() {
    const minTop = 70;
    const maxTop = height - pipeGap - 110;
    const topHeight = Math.floor(minTop + Math.random() * (maxTop - minTop));
    pipes.push({ x: width + 20, topHeight, passed: false });
  }

  function update(delta) {
    const dt = delta / 16.67;
    bird.velocity += gravity * dt;
    bird.y += bird.velocity * dt;

    spawnTimer += delta;
    if (spawnTimer > 1450) {
      spawnTimer = 0;
      spawnPipe();
    }

    pipes.forEach((pipe) => {
      pipe.x -= pipeSpeed * dt;
      if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
        pipe.passed = true;
        score += 1;
        scoreEl.textContent = String(score);
      }
    });

    pipes = pipes.filter((pipe) => pipe.x + pipeWidth > -20);

    const hitGround = bird.y + bird.radius >= height - 20;
    const hitCeiling = bird.y - bird.radius <= 0;
    const hitPipe = pipes.some((pipe) => {
      const inXRange = bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + pipeWidth;
      if (!inXRange) return false;
      const gapTop = pipe.topHeight;
      const gapBottom = pipe.topHeight + pipeGap;
      return bird.y - bird.radius < gapTop || bird.y + bird.radius > gapBottom;
    });

    if (hitGround || hitCeiling || hitPipe) {
      endGame();
    }
  }

  function drawBackground() {
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, '#d7f0c9');
    sky.addColorStop(1, '#a9d18d');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(255,255,255,0.24)';
    ctx.beginPath();
    ctx.arc(62, 76, 28, 0, Math.PI * 2);
    ctx.arc(92, 76, 36, 0, Math.PI * 2);
    ctx.arc(128, 76, 26, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.beginPath();
    ctx.arc(255, 110, 22, 0, Math.PI * 2);
    ctx.arc(281, 110, 30, 0, Math.PI * 2);
    ctx.arc(312, 110, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#7aa35d';
    ctx.fillRect(0, height - 20, width, 20);
  }

  function drawPipes() {
    pipes.forEach((pipe) => {
      ctx.fillStyle = '#3f6b2f';
      ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
      ctx.fillRect(pipe.x - 4, pipe.topHeight - 16, pipeWidth + 8, 16);
      ctx.fillRect(pipe.x, pipe.topHeight + pipeGap, pipeWidth, height - pipe.topHeight - pipeGap - 20);
      ctx.fillRect(pipe.x - 4, pipe.topHeight + pipeGap, pipeWidth + 8, 16);
    });
  }

  function drawBird() {
    const size = bird.radius * 2.8;
    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.rotate(Math.min(Math.PI / 5, Math.max(-Math.PI / 5, bird.velocity / 10)));
    ctx.drawImage(birdImg, -size / 2, -size / 2, size, size);
    ctx.restore();
  }

  function drawFrame() {
    drawBackground();
    drawPipes();
    drawBird();
  }

  function idleLoop(timestamp) {
    if (running) return;
    bird.y = height / 2 + Math.sin(timestamp / 420) * 10;
    drawFrame();
    requestAnimationFrame(idleLoop);
  }

  function loop(timestamp) {
    if (!running) {
      drawFrame();
      return;
    }
    const delta = Math.min(32, timestamp - lastTimestamp);
    lastTimestamp = timestamp;
    update(delta);
    drawFrame();
    if (running) {
      requestAnimationFrame(loop);
    }
  }

  startBtn.addEventListener('click', () => {
    startGame();
    flap();
  });

  restartBtn.addEventListener('click', () => {
    resetGame();
    startGame();
    flap();
  });

  window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
      event.preventDefault();
      flap();
    }
  });

  canvas.addEventListener('pointerdown', () => {
    flap();
  });

  resetGame();
}