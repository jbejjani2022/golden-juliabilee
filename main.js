// List of images in fixed alphabetical order (excluding .DS_Store)
const imageFiles = [
  'static/1.jpg',
  'static/10.jpeg',
  'static/11.jpeg',
  'static/12.jpeg',
  'static/13.JPG',
  'static/14.jpeg',
  'static/15.jpeg',
  'static/16.jpeg',
  'static/17.jpeg',
  'static/18.JPG',
  'static/19.jpeg',
  'static/2.jpeg',
  'static/20.jpeg',
  'static/21.jpeg',
  'static/22.jpeg',
  'static/win.jpeg',
  'static/24.jpeg',
  'static/3.jpeg',
  'static/4.jpg',
  'static/5.jpeg',
  'static/6.jpeg',
  'static/7.PNG',
  'static/8.jpeg',
  'static/9.jpeg',
  'static/23.jpeg'
];

const grid = document.getElementById('grid');
const attemptsCounter = document.getElementById('attempts-counter');
const messageArea = document.getElementById('message-area');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const closeModalBtn = document.getElementById('close-modal');
const helpBtn = document.getElementById('help-btn');
const instructionsModal = document.getElementById('instructions-modal');
const instructionsText = document.getElementById('instructions-text');
const closeInstructionsBtn = document.getElementById('close-instructions');

let attempts = 0;
let maxAttempts = 5;
let revealed = Array(25).fill(false);
let gameEnded = false;
let instructionsOpen = false;

function updateAttempts() {
  attemptsCounter.textContent = `Attempts: ${attempts} / ${maxAttempts}`;
}

function showModal(imgSrc) {
  modalImg.src = imgSrc;
  modal.classList.remove('hidden');
}

function hideModal() {
  modal.classList.add('hidden');
  modalImg.src = '';
}

function showMessage(msg, btnText, btnHandler, inlineBtn = false) {
  if (btnText && inlineBtn) {
    messageArea.innerHTML = `<span>${msg}</span><button class='button inline' id='msg-btn'>${btnText}</button>`;
  } else {
    messageArea.innerHTML = `${msg}${btnText ? `<br><button class='button' id='msg-btn'>${btnText}</button>` : ''}`;
  }
  if (btnText && btnHandler) {
    document.getElementById('msg-btn').onclick = btnHandler;
  }
}

function clearMessage() {
  messageArea.innerHTML = '';
}

function resetGame() {
  attempts = 0;
  revealed = Array(25).fill(false);
  gameEnded = false;
  updateAttempts();
  clearMessage();
  renderGrid();
}

function renderGrid() {
  grid.innerHTML = '';
  for (let i = 0; i < 25; ++i) {
    const tile = document.createElement('div');
    tile.className = 'tile' + (revealed[i] ? ' flipped' : '');
    tile.dataset.idx = i;
    if (revealed[i]) {
      const img = document.createElement('img');
      img.src = imageFiles[i];
      img.className = 'thumbnail';
      img.alt = `Image ${i+1}`;
      img.onclick = (e) => {
        e.stopPropagation();
        showModal(imageFiles[i]);
      };
      tile.appendChild(img);
      tile.onclick = () => {
        if (gameEnded) return;
        showModal(imageFiles[i]);
      };
    } else {
      tile.onclick = () => {
        if (gameEnded || revealed[i]) return;
        revealed[i] = true;
        attempts++;
        renderGrid();
        updateAttempts();
        showModal(imageFiles[i]);
        if (imageFiles[i].endsWith('win.jpeg')) {
          gameEnded = true;
          setTimeout(() => {
            alert("You Win! Or do you really...you're 50 lol! Holy shit! Don't start acting old. Love, Joey.");
            showMessage('', 'Reset', () => {
              resetGame();
            });
          }, 100);
        } else if (attempts >= maxAttempts) {
          gameEnded = true;
          showMessage('You lose...play again?', 'Yes', () => {
            resetGame();
          }, true);
        }
      };
    }
    grid.appendChild(tile);
  }
}

closeModalBtn.onclick = () => {
  hideModal();
};

modal.onclick = (e) => {
  if (e.target === modal) hideModal();
};

function showInstructions() {
  // Compose instructions HTML
  instructionsText.innerHTML = `
    <h2>Welcome to the Golden Juliabilee, a celebration of Mom's 50th...</h2>
    <div style="margin: 1.2em 0 1em 0; font-size: 1.15em;">Your mission is to find the image below:</div>
    <img src="static/win.jpeg" alt="Winning Image" />
    <div style="margin-top: 1.2em; font-size: 1.08em;">You have 5 attempts...good luck!</div>
  `;
  instructionsModal.classList.remove('hidden');
  instructionsOpen = true;
}

function hideInstructions() {
  instructionsModal.classList.add('hidden');
  instructionsOpen = false;
}

helpBtn.onclick = () => {
  showInstructions();
};
closeInstructionsBtn.onclick = () => {
  hideInstructions();
};

// Show instructions modal on first load
window.addEventListener('DOMContentLoaded', () => {
  showInstructions();
});

// Initial render
updateAttempts();
renderGrid();
