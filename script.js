document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('startScreen');
    const gameContainer = document.getElementById('gameContainer');
    const gameBoard = document.querySelector('.game-board');
    const attemptsElement = document.getElementById('attempts');
    const restartButton = document.getElementById('restart');
    const changeThemeButton = document.getElementById('changeTheme');
    const themeButtons = document.querySelectorAll('.theme-btn');

    let attempts = 0;
    let firstCard = null;
    let secondCard = null;
    let locked = false;
    let matchedPairs = 0;
    let currentTheme = null;

    // Voeg hier je eigen afbeeldingen toe (8 verschillende afbeeldingen)
    const images = [
        'Images/room memory card.png',
        'Images/Zout memory card.png',
        'Images/Provence memory card.png',
        'Images/Paturain naturel memory card.png',
        'Images/Frankrijk memory card.png',
        'Images/Melk memory card.png',
        'Images/Paturain naturel light memory card.png',
        'Images/Paturain logo memory card.png'
    ];

    function shuffleCards() {
        const cards = [...images, ...images];
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        return cards;
    }

    function createCard(imagePath) {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">
                    <img src="${imagePath}" alt="Memory Card">
                </div>
            </div>
        `;

        card.addEventListener('click', flipCard);
        return card;
    }

    function flipCard() {
        if (locked) return;
        if (this === firstCard) return;

        this.classList.add('flipped');

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        locked = true;
        checkForMatch();
    }

    function checkForMatch() {
        attempts++;
        attemptsElement.textContent = attempts;

        const firstCardImage = firstCard.querySelector('img').src;
        const secondCardImage = secondCard.querySelector('img').src;
        const isMatch = firstCardImage === secondCardImage;

        if (isMatch) {
            disableCards();
            matchedPairs++;
            if (matchedPairs === images.length) {
                setTimeout(() => {
                    alert(`Gefeliciteerd! Je hebt gewonnen in ${attempts} pogingen!`);
                }, 500);
            }
        } else {
            unflipCards();
        }
    }

    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
    }

    function unflipCards() {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [firstCard, secondCard] = [null, null];
        locked = false;
    }

    function initializeGame() {
        gameBoard.innerHTML = '';
        attempts = 0;
        matchedPairs = 0;
        attemptsElement.textContent = attempts;

        const cards = shuffleCards();
        cards.forEach(imagePath => {
            const card = createCard(imagePath);
            gameBoard.appendChild(card);
        });

        // Direct het spel tonen, zonder startscherm
        if (startScreen) startScreen.style.display = 'none';
        gameContainer.style.display = 'block';
    }

    function showStartScreen() {
        if (startScreen) startScreen.style.display = 'block';
        gameContainer.style.display = 'none';
    }

    // Event Listeners
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.dataset.theme;
            initializeGame(theme);
        });
    });

    restartButton.addEventListener('click', initializeGame);
    changeThemeButton.addEventListener('click', showStartScreen);

    // Direct het spel starten bij het laden van de pagina
    initializeGame();
}); 