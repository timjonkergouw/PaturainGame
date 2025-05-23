document.addEventListener('DOMContentLoaded', () => {
    // Show name input modal when page loads
    const nameModal = document.getElementById('nameModal');
    const nameInput = document.getElementById('nameInput');
    const startGameButton = document.getElementById('startGame');
    const playerNameSpan = document.getElementById('playerName');
    let playerName = '';

    nameModal.style.display = 'block';

    startGameButton.addEventListener('click', () => {
        if (nameInput.value.trim() !== '') {
            playerName = nameInput.value.trim();
            playerNameSpan.textContent = playerName;
            nameModal.style.display = 'none';
            initializeGame();
        }
    });

    // Game variables
    let attempts = 0;
    const attemptsDisplay = document.getElementById('attempts');
    const gameBoard = document.querySelector('.game-board');
    const winModal = document.getElementById('winModal');
    const finalAttemptsSpan = document.getElementById('finalAttempts');
    const goToFormButton = document.getElementById('goToForm');

    let firstCard = null;
    let secondCard = null;
    let locked = false;
    let matchedPairs = 0;

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
        attemptsDisplay.textContent = attempts;

        const firstCardImage = firstCard.querySelector('img').src;
        const secondCardImage = secondCard.querySelector('img').src;
        const isMatch = firstCardImage === secondCardImage;

        if (isMatch) {
            disableCards();
            matchedPairs++;
            if (matchedPairs === images.length) {
                setTimeout(showWinModal, 500);
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

    function showWinModal() {
        finalAttemptsSpan.textContent = attempts;
        winModal.style.display = 'block';
    }

    function hideWinModal() {
        winModal.style.display = 'none';
    }

    function initializeGame() {
        gameBoard.innerHTML = '';
        attempts = 0;
        matchedPairs = 0;
        attemptsDisplay.textContent = attempts;
        firstCard = null;
        secondCard = null;
        locked = false;
        hideWinModal();

        const cards = shuffleCards();
        cards.forEach(imagePath => {
            const card = createCard(imagePath);
            gameBoard.appendChild(card);
        });
    }

    // When player wins and clicks "Ga naar formulier"
    if (goToFormButton) {
        goToFormButton.addEventListener('click', () => {
            // Store game data in localStorage
            localStorage.setItem('winnerName', playerName);
            localStorage.setItem('winnerAttempts', attempts.toString());
            // Redirect to winner form page
            window.location.href = 'winner-form.html';
        });
    }

    // Start het spel direct bij het laden van de pagina
    initializeGame();
});

// This code runs on the winner-form.html page
if (document.getElementById('winnerForm')) {
    const nameInput = document.getElementById('name');
    const attemptsInput = document.getElementById('attempts');

    console.log('Loading stored data...'); // Debug log
    // Fill in the stored data
    const storedName = localStorage.getItem('winnerName');
    const storedAttempts = localStorage.getItem('winnerAttempts');

    console.log('Retrieved data:', {
        name: storedName,
        attempts: storedAttempts
    }); // Debug log

    nameInput.value = storedName || '';
    attemptsInput.value = storedAttempts || '';

    document.getElementById('winnerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        // Here you can add code to handle the form submission
        // For example, send the data to a server or show a thank you message
        alert('Bedankt voor het invullen van het formulier!');
        // Clear the stored data
        localStorage.removeItem('winnerName');
        localStorage.removeItem('winnerAttempts');
        // Redirect back to the game
        window.location.href = 'index.html';
    });
} 