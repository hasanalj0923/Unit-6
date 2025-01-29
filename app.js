const qwerty = document.getElementById('qwerty');
const tries = document.querySelectorAll('.tries img');
const phrase = document.getElementById('phrase');
const overlay = document.getElementById('overlay');
const btnReset = document.querySelector('.btn__reset');

let missed = 0;

//Phrases to guess
const phrases = [
    'forest whispers softly', 
    'golden sunlight warms',
    'rivers flow gently',
    'mountains stand tall',
    'flowers bloom bright'
];

// Event listener for the reset button
btnReset.addEventListener('click', () => {
    resetGame();
});

// Function to reset the game state
function resetGame() {
    overlay.style.display = 'none'; // Hide overlay

    missed = 0; // Reset missed attempts
    const buttons = qwerty.querySelectorAll('button');
    const ul = phrase.querySelector('ul');

    ul.innerHTML = ''; // Clear the phrase from the previous round

    // Reset the button states (remove "chosen" class from all buttons)
    buttons.forEach(button => button.classList.remove('chosen'));

    // Reset the heart images to the initial state
    tries.forEach(heart => heart.setAttribute("src", "images/liveHeart.png"));

    // Display a new random phrase
    addPhraseToDisplay(getRandomPhraseAsArray(phrases));
}

// Function to get a random phrase from the array
function getRandomPhraseAsArray(arr) {
    let randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex].split(''); // Split the phrase into an array of characters
}

// Function to add phrase to the display
function addPhraseToDisplay(text) {
    const ul = phrase.querySelector("ul");

    text.forEach(letter => {
        const li = document.createElement("li");
        li.textContent = letter;
        li.classList.add(letter === ' ' ? 'space' : 'letter');
        ul.appendChild(li);
    });
}

// Function to check if the guessed letter is in the phrase
function checkLetter(value) {
    const listItems = phrase.querySelector('ul').children;
    let match = null;

    Array.from(listItems).forEach(item => {
        if (value === item.textContent) {
            item.classList.add('show');
            if (!match) match = value;
        }
    });

    return match;
}

// Function to check win/lose conditions
function checkWin() {
    const totalLetters = phrase.querySelectorAll('ul li.letter').length;
    const revealedLetters = phrase.querySelectorAll('ul li.show').length;

    if (revealedLetters === totalLetters) {
        displayOverlay("You won!", "win", "Play again");
    } else if (missed >= 5) {
        displayOverlay("You lost!", "lose", "Try again");
    }
}

// Function to display the overlay with appropriate message
function displayOverlay(message, overlayClass, buttonText) {
    const ul = phrase.querySelector('ul');
    const buttons = qwerty.querySelectorAll('button');

    overlay.style.display = 'flex';
    overlay.querySelector('h2').textContent = message;
    overlay.className = overlayClass;
    overlay.querySelector("a").classList.add("btn__reset");
    overlay.querySelector("a").textContent = buttonText;

    // Clear phrase and reset missed attempts
    ul.innerHTML = '';
    missed = 0;

    // Reset button classes and heart images
    buttons.forEach(button => button.classList.remove('chosen'));
    tries.forEach(heart => heart.setAttribute("src", "images/liveHeart.png"));
}

// Event listener for key clicks on QWERTY keyboard
qwerty.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' && !e.target.classList.contains('chosen')) {
        const buttonText = e.target.innerHTML;
        e.target.classList.add('chosen');

        const result = checkLetter(buttonText);
        if (!result) {
            missed++;
            tries[missed - 1].setAttribute("src", "images/lostHeart.png");
        }

        checkWin();
    }
});
