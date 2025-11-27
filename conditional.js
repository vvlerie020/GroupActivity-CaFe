  const ageInput = document.getElementById('ageInput');
        const checkAgeBtn = document.getElementById('checkAgeBtn');
        const ageResult = document.getElementById('ageResult');

        checkAgeBtn.addEventListener('click', () => {
            const age = Number(ageInput.value);
            if (isNaN(age)) {
                ageResult.textContent = 'Please enter a valid number for age.';
                ageResult.style.color = 'crimson';
                return;
            }

            // Here is the if / else logic: if age is 18 or older, show Adult, otherwise show Minor.
            if (age >= 18) {
                ageResult.textContent = `You are ${age} years old — Adult.`;
                ageResult.style.color = 'green';
            } else {
                ageResult.textContent = `You are ${age} years old — Minor.`;
                ageResult.style.color = 'blue';
            }
        });

        // Example 2: if / else if / else
        const tempInput = document.getElementById('tempInput');
        const tempBtn = document.getElementById('tempBtn');
        const tempResult = document.getElementById('tempResult');

        tempBtn.addEventListener('click', () => {
            const temp = Number(tempInput.value);
            if (isNaN(temp)) {
                tempResult.textContent = 'Please enter a valid temperature.';
                tempResult.style.color = 'crimson';
                return;
            }

            // if / else if / else chain provides multiple branches depending on the temperature
            if (temp <= 0) {
                tempResult.textContent = 'Freezing! Wear a heavy coat.';
                tempResult.style.color = 'navy';
            } else if (temp <= 20) {
                tempResult.textContent = 'Cool weather. Wear a jacket.';
                tempResult.style.color = 'teal';
            } else if (temp <= 30) {
                tempResult.textContent = 'Nice and warm.';
                tempResult.style.color = 'green';
            } else {
                tempResult.textContent = 'Hot — stay hydrated and stay in the shade.';
                tempResult.style.color = 'orange';
            }
       
       
        });

        tempBtn.addEventListener('click', () => {
            const temp = Number(tempInput.value);
            if (isNaN(temp)) {
                tempResult.textContent = 'Please enter a valid temperature.';
                tempResult.style.color = 'crimson';
                return;
            }

            // if / else if / else chain provides multiple branches depending on the temperature
            if (temp <= 0) {
                tempResult.textContent = 'Freezing! Wear a heavy coat.';
                tempResult.style.color = 'navy';
            } else if (temp <= 20) {
                tempResult.textContent = 'Cool weather. Wear a jacket.';
                tempResult.style.color = 'teal';
            } else if (temp <= 30) {
                tempResult.textContent = 'Nice and warm.';
                tempResult.style.color = 'green';
            } else {
                tempResult.textContent = 'Hot — stay hydrated and stay in the shade.';
                tempResult.style.color = 'orange';
            }
        });


 // JavaScript for the game logic
    function playGame(playerChoice) {
      const choices = ['rock', 'paper', 'scissors'];
      const computerChoice = choices[Math.floor(Math.random() * choices.length)];

      let resultMessage = '';
      if (playerChoice === computerChoice) {
        resultMessage = `It's a tie! You both chose ${playerChoice}.`;
      } else if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
      ) {
        resultMessage = `You win! ${playerChoice.charAt(0).toUpperCase() + playerChoice.slice(1)} beats ${computerChoice}.`;
      } else {
        resultMessage = `You lose! ${computerChoice.charAt(0).toUpperCase() + computerChoice.slice(1)} beats ${playerChoice}.`;
      }

      document.getElementById('result').textContent = resultMessage;
    }


        // Example 4: Guess a number (if / else if / else)
        const userNumInput = document.getElementById('userNum');
        const guessBtn = document.getElementById('guessBtn');
        const guessResult = document.getElementById('guessResult');
        const levelSelect = document.getElementById('level');                       
        let maxNumber;
        const  minNumber = 1;

        guessBtn.addEventListener('click', () => {
            const userNum = Number(userNumInput.value);
            if (isNaN(userNum) || userNum < minNumber || userNum > maxNumber) {
                guessResult.textContent = 'Please enter a valid number between 1 and 10.';
                guessResult.style.color = 'crimson';
                return;
            }
            const selectedLevel = levelSelect.value; 
            switch (selectedLevel) {
                case 'easy':
                    maxNumber = 5;
                    break;
                case 'normal':
                    maxNumber = 10;
                    break;
                case 'hard':
                    maxNumber = 15;
                    break;
                default:
                    guessResult.textContent = 'Please select a valid difficulty level.';
                    guessResult.style.color = 'crimson';
                    return;
            }

            const randomNum = Math.floor(Math.random() * maxNumber) + minNumber;

            // if / else if / else chain to check the guessed number
            if (userNum === randomNum) {
                guessResult.textContent = `Congratulations! You guessed it right. The number was ${randomNum}.`;
                guessResult.style.color = 'green';
            } else if (userNum < randomNum) {
                guessResult.textContent = `Too low! The correct number was ${randomNum}.`;
                guessResult.style.color = 'blue';
            } else {
                guessResult.textContent = `Too high! The correct number was ${randomNum}.`;
                guessResult.style.color = 'orange';
            }
        });

        document.getElementById("guessBtn").addEventListener("click", function () {
    const num = document.getElementById("userNum").value;

    if (!num) {
        document.getElementById("guessResult").textContent = "Please enter a number!";
    } else {
        document.getElementById("guessResult").textContent = "You guessed: " + num;
    }
});