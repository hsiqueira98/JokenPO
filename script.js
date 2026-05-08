const POINTS_PER_ROUND = 20;
const WINNING_SCORE = 100;

// ===== ESTADO DO JOGO =====
let gameState = {
    userScore: 0,
    computerScore: 0,
    currentRound: 0,
    gameActive: true,
    choices: {
        'rock': 'pedra',
        'paper': 'papel',
        'scissors': 'tesoura'
    },
    emojis: {
        'pedra': '✊',
        'papel': '✋',
        'tesoura': '✌️'
    }
};

// ===== ELEMENTOS DO DOM =====
const rockBtn = document.getElementById('rock');
const paperBtn = document.getElementById('paper');
const scissorsBtn = document.getElementById('scissors');

// ===== EVENT LISTENERS =====
rockBtn.addEventListener('click', () => playRound('rock'));
paperBtn.addEventListener('click', () => playRound('paper'));
scissorsBtn.addEventListener('click', () => playRound('scissors'));

// ===== FUNÇÃO PRINCIPAL DO JOGO =====
function playRound(userChoice) {
    if (!gameState.gameActive) return;

    // Incrementar rodada
    gameState.currentRound++;

    // Gerar escolha do computador
    const computerChoice = getComputerChoice();

    // Determinar vencedor da rodada
    const roundResult = determineRoundWinner(userChoice, computerChoice);

    // Atualizar pontuação
    if (roundResult === 'win') {
        gameState.userScore += POINTS_PER_ROUND;
    } else if (roundResult === 'lose') {
        gameState.computerScore += POINTS_PER_ROUND;
    }

    // Determinar mensagem de resultado
    let resultMessage;
    if (roundResult === 'win') {
        resultMessage = 'Você ganhou!';
    } else if (roundResult === 'lose') {
        resultMessage = 'Você perdeu!';
    } else {
        resultMessage = 'Empate!';
    }

    // Exibir resultado da rodada
    displayRoundResult(userChoice, computerChoice, resultMessage);

    // Atualizar placar
    updateScore();

    // Verificar se o jogo acabou
    if (gameState.userScore >= WINNING_SCORE) {
        endGame('win');
    } else if (gameState.computerScore >= WINNING_SCORE) {
        endGame('lose');
    }
}

// ===== GERAR ESCOLHA DO COMPUTADOR =====
function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    return choices[Math.floor(Math.random() * choices.length)];
}

// ===== DETERMINAR VENCEDOR DA RODADA =====
function determineRoundWinner(userChoice, computerChoice) {
    if (userChoice === computerChoice) {
        return 'draw';
    }

    const winConditions = {
        'rock': 'scissors',
        'paper': 'rock',
        'scissors': 'paper'
    };

    if (winConditions[userChoice] === computerChoice) {
        return 'win';
    }

    return 'lose';
}

// ===== EXIBIR RESULTADO DA RODADA =====
function displayRoundResult(userChoice, computerChoice, resultMessage) {
    // Atualizar emojis e nomes
    const userChoiceName = gameState.choices[userChoice];
    const computerChoiceName = gameState.choices[computerChoice];

    document.getElementById('user-emoji').textContent = gameState.emojis[userChoiceName];
    document.getElementById('user-choice').textContent = userChoiceName.charAt(0).toUpperCase() + userChoiceName.slice(1);

    document.getElementById('computer-emoji').textContent = gameState.emojis[computerChoiceName];
    document.getElementById('computer-choice').textContent = computerChoiceName.charAt(0).toUpperCase() + computerChoiceName.slice(1);

    // Atualizar resultado
    document.getElementById('outcome').textContent = resultMessage;

    // Aplicar classe de cor
    const outcomeDisplay = document.getElementById('outcome-display');
    outcomeDisplay.classList.remove('win', 'lose', 'draw');

    if (resultMessage.includes('ganhou')) {
        outcomeDisplay.classList.add('win');
    } else if (resultMessage.includes('perdeu')) {
        outcomeDisplay.classList.add('lose');
    } else {
        outcomeDisplay.classList.add('draw');
    }
}

// ===== ATUALIZAR PLACAR =====
function updateScore() {
    document.getElementById('user-score').querySelector('span').textContent = gameState.userScore;
    document.getElementById('computer-score').querySelector('span').textContent = gameState.computerScore;
}

