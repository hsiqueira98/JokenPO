// ===== CONFIGURAÇÃO DO JOGO =====
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

// ===== CSS DAS ANIMAÇÕES (SERÁ ADICIONADO AO STYLE.CSS) =====
// Adicionar ao style.css:
/*
@keyframes bounceIn {
    0% {
        opacity: 0;
        transform: scale(0.3);
    }
    50% {
        opacity: 1;
    }
    70% {
        transform: scale(1.05);
    }
    100% {
        transform: scale(1);
    }
}

@keyframes shake {
    0%, 100% {
        transform: translateX(0);
    }
    10%, 30%, 50%, 70%, 90% {
        transform: translateX(-10px);
    }
    20%, 40%, 60%, 80% {
        transform: translateX(10px);
    }
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes confettiFall {
    to {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
    }
}

.game-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
}

.modal-content {
    background: white;
    border-radius: 24px;
    padding: 40px;
    text-align: center;
    max-width: 400px;
    border: 3px solid;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-emoji {
    font-size: 80px;
    margin-bottom: 20px;
    display: inline-block;
    animation: bounce 0.8s infinite;
}

.modal-title {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 12px;
}

.modal-message {
    font-size: 18px;
    color: #6b7280;
    margin-bottom: 20px;
}

.modal-score {
    display: flex;
    justify-content: space-around;
    gap: 20px;
    margin: 24px 0;
    padding: 16px;
    background: #f9fafb;
    border-radius: 12px;
    font-weight: 600;
    font-size: 16px;
}

.replay-btn {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border: none;
    padding: 14px 32px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.replay-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.replay-btn:active {
    transform: translateY(0);
}

.confetti-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 999;
}

.confetti {
    position: absolute;
    width: 10px;
    height: 10px;
    bottom: -10px;
    opacity: 1;
    animation: confettiFall linear forwards;
}

@keyframes bounce {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-20px);
    }
}
*/
