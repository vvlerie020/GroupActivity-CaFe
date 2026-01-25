/* ---------- DOM ----------  element */
const cover = document.getElementById('cover'); //show/hide the cover screen.
const home = document.getElementById('home');//Gets the Home screen and Game screen sections. 
const game = document.getElementById('game');// If removed: Page switching will break.
//button elements
const playBtn = document.getElementById('playBtn'); //Gets the Play button on the cover page.
//If removed: Clicking Play does nothing.
const singleBtn = document.getElementById('singleBtn');
const multiBtn = document.getElementById('multiBtn');//Gets mode selection buttons.If removed: You can’t select Single or Multiplayer.
const startBtn = document.getElementById('startBtn');
const submitBtn = document.getElementById('submitBtn'); //startBtn starts the game submitBtn checks the player’s guess 
// If removed: Game cannot start or progress.

//menu elements
const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu'); //ontrols the menu opening and closing. If removed: Menu won’t appear.
const howBtn = document.getElementById('howBtn');
const aboutBtn = document.getElementById('aboutBtn');

const homeTitle = document.getElementById('homeTitle'); //Changes text like “Select Mode” → “Enter Name”. If removed: Title never updates.
const modeButtons = document.getElementById('modeButtons');
const registration = document.getElementById('registration');//Shows/hides mode buttons and name inputs. If removed: UI flow breaks.
const p1Input = document.getElementById('p1Input');
const p2Input = document.getElementById('p2Input'); //Reads player names. If removed: Player names can’t be entered.
//score and turn elements
const p1Score = document.getElementById('p1Score');
const p2Score = document.getElementById('p2Score');//Displays player scores.If removed: Scores are invisible.
const turnEl = document.getElementById('turn');
const roundEl = document.getElementById('round');//shows current turn and round. If removed: Players won’t know whose turn it is.
const placementArea = document.getElementById('placement-area');
const poolEl = document.getElementById('pool');//Game board (slots) and emoji choices. If removed: The game board disappears.
const correct = document.getElementById('correct'); // the box showing correct placements per turn
/* ---------- GAME DATA ---------- */
const images = [ //List of all emoji images used in the game. If removed: Game crashes (no images).
    'pics/bigteeth.jpg', 'pics/chinpoint.jpg', 'pics/flirty.jpg',
    'pics/floewerteeth.jpg', 'pics/gahaman.jpg', 'pics/happy.jpg',
    'pics/inlove.jpg', 'pics/pacute.jpg', 'pics/shhkindat.jpg', 'pics/thinking.jpg'
];

let players = []; //Stores player names. If removed: Names won’t display.
let scores = [0, 0]; //Stores scores for Player 1 and Player 2. If removed: No scoring.
let currentPlayer = 0; //Tracks whose turn it is (0 or 1). If removed: Turns won’t switch.
let round = 1; //Tracks game round. If removed: Difficulty never changes.
let mode = ''; //Stores "single" or "multi". If removed: Game won’t know which mode to run.
let hidden = [], pool = [], placement = [], locked = []; //hidden	Correct answers, pool	Emoji choices, placement	Player guesses
//locked	Correct slots. If removed: Core game logic fails.
let selectedImage = null; //Stores the currently selected emoji.If removed: You can’t place emojis.
let aiThinking = false; //Prevents player clicking during AI turn.
/* ---------- HELPERS ---------- */
const shuffle = a => a.sort(() => Math.random() - 0.5);//Randomizes emoji order. If removed: Game becomes predictable.
const show = s => {
    [cover, home, game].forEach(x => x.classList.remove('active'));
    s.classList.add('active'); //Shows only ONE screen at a time. If removed: All screens show at once.

};
/* ---------- MENU ---------- */
menuBtn.onclick = () => menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
howBtn.onclick = () => alert('Each round has empty slots and a set of emoji choices. Your goal is to guess the correct positions of the emojis to earn points. When you place an emoji in the correct position, you earn points and the emoji stays in the slot. If the placement is wrong, the emoji returns to the choices. The game continues through all rounds until Round 3. Good luck!');
aboutBtn.onclick = () => alert(
    'The Place The Emoji is a fun and easy \'game\' where players place silly face emojis to the correct empty boxes by tapping.\n' +
    'The boxes at the top have no emojis, while the emojis are shown below. Players must guess where each emoji should be placed by tapping the emoji and the correct box.\n' +
    'The goal of the game is to guess correctly and enjoy matching the silly emoji faces.\n\n' +
    'Created by Group G.E.M Codes:\n' +
    'Grace Camacho\n' +
    'Elisha Fernandez\n' +
    'Clarence Cabatay'
);