// ===== FIM DO JOGO =====
function endGame(result) {
    gameState.gameActive = false;

    // Desabilitar botões
    [rockBtn, paperBtn, scissorsBtn].forEach(btn => {
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
        btn.disabled = true;
    });

    // Exibir modal com resultado
    setTimeout(() => {
        if (result === 'win') {
            showVictoryModal();
        } else if (result === 'lose') {
            showDefeatModal();
        } else {
            showDrawModal();
        }
    }, 800);
}

// ===== MODAL DE VITÓRIA =====
function showVictoryModal() {
    const modal = createModal(
        '🎉',
        'Parabéns!',
        'Você venceu a sessão!',
        '#10b981'
    );

    document.body.appendChild(modal);
    createConfetti();
    playVictoryAnimation(modal);

    setTimeout(() => {
        addReplayButton(modal);
    }, 1500);
}

// ===== MODAL DE DERROTA =====
function showDefeatModal() {
    const modal = createModal(
        '😢',
        'Que Pena...',
        'JokenBot venceu a sessão!',
        '#ef4444'
    );

    document.body.appendChild(modal);
    playDefeatAnimation(modal);

    setTimeout(() => {
        addReplayButton(modal);
    }, 1500);
}

// ===== MODAL DE EMPATE =====
function showDrawModal() {
    const modal = createModal(
        '🤝',
        'Parabéns!',
        'Ambos chegaram a 100 pontos!',
        '#f59e0b'
    );

    document.body.appendChild(modal);
    playDrawAnimation(modal);

    setTimeout(() => {
        addReplayButton(modal);
    }, 1500);
}

// ===== CRIAR MODAL =====
function createModal(emoji, title, message, color) {
    const modal = document.createElement('div');
    modal.className = 'game-modal';
    modal.innerHTML = `
        <div class="modal-content" style="border-color: ${color}; box-shadow: 0 0 30px ${color}40;">
            <div class="modal-emoji">${emoji}</div>
            <h2 class="modal-title" style="color: ${color};">${title}</h2>
            <p class="modal-message">${message}</p>
            <p class="modal-score">
                <span style="color: #10b981;">Você: ${gameState.userScore}</span>
                <span style="color: #ef4444;">JokenBot: ${gameState.computerScore}</span>
            </p>
        </div>
    `;

    return modal;
}

// ===== ADICIONAR BOTÃO DE REPLAY =====
function addReplayButton(modal) {
    const button = document.createElement('button');
    button.className = 'replay-btn';
    button.textContent = 'Jogar Novamente';

    button.addEventListener('click', () => {
        modal.remove();
        resetGame();
    });

    modal.querySelector('.modal-content').appendChild(button);
    button.style.animation = 'slideUp 0.6s ease forwards';
}

// ===== RESET DO JOGO =====
function resetGame() {
    gameState.userScore = 0;
    gameState.computerScore = 0;
    gameState.currentRound = 0;
    gameState.gameActive = true;

    // Reabilitar botões
    [rockBtn, paperBtn, scissorsBtn].forEach(btn => {
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
        btn.disabled = false;
    });

    // Resetar exibição
    document.getElementById('user-emoji').textContent = '-';
    document.getElementById('user-choice').textContent = '-';
    document.getElementById('computer-emoji').textContent = '-';
    document.getElementById('computer-choice').textContent = '-';
    document.getElementById('outcome').textContent = '-';

    updateScore();

    // Remover classe de cor
    document.getElementById('outcome-display').classList.remove('win', 'lose', 'draw');
}

// ===== CONFETES =====
function createConfetti() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-container';

    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.backgroundColor = getRandomColor();
        piece.style.animationDelay = Math.random() * 0.3 + 's';
        piece.style.animationDuration = (Math.random() * 1 + 2) + 's';
        confetti.appendChild(piece);
    }

    document.body.appendChild(confetti);

    setTimeout(() => {
        confetti.remove();
    }, 3500);
}

// ===== CORES ALEATÓRIAS PARA CONFETES =====
function getRandomColor() {
    const colors = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// ===== ANIMAÇÕES DO MODAL =====
function playVictoryAnimation(modal) {
    const content = modal.querySelector('.modal-content');
    content.style.animation = 'bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
}

function playDefeatAnimation(modal) {
    const content = modal.querySelector('.modal-content');
    content.style.animation = 'shake 0.6s ease-in-out';
}

function playDrawAnimation(modal) {
    const content = modal.querySelector('.modal-content');
    content.style.animation = 'pulse 0.8s ease-in-out';
}