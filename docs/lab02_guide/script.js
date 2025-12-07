// Canvas Animation - Modern Badge-Style Logo
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

// Get the actual display dimensions
const displayWidth = rect.width;
const displayHeight = rect.height;

// Function to draw the modern badge logo
function drawModernLogo() {
    // Clear canvas
    ctx.clearRect(0, 0, displayWidth, displayHeight);

    const centerX = displayWidth / 2;
    const centerY = displayHeight / 2;
    
    // Subtle wobble/tilt effect
    const wobble = Math.sin(animationFrame * 0.015) * 3;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(wobble * Math.PI / 180);

    // Draw outer glow circle with gradient
    const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 55);
    glowGradient.addColorStop(0, 'rgba(200, 90, 58, 0.15)');
    glowGradient.addColorStop(0.7, 'rgba(200, 90, 58, 0.05)');
    glowGradient.addColorStop(1, 'rgba(200, 90, 58, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(0, 0, 55, 0, Math.PI * 2);
    ctx.fill();

    // Draw main background circle with gradient
    const bgGradient = ctx.createLinearGradient(-40, -40, 40, 40);
    bgGradient.addColorStop(0, '#d97e54');
    bgGradient.addColorStop(1, '#c85a3a');
    ctx.fillStyle = bgGradient;
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.fill();

    // Draw inner highlight circle
    const highlightGradient = ctx.createRadialGradient(-15, -15, 0, 0, 0, 60);
    highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = highlightGradient;
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.fill();

    // Draw decorative top arc
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 50, Math.PI * 0.3, Math.PI * 0.7);
    ctx.stroke();

    // Draw decorative bottom arc
    ctx.beginPath();
    ctx.arc(0, 0, 50, Math.PI * 1.3, Math.PI * 1.7);
    ctx.stroke();

    // Draw animated rotating accent bars
    const rotationAngle = (animationFrame * 0.008) % (Math.PI * 2);
    ctx.save();
    ctx.rotate(rotationAngle);
    
    for (let i = 0; i < 3; i++) {
        const angle = (Math.PI * 2 / 3) * i;
        ctx.save();
        ctx.rotate(angle);
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(animationFrame * 0.02 + i) * 0.15})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -42);
        ctx.lineTo(0, -30);
        ctx.stroke();
        
        ctx.restore();
    }
    ctx.restore();

    // Draw "KKU" text with modern styling
    ctx.font = 'bold 28px "Sarabun", sans-serif';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Add text shadow for depth
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    
    ctx.fillText('KKU', 0, 3);
    
    // Draw decorative subtitle
    ctx.font = '10px "Sarabun", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.shadowColor = 'transparent';
    ctx.fillText('CAMPUS', 0, 20);

    ctx.restore();

    // Increment animation frame
    animationFrame += 1;

    // Request next animation frame
    requestAnimationFrame(drawModernLogo);
}

// Start the animation
drawModernLogo();

// Handle window resize to maintain canvas resolution
window.addEventListener('resize', () => {
    const newRect = canvas.getBoundingClientRect();
    canvas.width = newRect.width * dpr;
    canvas.height = newRect.height * dpr;
    ctx.scale(dpr, dpr);
});

// Add interactive effects to page elements
document.addEventListener('DOMContentLoaded', () => {
    // Add ripple effect to cards
    document.querySelectorAll('.place-card, .contact-section').forEach(element => {
        element.addEventListener('click', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.background = 'rgba(200, 90, 58, 0.6)';
            ripple.style.borderRadius = '50%';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.pointerEvents = 'none';
            ripple.style.animation = 'ripple 0.6s ease-out';
            
            element.style.position = 'relative';
            element.style.overflow = 'hidden';
            element.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add floating animation to place card images
    document.querySelectorAll('.place-card img').forEach((img, index) => {
        img.style.animation = `float 3s ease-in-out ${index * 0.5}s infinite`;
    });
});

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Add scroll reveal animation for place cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all place cards
document.querySelectorAll('.place-card').forEach(card => {
    observer.observe(card);
});

// Add keyframe animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-8px);
        }
    }
    
    @keyframes ripple {
        to {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
    
    input[type="text"],
    input[type="url"],
    textarea {
        transition: all 0.3s ease;
    }
    
    .place-card {
        animation: slideInUp 0.6s ease-out backwards;
    }
    
    .place-card:nth-child(1) { animation-delay: 0s; }
    .place-card:nth-child(2) { animation-delay: 0.1s; }
    .place-card:nth-child(3) { animation-delay: 0.2s; }
    .place-card:nth-child(4) { animation-delay: 0.3s; }
    
    img {
        transition: transform 0.3s ease;
    }
    
    .place-card img:hover {
        transform: scale(1.05);
    }
`;
document.head.appendChild(style);

// Form handling with loading state
const form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', function(e) {
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'กำลังส่ง...';
        submitBtn.disabled = true;
        
        // Restore button after 2 seconds
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}
