// === Grab elements ===
const speedControl = document.getElementById('speedControl');
const heightControl = document.getElementById('heightControl');
const toggleBtn = document.getElementById('toggleAnimation');
const toggleDirection = document.getElementById('toggleDirection');
const toggleMode = document.getElementById('toggleMode');
const rainbow = document.querySelector('.line_contain');
const root = document.documentElement;

const resetBtn = document.getElementById('resetBtn');
const fontSizeSlider = document.getElementById('fontSizeSlider');
const speedIndicator = document.getElementById('speedIndicator');
const colorPicker = document.getElementById('colorPicker');
const animationProgress = document.getElementById('animationProgress');

// === Defaults ===
let isPaused = false;
let isReversed = false;
let darkMode = false;

const defaultSettings = {
  speed: 15,
  height: 100,
  bgColor: '#ffffff',
  textColor: '#000000',
  fontSize: 16,
  rainbowColors: 'red, orange, yellow, green, blue, indigo, violet, red'
};

// === Helper: safely set speed ===
function setSpeed(val) {
  const min = parseFloat(speedControl.min) || 5;
  const max = parseFloat(speedControl.max) || 30;
  let newVal = parseFloat(val);
  if (newVal < min) newVal = min;
  if (newVal > max) newVal = max;

  speedControl.value = newVal;
  root.style.setProperty('--rainbow-speed', `${newVal}s`);

  if (speedIndicator) speedIndicator.textContent = `Speed: ${newVal}s`;
  // trigger input event in case any other listeners depend on it
  speedControl.dispatchEvent(new Event('input'));
}

// === Controls wiring ===
speedControl.addEventListener('input', () => {
  root.style.setProperty('--rainbow-speed', `${speedControl.value}s`);
  if (speedIndicator) speedIndicator.textContent = `Speed: ${speedControl.value}s`;
});

heightControl.addEventListener('input', () => {
  rainbow.style.height = `${heightControl.value}px`;
});

// Pause/Play
let baseTime = performance.now();
let pausedAt = null;
let pausedProgress = 0;

toggleBtn.addEventListener('click', () => {
  if (!isPaused) {
    pausedAt = performance.now();
    rainbow.style.animationPlayState = 'paused';
    toggleBtn.textContent = 'Play';
    isPaused = true;
  } else {
    const delta = performance.now() - pausedAt;
    baseTime += delta;
    pausedAt = null;
    rainbow.style.animationPlayState = 'running';
    toggleBtn.textContent = 'Pause';
    isPaused = false;
  }
});

// Reverse Direction
toggleDirection.addEventListener('click', () => {
  isReversed = !isReversed;
  root.style.setProperty('--rainbow-direction', isReversed ? 'reverse' : 'normal');
  toggleDirection.textContent = isReversed ? 'Normal Direction' : 'Reverse Direction';
});

// Dark/Light Mode
toggleMode.addEventListener('click', () => {
  darkMode = !darkMode;
  root.style.setProperty('--bg-color', darkMode ? '#000000' : '#ffffff');
  root.style.setProperty('--text-color', darkMode ? '#ffffff' : '#000000');
  toggleMode.textContent = darkMode ? 'Light Mode' : 'Dark Mode';
});

// Reset All
resetBtn.addEventListener('click', () => {
  setSpeed(defaultSettings.speed);
  heightControl.value = defaultSettings.height;
  rainbow.style.height = `${defaultSettings.height}px`;
  document.body.style.fontSize = `${defaultSettings.fontSize}px`;
  root.style.setProperty('--bg-color', defaultSettings.bgColor);
  root.style.setProperty('--text-color', defaultSettings.textColor);
  root.style.setProperty('--rainbow-colors', defaultSettings.rainbowColors);

  if (isPaused) toggleBtn.click();
  if (isReversed) toggleDirection.click();
  if (darkMode) toggleMode.click();

  animationProgress.value = 0;
  baseTime = performance.now();
});

// Font Size
fontSizeSlider.addEventListener('input', (e) => {
  document.body.style.fontSize = `${e.target.value}px`;
});

// Color Picker
colorPicker.addEventListener('input', (e) => {
  const color = e.target.value;
  root.style.setProperty('--rainbow-colors', `${color}, orange, yellow, green, blue, indigo, violet, ${color}`);
});

// === Animation Progress Bar ===
function progressLoop(now) {
  if (!pausedAt) {
    const duration = parseFloat(speedControl.value) * 1000;
    const elapsed = (now - baseTime) % duration;
    const percent = (elapsed / duration) * 100;
    animationProgress.value = percent;
    pausedProgress = percent;
  } else {
    animationProgress.value = pausedProgress;
  }
  requestAnimationFrame(progressLoop);
}
requestAnimationFrame(progressLoop);

// === Keyboard Shortcuts ===
document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();

  if (key === ' ') e.preventDefault(); // stop space from scrolling

  switch (key) {
    case ' ':
      toggleBtn.click();
      break;

    case 'w': // Faster
      setSpeed(parseFloat(speedControl.value) - 1);
      break;

    case 's': // Slower
      setSpeed(parseFloat(speedControl.value) + 1);
      break;

    case 'd':
      toggleMode.click();
      break;

    case 'r':
      toggleDirection.click();
      break;

    case 'c':
      resetBtn.click();
      break;
  }
});

// === Initialize ===
setSpeed(speedControl.value);













