document.addEventListener('DOMContentLoaded', () => {
    initStickmanAnimation();
    createFloatingHearts();
});

function initStickmanAnimation() {
    const container = document.getElementById('stickman-animation');
    
    // SVG Stickman - A simple but elegant stick figure holding a heart
    const stickmanSVG = `
        <svg width="200" height="250" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
            <!-- Body Parts -->
            <g id="stickman" stroke="white" stroke-width="3" fill="none" stroke-linecap="round">
                <!-- Head -->
                <circle cx="50" cy="20" r="10" />
                <!-- Body -->
                <line x1="50" y1="30" x2="50" y2="70" />
                <!-- Arms -->
                <line id="left-arm" x1="50" y1="40" x2="30" y2="55" />
                <line id="right-arm" x1="50" y1="40" x2="70" y2="55" />
                <!-- Legs -->
                <line x1="50" y1="70" x2="35" y2="100" />
                <line x1="50" y1="70" x2="65" y2="100" />
            </g>
            
            <!-- Heart Object -->
            <path id="gift-heart" d="M50 55 C50 55 45 45 35 45 C25 45 25 60 50 75 C75 60 75 45 65 45 C55 45 50 55 50 55" 
                  fill="#EF4444" stroke="#EF4444" stroke-width="1">
                <animateTransform attributeName="transform" type="scale" values="1;1.2;1" dur="1s" repeatCount="indefinite" additive="sum" transform-origin="50 60" />
            </path>
        </svg>
    `;
    
    container.innerHTML = stickmanSVG;

    // Add CSS Animation to Stickman group
    const style = document.createElement('style');
    style.textContent = `
        #stickman {
            animation: sway 3s ease-in-out infinite;
            transform-origin: 50px 100px;
        }
        @keyframes sway {
            0%, 100% { transform: rotate(-5deg); }
            50% { transform: rotate(5deg); }
        }
        #left-arm, #right-arm {
            animation: wave 2s ease-in-out infinite;
        }
        @keyframes wave {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
    `;
    document.head.appendChild(style);
}

function createFloatingHearts() {
    const container = document.querySelector('.floating-hearts');
    const heartCount = 25;

    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '❤️';
        
        // Randomize position and animation
        const startLeft = Math.random() * 100;
        const animationDuration = 4 + Math.random() * 6;
        const animationDelay = Math.random() * 5;
        const fontSize = 1 + Math.random() * 1.5;

        heart.style.left = `${startLeft}vw`;
        heart.style.animationDuration = `${animationDuration}s`;
        heart.style.animationDelay = `${animationDelay}s`;
        heart.style.fontSize = `${fontSize}rem`;

        container.appendChild(heart);
    }
}