/* ----------GAME FLOW ---------- */
playBtn.onclick = () => show(home);
// When Play button is clicked, go from Cover page → Home page. 
// If removed: Play button does nothing, user is stuck on cover.

singleBtn.onclick = () => {
    mode = 'single';
    // Set game mode to single-player. Needed for AI logic.
    homeTitle.textContent = 'Enter Name';
    // Update title to prompt user for name
    modeButtons.style.display = 'none';
    // Hide Single/Multi buttons to prevent re-selection
    registration.style.display = 'block';
    // Show name input box
    p2Input.style.display = 'none';
    // Hide Player 2 input since single-player is vs Computer
};

multiBtn.onclick = () => {
    mode = 'multi';
    // Set game mode to multiplayer
    homeTitle.textContent = 'Enter Names';
    // Update title for 2-player names
    modeButtons.style.display = 'none';
    // Hide mode buttons
    registration.style.display = 'block';
    // Show name input box
    p2Input.style.display = 'block';
    // Show Player 2 input
};

startBtn.onclick = () => {
    if (!p1Input.value.trim()) { alert("Player 1 name is required!"); return; }
    // Validate Player 1 name. Stops game if empty.
    if (mode === 'multi' && !p2Input.value.trim()) { alert("Player 2 name is required!"); return; }
    // Validate Player 2 name if multiplayer

    players = [
        p1Input.value.trim(),
        mode === 'single' ? 'Computer' : p2Input.value.trim()
    ];
    // Save player names. Single-player uses Computer as player 2

    show(game);
    // Switch to game screen

    initRound();
    // Initialize first round
};

/* ---------- ROUND ---------- */
function initRound() {
    // Prepares a new round: sets slots, hidden emojis, pool, placement, locked slots
    const slots = round === 1 ? 4 : round === 2 ? 6 : 8;
    // Round 1 = 4 slots, Round 2 = 6 slots, Round 3 = 8 slots

    shuffle(images);
    // Shuffle full emoji list for randomness

    hidden = images.slice(0, slots);
    // Correct emojis for this round

    pool = [...hidden, ...images.slice(slots, slots + 2)];
    // Add extra wrong emojis to pool to confuse players

    shuffle(pool);
    // Shuffle the pool

    placement = Array(slots).fill(null);
    // Empty array representing player guesses in slots

    locked = Array(slots).fill(false);
    // Tracks slots that have been correctly guessed

    currentPlayer = 0;
    // Player 1 starts

    aiThinking = false;
    // Allows player input

    render();
    // Update screen
}

/* ---------- RENDER ---------- */
function render() {
    // Updates all visual elements on screen
    p1Score.textContent = `${players[0]}: ${scores[0]}`;
    // Display Player 1 name + score

    p2Score.textContent = `${players[1]}: ${scores[1]}`;
    // Display Player 2 name + score

    turnEl.textContent = `${players[currentPlayer]}'s turn`;
    // Show whose turn it is

    roundEl.textContent = `Round ${round}`;
    // Display current round

    placementArea.innerHTML = '';
    // Clear old slots

    placement.forEach((img, i) => {
        const s = document.createElement('div');
        // Create new slot element
        s.className = 'slot' + (locked[i] ? ' locked' : '');
        // Add 'locked' class if correct
        s.dataset.index = i;
        // Store index for click events
        if (img) s.innerHTML = `<img src="${img}">`;
        // Display emoji if present
        placementArea.appendChild(s);
        // Add slot to placement area
    });

    poolEl.innerHTML = '';
    // Clear emoji pool

    pool.forEach(img => {
        const p = document.createElement('div');
        // Create emoji element
        p.className = 'image-piece';
        // Assign class for styling
        p.dataset.img = img;
        // Store image path
        p.innerHTML = `<img src="${img}">`;
        // Show emoji image
        poolEl.appendChild(p);
        // Add to pool area
    });

    submitBtn.disabled = aiThinking;
    // Disable submit button if AI is thinking
}

