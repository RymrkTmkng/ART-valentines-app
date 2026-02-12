const container = document.getElementById('puzzle-container');
const prizeModal = document.getElementById('prize-modal');
const closeModal = document.getElementById('close-modal');
const confettiCanvas = document.getElementById('confetti-canvas');
const ctx = confettiCanvas.getContext('2d');
const hint = document.getElementById('hint-container');

const rows = 3;
const cols = 3;
const totalTiles = rows * cols;
const imgSrc = 'timfam.jpg'; // Your puzzle image
let tiles = [];

// Resize confetti canvas
function resizeCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// --- CREATE PUZZLE TILES ---
function createTiles() {
    const containerSize = container.clientWidth;
    const tileSize = containerSize / cols;

    for (let i = 0; i < totalTiles; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.dataset.index = i;
        tile.style.width = `${tileSize}px`;
        tile.style.height = `${tileSize}px`;
        tile.style.backgroundImage = `url(${imgSrc})`;

        const row = Math.floor(i / cols);
        const col = i % cols;

        // Correct positions
        tile.dataset.correctLeft = col * tileSize;
        tile.dataset.correctTop = row * tileSize;

        // Crop background
        tile.style.backgroundSize = `${cols * 100}% ${rows * 100}%`;
        tile.style.backgroundPosition = `${(col / (cols - 1)) * 100}% ${(row / (rows - 1)) * 100}%`;

        // Random initial position
        tile.style.left = `${Math.random() * (containerSize - tileSize)}px`;
        tile.style.top = `${Math.random() * (containerSize - tileSize)}px`;

        container.appendChild(tile);
        tiles.push(tile);

        // --- MOUSE DRAG ---
        tile.addEventListener('mousedown', e => {
            e.preventDefault();

            const containerRect = container.getBoundingClientRect();
            const tileRect = tile.getBoundingClientRect();
            const offsetX = e.clientX - tileRect.left;
            const offsetY = e.clientY - tileRect.top;

            const mouseMoveHandler = e => {
                let x = e.clientX - containerRect.left - offsetX;
                let y = e.clientY - containerRect.top - offsetY;

                // Keep inside container
                x = Math.max(0, Math.min(x, containerRect.width - tileRect.width));
                y = Math.max(0, Math.min(y, containerRect.height - tileRect.height));

                tile.style.left = `${x}px`;
                tile.style.top = `${y}px`;
            };

            const mouseUpHandler = () => {
                snapAndCheck(tile);
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
            };

            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        });

        // --- TOUCH DRAG ---
        tile.addEventListener('touchstart', e => {
            e.preventDefault();

            const touch = e.touches[0];
            const containerRect = container.getBoundingClientRect();
            const tileRect = tile.getBoundingClientRect();
            const offsetX = touch.clientX - tileRect.left;
            const offsetY = touch.clientY - tileRect.top;

            const touchMoveHandler = e => {
                const touch = e.touches[0];
                let x = touch.clientX - containerRect.left - offsetX;
                let y = touch.clientY - containerRect.top - offsetY;

                x = Math.max(0, Math.min(x, containerRect.width - tileRect.width));
                y = Math.max(0, Math.min(y, containerRect.height - tileRect.height));

                tile.style.left = `${x}px`;
                tile.style.top = `${y}px`;
            };

            const touchEndHandler = () => {
                snapAndCheck(tile);
                document.removeEventListener('touchmove', touchMoveHandler);
                document.removeEventListener('touchend', touchEndHandler);
            };

            document.addEventListener('touchmove', touchMoveHandler);
            document.addEventListener('touchend', touchEndHandler);
        });
    }
}

// --- SNAP + LOCK + CHECK WIN ---
function snapAndCheck(tile) {
    const containerSize = container.clientWidth;
    const tileSize = containerSize / cols;
    const tolerance = tileSize / 3; // magnet effect

    const correctLeft = parseFloat(tile.dataset.correctLeft);
    const correctTop = parseFloat(tile.dataset.correctTop);
    const currentLeft = parseFloat(tile.style.left);
    const currentTop = parseFloat(tile.style.top);

    if (Math.abs(currentLeft - correctLeft) < tolerance &&
        Math.abs(currentTop - correctTop) < tolerance) {
        tile.style.left = `${correctLeft}px`;
        tile.style.top = `${correctTop}px`;
        tile.classList.add('locked');
    } else {
        tile.classList.remove('locked');
    }

    // Check win
    const allLocked = tiles.every(t => t.classList.contains('locked'));
    if (allLocked) showPrize();
}

// --- SHOW PRIZE MODAL + CONFETTI ---
function showPrize() {
    prizeModal.classList.remove('hidden');
    createConfetti();
    drawConfetti();
}

// --- CLOSE MODAL ---
const closeModalBtn = document.getElementById('close-modal');
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        prizeModal.classList.add('hidden');
    });
}

// --- HINT TOGGLE ---
hint.addEventListener('click', () => {
    hint.classList.toggle('big');
});

// --- CONFETTI ---
let confetti = [];
const colors = ['#FF4D6D','#FFB1B1','#FF7EB3','#FF3D7F','#FF66A3'];

function createConfetti() {
    confetti = [];
    for (let i = 0; i < 100; i++) {
        confetti.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * 30,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.floor(Math.random() * 10) - 10,
            tiltAngleIncremental: (Math.random() * 0.07) + 0.05,
            tiltAngle: 0
        });
    }
}

function drawConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    for (let i = 0; i < confetti.length; i++) {
        let c = confetti[i];
        ctx.beginPath();
        ctx.lineWidth = c.r / 2;
        ctx.strokeStyle = c.color;
        ctx.moveTo(c.x + c.tilt + c.r / 4, c.y);
        ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 4);
        ctx.stroke();
    }
    for (let i = 0; i < confetti.length; i++) {
        let c = confetti[i];
        c.tiltAngle += c.tiltAngleIncremental;
        c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
        c.x += Math.sin(c.d);
        c.tilt = Math.sin(c.tiltAngle) * 15;
        if (c.y > confettiCanvas.height) {
            c.x = Math.random() * confettiCanvas.width;
            c.y = -10;
        }
    }
    requestAnimationFrame(drawConfetti);
}

// --- INITIALIZE ---
createTiles();
