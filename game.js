/* ---------- DOM ---------- */
const cover = document.getElementById('cover');
const home = document.getElementById('home');
const game = document.getElementById('game');
//button elements
const playBtn = document.getElementById('playBtn');
const singleBtn = document.getElementById('singleBtn');
const multiBtn = document.getElementById('multiBtn');
const startBtn = document.getElementById('startBtn');
const submitBtn = document.getElementById('submitBtn');
//menu elements
const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
const howBtn = document.getElementById('howBtn');
const aboutBtn = document.getElementById('aboutBtn');
const homeBtn = document.getElementById('homeBtn');
// home and registration elements 
const homeTitle = document.getElementById('homeTitle');
const modeButtons = document.getElementById('modeButtons');
const registration = document.getElementById('registration');
const p1Input = document.getElementById('p1Input');
const p2Input = document.getElementById('p2Input');
//score and turn elements
const p1Score = document.getElementById('p1Score');
const p2Score = document.getElementById('p2Score');
const turnEl = document.getElementById('turn');
const roundEl = document.getElementById('round');
const placementArea = document.getElementById('placement-area');
const poolEl = document.getElementById('pool');

/* ---------- GAME DATA ---------- */
const images = [
    'pics/bigteeth.jpg','pics/chinpoint.jpg','pics/flirty.jpg',
    'pics/floewerteeth.jpg','pics/gahaman.jpg','pics/happy.jpg',
    'pics/inlove.jpg','pics/pacute.jpg','pics/shhkindat.jpg','pics/thinking.jpg'
];

let players = [];
let scores = [0,0];
let currentPlayer = 0;
let round = 1;
let mode = '';
let hidden = [], pool = [], placement = [], locked = [];
let selectedImage = null;
let aiThinking = false;

/* ---------- HELPERS ---------- */
const shuffle = a => a.sort(() => Math.random() - 0.5);
const show = s => {
    [cover,home,game].forEach(x=>x.classList.remove('active'));
    s.classList.add('active');
};

/* ---------- MENU ---------- */
menuBtn.onclick = () => menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
howBtn.onclick = () => alert('Each round has empty slots and a set of emoji choices. Your goal is to guess the correct positions of the emojis to earn points. When you place an emoji in the correct position, you earn points and the emoji stays in the slot. If the placement is wrong, the emoji returns to the choices. The game continues through all rounds until Round 3. Good luck!');
aboutBtn.onclick = () => alert(
  'The Emoji Guessing Game is a fun and easy \'game\' where players match silly face emojis to the correct empty boxes by tapping.\n' +
  'The boxes at the top have no emojis, while the emojis are shown below. Players must guess where each emoji should be placed by tapping the emoji and the correct box.\n' +
  'The goal of the game is to guess correctly and enjoy matching the silly emoji faces.\n\n' +
  'Created by Group CaFe:\n' +
  'Grace Camacho\n' +
  'Elisha Fernandez\n' +
  'Clarence Cabatay'
);

homeBtn.onclick = () => location.reload();

/* ---------- FLOW ---------- */
playBtn.onclick = () => show(home);

singleBtn.onclick = () => {
    mode = 'single';
    homeTitle.textContent = 'Enter Name';
    modeButtons.style.display = 'none';
    registration.style.display = 'block';
    p2Input.style.display = 'none';
};

multiBtn.onclick = () => {
    mode = 'multi';
    homeTitle.textContent = 'Enter Names';
    modeButtons.style.display = 'none';
    registration.style.display = 'block';
    p2Input.style.display = 'block';
};

startBtn.onclick = () => {
    if (!p1Input.value.trim()) { alert("Player 1 name is required!"); return; }
    if (mode==='multi' && !p2Input.value.trim()) { alert("Player 2 name is required!"); return; }

    players = [
        p1Input.value.trim(),
        mode === 'single' ? 'Computer' : p2Input.value.trim()
    ];
    show(game);
    initRound();
};

