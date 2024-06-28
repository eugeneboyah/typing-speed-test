document.addEventListener('DOMContentLoaded', () => {
    const gameBox = document.querySelector('.game-box textarea');
    const timeDisplay = document.querySelector('.time');
    const errorsDisplay = document.querySelector('.errors');
    const vpmDisplay = document.querySelector('.vpm');
    const cpmDisplay = document.querySelector('.cpm');
    const tryAgainButton = document.querySelector('.score button');

    let paragraphs = [];
    let currentParagraph = '';
    let timeLeft = 60;
    let timer;
    let errors = 0;
    let charactersTyped = 0;

    // Fetch paragraphs from text.json
    fetch('text.json')
        .then(response => response.json())
        .then(data => {
            paragraphs = data;
            startGame();
        });

    function startGame() {
        currentParagraph = paragraphs[Math.floor(Math.random() * paragraphs.length)];
        gameBox.value = '';
        gameBox.placeholder = currentParagraph;
        gameBox.disabled = false;
        timeLeft = 60;
        errors = 0;
        charactersTyped = 0;
        timeDisplay.textContent = `Time Left: ${timeLeft}s`;
        errorsDisplay.textContent = `Errors: ${errors}`;
        vpmDisplay.textContent = `VPM: 0`;
        cpmDisplay.textContent = `CPM: 0`;
        gameBox.focus();

        clearInterval(timer);
        timer = setInterval(countDown, 1000);

        gameBox.addEventListener('input', handleTyping);
    }

    function handleTyping() {
        const textEntered = gameBox.value;
        const textEnteredLength = textEntered.length;
        charactersTyped = textEnteredLength;

        const compareText = currentParagraph.substring(0, textEnteredLength);

        if (textEntered === currentParagraph) {
            clearInterval(timer);
            gameBox.disabled = true;
        } else if (textEntered !== compareText) {
            errors++;
        }

        errorsDisplay.textContent = `Errors: ${errors}`;
        cpmDisplay.textContent = `CPM: ${charactersTyped}`;
        const wordsTyped = textEntered.split(' ').length;
        const vpm = Math.round(wordsTyped * (60 / (60 - timeLeft)));
        vpmDisplay.textContent = `VPM: ${vpm}`;
    }

    function countDown() {
        if (timeLeft > 0) {
            timeLeft--;
            timeDisplay.textContent = `Time Left: ${timeLeft}s`;
        } else {
            clearInterval(timer);
            gameBox.disabled = true;
            const wordsTyped = gameBox.value.split(' ').length;
            const vpm = Math.round(wordsTyped * (60 / 60));
            vpmDisplay.textContent = `VPM: ${vpm}`;
        }
    }

    tryAgainButton.addEventListener('click', startGame);
});
