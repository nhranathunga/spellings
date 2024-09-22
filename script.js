document.addEventListener('DOMContentLoaded', () => {
    const wordContainer = document.getElementById('current-word');
    const letterContainer = document.getElementById('letter-container');
    const feedback = document.getElementById('feedback');
    const checkButton = document.getElementById('check-button');
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
    let isSyllableMode = true;

    selectRandomWord();

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
        isSyllableMode = true; // Start with syllable mode
    }

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

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function moveElementToWordContainer(element) {
        wordContainer.appendChild(element);
        checkButton.style.display = 'block';
    }

    checkButton.addEventListener('click', () => {
        const userWord = Array.from(wordContainer.children).map(child => child.textContent).join('');
        if (userWord === currentWord) {
            feedback.textContent = 'Correct!';
            feedback.classList.add('correct');
            practiceCount++;
            if (isSyllableMode) {
                feedback.textContent = 'Syllables correct! Now practice the spelling.';
                isSyllableMode = false; // Switch to spelling mode
                resetForSpellingPractice();
            } else if (practiceCount < maxPractices) {
                feedback.textContent = `Correct! Practice ${practiceCount} of ${maxPractices}`;
                resetForSpellingPractice();
            } else {
                feedback.textContent = 'Well done! Moving to next word.';
                nextButton.style.display = 'block';
                checkButton.style.display = 'none';
            }
        } else {
            feedback.textContent = 'Try again!';
            feedback.classList.remove('correct');
            resetLetters();
        }
    });

    function resetLetters() {
        wordContainer.innerHTML = '';
        createSyllableElements();
        checkButton.style.display = 'none';
    }

    function resetForSpellingPractice() {
        wordContainer.innerHTML = '';
        createSyllableElements();
        checkButton.style.display = 'none';
    }

    nextButton.addEventListener('click', selectRandomWord);
});
