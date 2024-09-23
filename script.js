document.addEventListener('DOMContentLoaded', () => {
    const wordContainer = document.getElementById('current-word');
    const letterContainer = document.getElementById('letter-container');
    const feedback = document.getElementById('feedback');
    const checkButton = document.getElementById('check-button');
    const nextButton = document.getElementById('next-button');
    const speakButton = document.getElementById('speak-button');

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
    let isSyllableMode = true; // Indicates whether we're in syllable or spelling mode

    selectRandomWord();

    speakButton.addEventListener('click', () => {
        speakWord(currentWord); 
    });

    // Function to select a random word and reset states
    function selectRandomWord() {
        const randomIndex = Math.floor(Math.random() * words.length);
        currentWord = words[randomIndex].word;
        syllables = words[randomIndex].syllables.split('-');
        createSyllableElements();
        feedback.textContent = '';
        nextButton.style.display = 'none';
        wordContainer.innerHTML = '';
        practiceCount = 0;
        checkButton.style.display = 'none';
        isSyllableMode = true; // Start with syllable mode for every new word
        
    }

    // Function to create either syllable or letter elements
    function createSyllableElements() {
        letterContainer.innerHTML = '';
        const elements = isSyllableMode ? syllables : currentWord.split('');
        const shuffledElements = shuffleArray(elements.slice());
        shuffledElements.forEach(element => {
            const letterElement = document.createElement('div');
            letterElement.textContent = element;
            letterElement.classList.add('letter');

            letterElement.addEventListener('click', () => {
                moveElementToWordContainer(letterElement);
            });

            letterContainer.appendChild(letterElement);
        });
    }

    // Shuffle an array of syllables or letters
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Move the clicked syllable or letter to the word container
    function moveElementToWordContainer(element) {
        wordContainer.appendChild(element);
        checkButton.style.display = 'block';
    }

    // Speak the word or syllable using Text-to-Speech
    function speakWord(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }

    // Handle the check button functionality
    checkButton.addEventListener('click', () => {
        const userWord = Array.from(wordContainer.children).map(child => child.textContent).join('');
        if (isSyllableMode) {
            if (userWord === syllables.join('')) {
                feedback.textContent = 'Correct syllables! Now, practice the spelling.';
                isSyllableMode = false; // Switch to letter spelling mode
                resetForSpellingPractice();
            } else {
                feedback.textContent = 'Try again!';
                resetLetters(); // Reset the syllables to let user retry
            }
        } else {
            if (userWord === currentWord) {
                practiceCount++;
                feedback.textContent = `Correct! Practice ${practiceCount} of ${maxPractices}`;
                displayBigWord(); // Show the word in big font
                if (practiceCount < maxPractices) {
                    resetForSpellingPractice(); // Practice spelling with shuffled letters
                } else {
                    feedback.textContent = 'Well done! Moving to the next word.';
                    speakWord(currentWord);  // Speak the full word on each click
                    nextButton.style.display = 'block';
                    checkButton.style.display = 'none';
                }
            } else {
                feedback.textContent = 'Try again!';
                resetLetters(); // Reset the letters for retry
            }
        }
    });

    // Display the current word in big font
    function displayBigWord() {
        wordContainer.innerHTML = `<span style="font-size: 2em;">${currentWord}</span>`; // Adjust the size as needed
    }

    // Reset the container for the next practice cycle (spelling)
    function resetForSpellingPractice() {
        wordContainer.innerHTML = '';
        speakWord(currentWord);  // Speak the full word on each click
        createSyllableElements(); // Use letters for spelling now
        checkButton.style.display = 'none';
    }

    // Reset letters or syllables after a wrong attempt
    function resetLetters() {
        wordContainer.innerHTML = ''; // Clear the displayed word
        speakWord(currentWord);  // Speak the full word on each click
        createSyllableElements(); // Reset syllables/letters for a retry
        checkButton.style.display = 'none';
    }

    // Move to the next word
    nextButton.addEventListener('click', () => {
        selectRandomWord();
        createSyllableElements();
        speakWord(currentWord); // Speak the new word on load
    });
});
