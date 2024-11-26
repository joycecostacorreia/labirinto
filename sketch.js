let cellSize = 60; // Tamanho das células
let countdown = 20; // Tempo para vencer
let timer;
let ghosts = [
  { x: 3, y: 5, direction: 1 },  // Fantasma 1
  { x: 7, y: 3, direction: -1 }  // Fantasma 2
];
let moveInterval = 500; // Intervalo de movimento dos fantasmas
let lastMoveTime = 0;

let maze = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let stars = []; // Estrelas fixas
let isGameStarted = false; // Controle da tela inicial
let gameEnded = false; // Controle de término do jogo
let colorChangeTime = 500; // Tempo para mudar a cor (em milissegundos)
let lastColorChangeTime = 0; // Armazena o tempo da última mudança de cor
let currentColor = [255, 0, 0]; // Cor inicial do texto piscando

let player = { x: 1, y: 1 }; // Posição inicial do jogador (gato)

function setup() {
  createCanvas(maze[0].length * cellSize * 1.5, maze.length * cellSize * 1.5); // Aumentando a tela
  timer = millis();

  // Gerar posições fixas para as estrelas
  for (let i = 0; i < 100; i++) { // Aumentando o número de estrelas
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
    });
  }

  noStroke();
}

function draw() {
  if (!isGameStarted) {
    drawStartScreen(); // Tela inicial
  } else if (gameEnded) {
    drawEndScreen(); // Tela de final do jogo
  } else {
    drawGame(); // Jogo em andamento
  }
}

function drawStartScreen() {
  background(20);

  // Fundo estrelado
  for (let star of stars) {
    fill(255);
    ellipse(star.x, star.y, star.size);
  }

  // Lua crescente
  fill(240, 240, 100);
  ellipse(width - 90, 90, 120, 120); // Lua cheia maior
  fill(20);
  ellipse(width - 75, 90, 100, 120); // Cria o efeito de crescente

  // Título
  fill(255, 0, 0); // Vermelho para o título
  textSize(72); // Aumentando o tamanho do título
  textAlign(CENTER, CENTER);
  text("Jogo do Labirinto", width / 2, height / 4);

  // Subtítulo
  textSize(36); // Aumentando o subtítulo
  text("Tema: Halloween 🎃", width / 2, height / 4 + 100);

  // Efeito de texto piscando
  let currentTime = millis();
  if (currentTime - lastColorChangeTime > colorChangeTime) {
    // Muda a cor do texto a cada intervalo
    currentColor = [random(255), random(255), random(255)];
    lastColorChangeTime = currentTime;
  }

  // Botão de iniciar
  fill(currentColor); // Cor do texto piscando
  rect(width / 2 - 150, height / 2, 300, 75, 10); // Botão maior com bordas arredondadas
  fill(0);
  textSize(30); // Aumentando o tamanho do texto do botão
  text("Iniciar Jogo", width / 2, height / 2 + 37.5);
}

function mousePressed() {
  // Verifica se o botão "Iniciar Jogo" foi clicado
  if (
    mouseX > width / 2 - 150 &&
    mouseX < width / 2 + 150 &&
    mouseY > height / 2 &&
    mouseY < height / 2 + 75
  ) {
    isGameStarted = true; // Inicia o jogo
    timer = millis(); // Reinicia o temporizador
    gameEnded = false; // Certifica-se de que o jogo não está terminado
    player.x = 1; // Reinicia a posição do jogador
    player.y = 1; // Reinicia a posição do jogador
  }
  
  // Verifica se o jogo terminou e reinicia
  if (gameEnded) {
    gameEnded = false;
    player.x = 1;
    player.y = 1;
    timer = millis();
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    movePlayer(-1, 0); // Move o jogador para a esquerda
  } else if (keyCode === RIGHT_ARROW) {
    movePlayer(1, 0); // Move o jogador para a direita
  } else if (keyCode === UP_ARROW) {
    movePlayer(0, -1); // Move o jogador para cima
  } else if (keyCode === DOWN_ARROW) {
    movePlayer(0, 1); // Move o jogador para baixo
  }
}

function movePlayer(dx, dy) {
  let newX = player.x + dx;
  let newY = player.y + dy;

  // Verifica se a célula de destino está dentro dos limites do labirinto e é um caminho (não é parede)
  if (newX >= 0 && newX < maze[0].length && newY >= 0 && newY < maze.length && maze[newY][newX] === 0) {
    player.x = newX;
    player.y = newY;
  }
}

// Função que move os fantasmas
function moveGhosts() {
  for (let ghost of ghosts) {
    // Mover o fantasma em direção à sua direção (1 ou -1)
    ghost.y += ghost.direction;

    // Verifica se o fantasma bateu nas bordas do labirinto e inverte a direção
    if (ghost.y <= 0 || ghost.y >= maze.length - 1) {
      ghost.direction *= -1; // Inverte a direção do fantasma
    }
  }
}

function drawGame() {
  background(0); // Fundo preto

  // Fundo estrelado
  for (let star of stars) {
    fill(255);
    ellipse(star.x, star.y, star.size);
  }

  // Lua crescente
  fill(240, 240, 100);
  ellipse(width - 90, 90, 120, 120); // Lua cheia maior
  fill(20);
  ellipse(width - 75, 90, 100, 120); // Cria o efeito de crescente

  // Atualiza o contador regressivo
  let elapsedTime = int((millis() - timer) / 1000);
  let timeLeft = countdown - elapsedTime;

  // Verifica se o tempo acabou
  if (timeLeft <= 0) {
    gameEnded = true;
    return;
  }

  // Atualiza a posição dos fantasmas
  if (millis() - lastMoveTime > moveInterval) {
    lastMoveTime = millis();
    moveGhosts(); // Função para mover os fantasmas
  }

  // Desenha o labirinto
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === 1) {
        fill(50, 0, 50); // Paredes roxas e escuras
      } else {
        fill(10, 10, 30); // Caminhos escuros
      }
      rect(x * cellSize * 1.5, y * cellSize * 1.5, cellSize * 1.5, cellSize * 1.5);
    }
  }

  // Desenha o jogador (gato)
  fill(0); // Cor preta para o gato
  ellipse(player.x * cellSize * 1.5 + cellSize * 1.5 / 2, player.y * cellSize * 1.5 + cellSize * 1.5 / 2, 30, 30);

  // Desenha os fantasmas
  for (let ghost of ghosts) {
    fill(255, 0, 0); // Cor vermelha para os fantasmas
    ellipse(ghost.x * cellSize * 1.5 + cellSize * 1.5 / 2, ghost.y * cellSize * 1.5 + cellSize * 1.5 / 2, 30, 30);
  }

  // Exibe o tempo
  textSize(32);
  fill(255);
  textAlign(CENTER, CENTER);
  text("Tempo: " + timeLeft, width / 2, 30);
}

function drawEndScreen() {
  background(0);

  // Exibe o fundo estrelado
  for (let star of stars) {
    fill(255);
    ellipse(star.x, star.y, star.size);
  }

  // Exibe uma mensagem de fim de jogo
  fill(255, 0, 0); // Cor vermelha para a mensagem
  textSize(72);
  textAlign(CENTER, CENTER);
  text("Fim de Jogo!", width / 2, height / 2);

  // Exibe o tempo que o jogador demorou
  textSize(32);
  text("Tempo: " + int((millis() - timer) / 1000) + " segundos", width / 2, height / 2 + 80);

  // Dica para reiniciar
  textSize(24);
  text("Clique para reiniciar!", width / 2, height / 2 + 120);
}
