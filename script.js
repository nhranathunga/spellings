document.addEventListener('DOMContentLoaded', () => {
    const wordContainer = document.getElementById('current-word');
    const letterContainer = document.getElementById('letter-container');
    const feedback = document.getElementById('feedback');
    const checkButton = document.getElementById('check-button');
    const speakButton = document.getElementById('speak-button');
    const nextButton = document.getElementById('next-button');

    const words = [
        { word: "abandon", syllables: "a-ban-don" },
        { word: "abode", syllables: "a-bode" },
        { word: "absence", syllables: "ab-sence" },
        { word: "absurd", syllables: "ab-surd" },
        { word: "abundance", syllables: "a-bun-dance" },
        { word: "abundant", syllables: "a-bun-dant" },
        { word: "accuse", syllables: "ac-cuse" },
        { word: "accustom", syllables: "ac-cus-tom" },
        { word: "acquainted", syllables: "ac-quain-ted" },
        { word: "acquire", syllables: "ac-quire" },
        { word: "across", syllables: "a-cross" },
        { word: "address", syllables: "ad-dress" },
        { word: "adhere", syllables: "ad-here" },
        { word: "admission", syllables: "ad-mis-sion" },
        { word: "adopt", syllables: "a-dopt" },
        { word: "advance", syllables: "ad-vance" },
        { word: "affable", syllables: "af-fa-ble" },
        { word: "affectionate", syllables: "af-fec-tion-ate" },
        { word: "aid", syllables: "aid" }
    ];

    let currentWord = '';
    let syllables = [];
    let practiceCount = 0;
    const maxPractices = 3;

    // Select a random word from the array
    selectRandomWord();

    function selectRandomWord() {
        const randomIndex = Math.floor(Math.random() * words.length);
        currentWord = words[randomIndex].word;
        syllables = words[randomIndex].syllables.split('-');
        createSyllableElements();
        feedback.textContent = '';
        nextButton.style.display = 'none';
        wordContainer.innerHTML = ''; // Clear the displayed word
        practiceCount = 0; // Reset practice count
        checkButton.style.display = 'none'; // Hide check button initially
    }

    function createSyllableElements() {
        letterContainer.innerHTML = ''; // Clear previous syllables
        const shuffledSyllables = shuffleArray(syllables.slice());
        shuffledSyllables.forEach(syllable => {
            const syllableElement = document.createElement('div');
            syllableElement.textContent = syllable;
            syllableElement.classList.add('letter');
            syllableElement.setAttribute('draggable', 'true');

            // Add drag events
            syllableElement.addEventListener('dragstart', dragStart);
            syllableElement.addEventListener('dragend', dragEnd);

            letterContainer.appendChild(syllableElement);
        });
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function dragStart() {
        this.classList.add('dragging');
    }

    function dragEnd() {
        this.classList.remove('dragging');
    }

    // Drop event for the word container
    wordContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    wordContainer.addEventListener('drop', (e) => {
        const draggedElement = document.querySelector('.dragging');
        if (draggedElement) {
            wordContainer.appendChild(draggedElement);
            checkButton.style.display = 'block'; // Show check button when item is dropped
        }
    });

    // Check the spelling
    checkButton.addEventListener('click', () => {
        const userWord = Array.from(wordContainer.children).map(child => child.textContent).join('');
        if (userWord === currentWord) {
            feedback.textContent = 'Correct! Well done!';
            feedback.classList.add('correct');
            displayCompletedWord();
            practiceCount++;
            speakCorrectWord(); // Speak the correct word

            if (practiceCount < maxPractices) {
                // If less than max practices, allow reshuffling for next practice
                setTimeout(() => {
                    wordContainer.innerHTML = ''; // Clear displayed word after showing it
                    letterContainer.innerHTML = ''; // Clear letters for next practice
                    createShuffledLetterElements(); // Create new shuffled letters
                    feedback.textContent = ''; // Clear feedback
                    checkButton.style.display = 'none'; // Hide check button
                }, 1000); // Delay before reshuffling
            } else {
                // If max practices reached, show next button
                nextButton.style.display = 'block';
                checkButton.style.display = 'none'; // Hide check button
            }
        } else {
            feedback.textContent = 'Incorrect. Try again!';
            feedback.classList.remove('correct');
            resetLetters(); // Reset letters for another try
        }
    });

    function resetLetters() {
        // Reset the letter container by reshuffling and creating syllable elements again
        wordContainer.innerHTML = ''; // Clear any dropped letters
        createSyllableElements(); // Recreate the syllables with shuffled order
        checkButton.style.display = 'none'; // Hide the check button until a new drag and drop
    }

    function createShuffledLetterElements() {
        const shuffledLetters = shuffleArray(currentWord.split(''));
        letterContainer.innerHTML = ''; // Clear previous letters
        shuffledLetters.forEach(letter => {
            const letterElement = document.createElement('div');
            letterElement.textContent = letter;
            letterElement.classList.add('letter');
            letterElement.setAttribute('draggable', 'true');

            // Add drag events
            letterElement.addEventListener('dragstart', dragStart);
            letterElement.addEventListener('dragend', dragEnd);

            letterContainer.appendChild(letterElement);
        });
    }

    function displayCompletedWord() {
        wordContainer.innerHTML = ''; // Clear syllables
        const completedWordElement = document.createElement('div');
        completedWordElement.textContent = currentWord.toUpperCase();
        wordContainer.appendChild(completedWordElement);
    }

    function speakCorrectWord() {
        const utterance = new SpeechSynthesisUtterance(currentWord);
        speechSynthesis.speak(utterance);
    }

    // Speak syllables
    speakButton.addEventListener('click', () => {
        const utterance = new SpeechSynthesisUtterance(syllables.join('-'));
        speechSynthesis.speak(utterance);
    });

    // Next button functionality
    nextButton.addEventListener('click', selectRandomWord);
});
