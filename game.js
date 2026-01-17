 const images = [
            'pics/bigteeth.jpg',
            'pics/chinpoint.jpg',
            'pics/flirty.jpg',
            'pics/floewerteeth.jpg',
            'pics/gahaman.jpg',
            'pics/happy.jpg',
            'pics/inlove.jpg',
            'pics/pacute.jpg',
            'pics/shhkindat.jpg',
            'pics/thinking.jpg',
            
        ];
        let mode = '';
        let players = ['', ''];
        let currentPlayer = 0;
        let scores = [0, 0];
        let round = 1;
        let hidden = [];
        let pool = [];
        let placement = [];
        let consecutiveCorrect = 0;
        let basePoints = 10;
        let selectedImage = null;

        function showCoverPage() {
            document.getElementById('cover-page').style.display = 'flex';
            document.getElementById('homepage').style.display = 'none';
            document.getElementById('game').style.display = 'none';
            document.getElementById('menu-btn').style.display = 'none';
        }

        function showModeSelection() {
            document.getElementById('cover-page').style.display = 'none';
            document.getElementById('homepage').style.display = 'flex';
            document.getElementById('mode-selection').style.display = 'block';
            document.getElementById('registration').style.display = 'none';
            document.getElementById('game').style.display = 'none';
            document.getElementById('menu-btn').style.display = 'block';
            document.getElementById('dropdown').style.display = 'none';
            document.getElementById('how-content').style.display = 'none';
            document.getElementById('guide-content').style.display = 'none';
            document.getElementById('about-content').style.display = 'none';
        }

        function showRegistration() {
            document.getElementById('mode-selection').style.display = 'none';
            document.getElementById('registration').style.display = 'flex';
            document.getElementById('player2-name').style.display = mode === 'single' ? 'none' : 'block';
        }

        function startGame() {
            players[0] = document.getElementById('player1-name').value || 'Player 1';
            players[1] = mode === 'multi' ? (document.getElementById('player2-name').value || 'Player 2') : 'Computer';
            document.getElementById('homepage').style.display = 'none';
            document.getElementById('game').style.display = 'block';
            initRound();
        }
        // scoring
        function initRound() {
            const slots = round === 1 ? 4 : round === 2 ? 6 : 8;
            const choices = round === 1 ? 6 : round === 2 ? 8 : 10;
            hidden = [];
            pool = [];
            placement = new Array(slots).fill(null);
            for (let i = 0; i < slots; i++) {
                hidden.push(images[Math.floor(Math.random() * choices)]);
            }
            for (let i = 0; i < choices; i++) {
                pool.push(images[i]);
            }
            renderHidden();
            renderPlacement();
            renderPool();
            updateScores();
            document.getElementById('round').textContent = `Round ${round}`;
            currentPlayer = 0;
            consecutiveCorrect = 0;
            selectedImage = null;
            updateTurn();
        }

        function renderHidden() {
            const hiddenSlots = document.getElementById('hidden-slots');
            hiddenSlots.innerHTML = '';
            hidden.forEach(img => {
                const div = document.createElement('div');
                div.className = 'slot';
                const imgEl = document.createElement('img');
                imgEl.src = img;
                div.appendChild(imgEl);
                hiddenSlots.appendChild(div);
            });
        }

        function renderPlacement() {
            const placementArea = document.getElementById('placement-area');
            placementArea.innerHTML = '';
            placement.forEach((img, index) => {
                const div = document.createElement('div');
                div.className = 'slot';
                div.dataset.index = index;
                if (img) {
                    const imgEl = document.createElement('img');
                    imgEl.src = img;
                    div.appendChild(imgEl);
                }
                placementArea.appendChild(div);
            });
        }

        function renderPool() {
            const poolDiv = document.getElementById('pool');
            poolDiv.innerHTML = '';
            pool.forEach(img => {
                const div = document.createElement('div');
                div.className = 'image-piece';
                div.dataset.img = img;
                const imgEl = document.createElement('img');
                imgEl.src = img;
                div.appendChild(imgEl);
                poolDiv.appendChild(div);
            });
        }
        // scoring
        function updateScores() {
            document.getElementById('player1-score').textContent = `${players[0]}: ${scores[0]}`;
            document.getElementById('player2-score').textContent = `${players[1]}: ${scores[1]}`;
        }

        function updateTurn() {
            document.getElementById('turn').textContent = `${players[currentPlayer]}'s turn`;
        }

        function submitGuess() {
            if (placement.some(p => p === null)) {
                alert('Fill all slots before submitting!');
                return;
            }
            // scoring
            let allCorrect = true;
            placement.forEach((img, index) => {
                if (img === hidden[index]) {
                    consecutiveCorrect++;
                    scores[currentPlayer] += basePoints * Math.pow(2, consecutiveCorrect - 1);
                } else {
                    allCorrect = false;
                    placement[index] = null;
                    pool.push(img);
                }
            });
            if (!allCorrect) {
                consecutiveCorrect = 0;
                currentPlayer = (currentPlayer + 1) % 2;
                if (mode === 'single' && currentPlayer === 1) {
                    setTimeout(computerTurn, 1000);
                }
            }
            renderPlacement();
            renderPool();
            updateScores();
            updateTurn();
            if (placement.every(p => p !== null)) {
                round++;
                if (round > 3) {
                    const winner = scores[0] > scores[1] ? players[0] : scores[1] > scores[0] ? players[1] : 'Tie';
                    alert(`Game over! Winner: ${winner}`);
                } else {
                    initRound();
                }
            }
        }

        function computerTurn() {
            const emptySlots = placement.map((p, i) => p === null ? i : -1).filter(i => i !== -1);
            emptySlots.forEach(index => {
                const randomImg = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
                placement[index] = randomImg;
            });
            renderPlacement();
            renderPool();
            setTimeout(submitGuess, 500);
        }

        document.getElementById('menu-btn').addEventListener('click', () => {
            const dropdown = document.getElementById('dropdown');
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
        document.getElementById('how-btn').addEventListener('click', () => {
            document.getElementById('how-content').style.display = 'block';
            document.getElementById('guide-content').style.display = 'none';
            document.getElementById('about-content').style.display = 'none';
        });
        document.getElementById('guide-btn').addEventListener('click', () => {
            document.getElementById('how-content').style.display = 'none';
            document.getElementById('guide-content').style.display = 'block';
            document.getElementById('about-content').style.display = 'none';
        });
        document.getElementById('about-btn').addEventListener('click', () => {
            document.getElementById('how-content').style.display = 'none';
            document.getElementById('guide-content').style.display = 'none';
            document.getElementById('about-content').style.display = 'block';
        });
        document.getElementById('back-home-btn').addEventListener('click', showModeSelection);
        document.getElementById('single-player-btn').addEventListener('click', () => { mode = 'single'; showRegistration(); });
        document.getElementById('multiplayer-btn').addEventListener('click', () => { mode = 'multi'; showRegistration(); });
        document.getElementById('start-game-btn').addEventListener('click', startGame);
        document.getElementById('submit-guess-btn').addEventListener('click', submitGuess);
        document.getElementById('play-btn').addEventListener('click', showModeSelection);

        document.getElementById('pool').addEventListener('click', e => {
            if (e.target.closest('.image-piece')) {
                const piece = e.target.closest('.image-piece');
                document.querySelectorAll('.image-piece').forEach(p => p.classList.remove('selected'));
                piece.classList.add('selected');
                selectedImage = piece.dataset.img;
            }
        });

        document.getElementById('placement-area').addEventListener('click', e => {
            if (e.target.closest('.slot') && selectedImage) {
                const slot = e.target.closest('.slot');
                const index = parseInt(slot.dataset.index);
                if (placement[index] === null) {
                    placement[index] = selectedImage;
                    pool.splice(pool.indexOf(selectedImage), 1);
                    selectedImage = null;
                    document.querySelectorAll('.image-piece').forEach(p => p.classList.remove('selected'));
                    renderPlacement();
                    renderPool();
                }
            }
        });

        showCoverPage();
    