/* ---------- PLAYER INPUT ---------- */
poolEl.onclick = e => {
    if (aiThinking) return;
    // Ignore clicks while AI is thinking
    const p = e.target.closest('.image-piece');
    // Get clicked emoji
    if (!p) return;
    // Exit if click is outside emoji
    document.querySelectorAll('.image-piece').forEach(x => x.classList.remove('selected'));
    // Remove highlight from all emojis
    p.classList.add('selected');
    // Highlight selected emoji
    selectedImage = p.dataset.img;
    // Store selected emoji for placement
};

placementArea.onclick = e => {
    if (aiThinking) return;
    // Ignore clicks while AI thinking
    const s = e.target.closest('.slot');
    // Get clicked slot
    if (!s) return;
    const i = +s.dataset.index;
    // Convert slot index to number
    if (locked[i]) return;
    // Do nothing if slot already correct

    if (placement[i]) {
        // If slot already has emoji
        pool.push(placement[i]);
        // Return it to pool
        placement[i] = null;
        // Clear slot
    } else if (selectedImage) {
        placement[i] = selectedImage;
        // Place selected emoji in slot
        pool.splice(pool.indexOf(selectedImage), 1);
        // Remove emoji from pool
        selectedImage = null;
        // Reset selected emoji
    }
    render();
    // Update display
};

/* ---------- SUBMIT ---------- */
submitBtn.onclick = () => {
    let wrong = false;
    let newlyCorrect = 0; // NEW: count correct for this turn only
    const currentName = players[currentPlayer]; // NEW: store current player's name

    placement.forEach((img, i) => {
        if (img === hidden[i]) {
            if (!locked[i]) {
                scores[currentPlayer] += 10;
                locked[i] = true;
                newlyCorrect++; // increment only for newly correct
            }
        } else if (img) {
            pool.push(img);
            placement[i] = null;
            wrong = true;
        }
    });

    // NEW: Show correct placements for this turn only, with player's name
    correct.textContent = `${currentName} got ${newlyCorrect} correct!`;

    if (wrong) currentPlayer = (currentPlayer + 1) % 2;

    setTimeout(() => {
        correct.textContent = ''; // clear after showing message

        if (mode === 'single' && currentPlayer === 1) {
            aiThinking = true;
            render();
            setTimeout(aiTurn, 1500);
            return;
        }

        if (locked.every(Boolean)) {
            round++;
            if (round > 3) {
                alert('Game Over');
                location.reload();
            } else {
                initRound();
            }
            return;
        }

        render(); // update everything after delay
    }, 1000);
};

/* ---------- AI TURN ---------- */
function aiTurn() {
    let newlyCorrect = 0; // Count correct for AI turn
    const currentName = players[currentPlayer]; // Should be "Computer"

    // Computer guesses emojis
    placement.forEach((img, i) => {
        if (img === null && !locked[i]) {
            let choice;
            if (pool.includes(hidden[i]) && Math.random() < 0.1) {
                choice = hidden[i]; // Small chance to guess correctly
            } else {
                choice = pool[Math.floor(Math.random() * pool.length)]; // Random choice
            }
            placement[i] = choice;
            pool.splice(pool.indexOf(choice), 1);
        }
    });

    // Check which placements are correct
    placement.forEach((img, i) => {
        if (img === hidden[i]) {
            if (!locked[i]) {
                scores[currentPlayer] += 10;
                locked[i] = true;
                newlyCorrect++;
            }
        } else if (img) {
            pool.push(img);
            placement[i] = null;
        }
    });

    // Show message for AI turn
    correct.textContent = `${currentName} got ${newlyCorrect} correct!`;

    setTimeout(() => {
        correct.textContent = ''; // Clear after showing message
        currentPlayer = 0; // Return turn to player
        aiThinking = false;

        if (locked.every(Boolean)) {
            round++;
            if (round > 3) {
                alert('Game Over');
                location.reload();
            } else {
                initRound();
            }
            return;
        }

        render(); // Update display after AI move
    }, 1000);
}
