// Canvas Animation
const canvas = document.getElementById('logoCanvas');
const ctx = canvas.getContext('2d');

// Set canvas resolution
const dpr = window.devicePixelRatio || 1;
const rect = canvas.getBoundingClientRect();
canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;
ctx.scale(dpr, dpr);

// Animation variables
let animationFrame = 0;
const textSize = 40;
const text = 'KKU';

// Get the actual display dimensions
const displayWidth = rect.width;
const displayHeight = rect.height;

// Function to draw the animated text
function drawAnimatedText() {
    // Clear canvas
    ctx.fillStyle = 'transparent';
    ctx.clearRect(0, 0, displayWidth, displayHeight);

    // Calculate HSL color from animation frame
    const hue = (animationFrame % 360);
    const saturation = 100;
    const lightness = 50;

    // Set text properties
    ctx.font = `bold ${textSize}px 'Sarabun', sans-serif`;
    ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw text in center of canvas
    const centerX = displayWidth / 2;
    const centerY = displayHeight / 2;
    ctx.fillText(text, centerX, centerY);

    // Increment animation frame
    animationFrame += 2;

    // Request next animation frame
    requestAnimationFrame(drawAnimatedText);
}

// Start the animation
drawAnimatedText();

// Handle window resize to maintain canvas resolution
window.addEventListener('resize', () => {
    const newRect = canvas.getBoundingClientRect();
    canvas.width = newRect.width * dpr;
    canvas.height = newRect.height * dpr;
    ctx.scale(dpr, dpr);
});

// Form handling
const form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', function(e) {
        // The form will be submitted to Web3Forms
        // You can add custom validation or analytics here if needed
        console.log('Form submitted');
    });
}
