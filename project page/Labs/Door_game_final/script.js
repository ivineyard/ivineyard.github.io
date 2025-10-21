
const CLOSED_IMG = 'closed_door.svg';
const BOT_IMG = 'robot.svg';
const SAFE_IMAGES = ['beach.svg', 'space.svg'];


const doorsContainer = document.getElementById('doors');
const difficultySelect = document.getElementById('difficulty');
const currentStreakEl = document.getElementById('current-streak');
const bestStreakEl = document.getElementById('best-streak');
const messageEl = document.getElementById('message');
const startButton = document.getElementById('start-button');


let doors = [];
let botPositions = [];
let openedSafeDoorsCount = 0;
let currentlyPlaying = false;
let currentStreak = 0;
let bestStreak = 0;


function updateScoreboard() {
    currentStreakEl.textContent = `Current streak: ${currentStreak}`;
    bestStreakEl.textContent = `Highest streak (this session): ${bestStreak}`;
}


function setupDoors() {
    const diff = difficultySelect.value;
    doorsContainer.innerHTML = '';
    let doorCount = diff === 'hard' ? 4 : 3;
    for (let i = 0; i < doorCount; i++) {
        const img = document.createElement('img');
        img.className = 'door';
        img.dataset.index = i;
        img.src = CLOSED_IMG;
        img.alt = `Door ${i + 1}`;
        img.dataset.open = 'false';
        img.addEventListener('click', handleDoorClick);
        doorsContainer.appendChild(img);
    }
    doors = Array.from(document.querySelectorAll('.door'));
}


function placeBots() {
    const diff = difficultySelect.value;
    let doorCount = doors.length;
    let botCount = diff === 'easy' ? 1 : diff === 'medium' ? 2 : 3;
    botPositions = [];
    while (botPositions.length < botCount) {
        let rand = Math.floor(Math.random() * doorCount);
        if (!botPositions.includes(rand)) botPositions.push(rand);
    }
    doors.forEach((d, i) => {
        if (botPositions.includes(i)) {
            d.dataset.reveal = BOT_IMG;
        } else {
            d.dataset.reveal = SAFE_IMAGES[Math.floor(Math.random() * SAFE_IMAGES.length)];
        }
    });
}


function resetRound() {
    setupDoors();
    openedSafeDoorsCount = 0;
    currentlyPlaying = true;
    messageEl.textContent = 'Round started — avoid the Bots!';
    placeBots();
}


function revealAll() {
    doors.forEach(d => {
        if (d.dataset.open !== 'true') {
            d.src = d.dataset.reveal;
            d.dataset.open = 'true';
            d.setAttribute('aria-disabled', 'true');
        }
    });
}


function handleDoorClick(e) {
    if (!currentlyPlaying) return;
    const door = e.currentTarget;
    if (door.dataset.open === 'true') return;


    const idx = parseInt(door.dataset.index, 10);
    door.src = door.dataset.reveal;
    door.dataset.open = 'true';
    door.setAttribute('aria-disabled', 'true');


    if (botPositions.includes(idx)) {
        currentlyPlaying = false;
        messageEl.textContent = 'You ran into a Bot — you lost this round!';
        currentStreak = 0;
        updateScoreboard();
        revealAll();
    } else {
        openedSafeDoorsCount++;
        if (openedSafeDoorsCount === doors.length - botPositions.length) {
            currentlyPlaying = false;
            currentStreak++;
            if (currentStreak > bestStreak) bestStreak = currentStreak;
            updateScoreboard();
            messageEl.textContent = 'You win! You avoided all the Bots!';
            revealAll();
        } else {
            messageEl.textContent = `Safe! ${openedSafeDoorsCount} door(s) opened.`;
        }
    }
}


// Theme + Font Size controls
const toggleThemeBtn = document.getElementById('toggle-theme');
const fontSlider = document.getElementById('font-slider');


toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
});


fontSlider.addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--font-size', `${e.target.value}px`);
});


// start
startButton.addEventListener('click', resetRound);
updateScoreboard();
setupDoors();
placeBots();