/* ---------- ROUND ---------- */
function initRound() {
    const slots = round === 1 ? 4 : round === 2 ? 6 : 8;
    shuffle(images);
    hidden = images.slice(0, slots);
    pool = [...hidden, ...images.slice(slots, slots + 2)];
    shuffle(pool);

    placement = Array(slots).fill(null);
    locked = Array(slots).fill(false);
    currentPlayer = 0;
    aiThinking = false;
    render();
}

/* ---------- RENDER ---------- */
function render() {
    p1Score.textContent = `${players[0]}: ${scores[0]}`;
    p2Score.textContent = `${players[1]}: ${scores[1]}`;
    turnEl.textContent = `${players[currentPlayer]}'s turn`;
    roundEl.textContent = `Round ${round}`;

    placementArea.innerHTML = '';
    placement.forEach((img,i)=>{
        const s=document.createElement('div');
        s.className='slot'+(locked[i]?' locked':'');
        s.dataset.index=i;
        if(img) s.innerHTML=`<img src="${img}">`;
        placementArea.appendChild(s);
    });

    poolEl.innerHTML='';
    pool.forEach(img=>{
        const p=document.createElement('div');
        p.className='image-piece';
        p.dataset.img=img;
        p.innerHTML=`<img src="${img}">`;
        poolEl.appendChild(p);
    });

    submitBtn.disabled = aiThinking;
}

/* ---------- PLAYER INPUT ---------- */
poolEl.onclick = e => {
    if (aiThinking) return;
    const p=e.target.closest('.image-piece');
    if(!p) return;
    document.querySelectorAll('.image-piece').forEach(x=>x.classList.remove('selected'));
    p.classList.add('selected');
    selectedImage=p.dataset.img;
};

placementArea.onclick = e => {
    if (aiThinking) return;
    const s=e.target.closest('.slot');
    if(!s) return;
    const i=+s.dataset.index;
    if(locked[i]) return;

    if(placement[i]){
        pool.push(placement[i]);
        placement[i]=null;
    } else if(selectedImage){
        placement[i]=selectedImage;
        pool.splice(pool.indexOf(selectedImage),1);
        selectedImage=null;
    }
    render();
};

/* ---------- SUBMIT ---------- */
submitBtn.onclick = () => {
    let wrong=false;

    placement.forEach((img,i)=>{
        if(img===hidden[i]){
            if(!locked[i]){
                scores[currentPlayer]+=10;
                locked[i]=true;
            }
        } else if(img){
            pool.push(img);
            placement[i]=null;
            wrong=true;
        }
    });

    if(wrong) currentPlayer = (currentPlayer+1)%2;

    if(mode==='single' && currentPlayer===1){
        aiThinking=true;
        render();
        setTimeout(aiTurn,1500);
        return;
    }

    if(locked.every(Boolean)){
        round++;
        if(round>3){ alert('Game Over'); location.reload(); }
        else initRound();
        return;
    }

    render();
};

/* ---------- AI TURN ---------- */
function aiTurn(){
    placement.forEach((img,i)=>{
        if(img===null && !locked[i]){
            let choice;
            if(pool.includes(hidden[i]) && Math.random()<0.1){
                choice = hidden[i];
            } else {
                choice = pool[Math.floor(Math.random()*pool.length)];
            }
            placement[i]=choice;
            pool.splice(pool.indexOf(choice),1);
        }
    });

    placement.forEach((img,i)=>{
        if(img===hidden[i]){
            if(!locked[i]){
                scores[currentPlayer]+=10;
                locked[i]=true;
            }
        } else if(img){
            pool.push(img);
            placement[i]=null;
        }
    });

    currentPlayer=0;
    aiThinking=false;

    if(locked.every(Boolean)){
        round++;
        if(round>3){ alert('Game Over'); location.reload(); }
        else initRound();
        return;
    }

    render();
}