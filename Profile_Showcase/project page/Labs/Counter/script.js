
let count = 0;
const counterDisplay = document.getElementById('counter');
const body = document.body;

// Update counter display and color
function updateDisplay() {
    counterDisplay.textContent = count;
    if (count > 0) {
        counterDisplay.style.color = 'green';
    } else if (count < 0) {
        counterDisplay.style.color = 'red';
    } else {
        counterDisplay.style.color = '';
    }
}

function beep() {
    let ctx = new (window.AudioContext || window.webkitAudioContext)();
    let oscillator = ctx.createOscillator();
    oscillator.type = "square";   // square wave sounds more "beep-like"
    oscillator.frequency.value = 440; // 440 Hz = A4 note
    oscillator.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.2); // play for 0.2 sec
}

function playDing() {
      let ctx = new (window.AudioContext || window.webkitAudioContext)();
      let oscillator = ctx.createOscillator();
      let gain = ctx.createGain();
      oscillator.type = "sine";          // smooth sine wave
      oscillator.frequency.value = 880;  // pitch of the "ding"
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      // fade out smoothly
      gain.gain.setValueAtTime(1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 1); // 1 second long
    }

// Add button
document.getElementById('addBtn').addEventListener('click', () => {
    count++;
    updateDisplay();
    playDing();
});

// Decrease button
document.getElementById('decreaseBtn').addEventListener('click', () => {
    count--;
    updateDisplay();
    beep();
});

// Reset button
document.getElementById('resetBtn').addEventListener('click', () => {
    count = 0;
    updateDisplay();
    beep();
});

// Light/Dark mode toggle
document.getElementById('toggleModeBtn').addEventListener('click', () => {
    body.classList.toggle('dark');
    playDing();
});

// Initialize display
updateDisplay();