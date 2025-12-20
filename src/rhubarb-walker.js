// Rhubarb Walker Web Component
class RhubarbWalker extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isAnimating = false;
        this.animationId = null;
        this.lastActivity = Date.now();
        this.animationSpeed = 0.5; // Even slower speed
        this.direction = 'left-to-right'; // Animation direction
        this.position = window.innerWidth + 100; // Start off-screen right
        this.isPaused = false;
        this.inactivityTimer = null;
    }

    toggleDirection() {
        this.direction = this.direction === 'right-to-left' ? 'left-to-right' : 'right-to-left';
        this.updateImages();
        this.addSpinAnimation();
        this.initializePosition();
    }

    updateImages() {
        const body = this.shadowRoot.querySelector('.body');
        const leftLeg = this.shadowRoot.querySelector('.leg-left');
        const rightLeg = this.shadowRoot.querySelector('.leg-right');
        
        if (this.direction === 'left-to-right') {
            body.style.setProperty('--body-image', "url('/left-rhubarb-body.png')");
            body.style.left = '50%';
            body.style.transform = 'translateX(-50%)';
            leftLeg.style.setProperty('--leg-left-image', "url('/rhubarb-leg-left.png')");
            rightLeg.style.setProperty('--leg-right-image', "url('/rhubarb-leg-right.png')");
            // Reset legs positioning
            leftLeg.parentElement.style.left = '50%';
            leftLeg.parentElement.style.transform = 'translateX(-50%)';
        } else {
            body.style.setProperty('--body-image', "url('/rhubarb-body.png')");
            body.style.left = '52%';
            body.style.transform = 'translateX(-52%)';
            leftLeg.style.setProperty('--leg-left-image', "url('/rhubarb-leg-left.png')");
            rightLeg.style.setProperty('--leg-right-image', "url('/rhubarb-leg-right.png')");
            // Legs positioned directly under body center
            leftLeg.parentElement.style.left = '49%';
            leftLeg.parentElement.style.transform = 'translateX(-49%)';
        }
    }

    addSpinAnimation() {
        const body = this.shadowRoot.querySelector('.body');
        body.classList.add('spinning');
        setTimeout(() => {
            body.classList.remove('spinning');
        }, 600);
    }

    initializePosition() {
        if (this.direction === 'right-to-left') {
            this.position = window.innerWidth + 100;
        } else {
            this.position = -100;
        }
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.updateImages();
        this.initializePosition();
        this.startAnimation();
    }

    disconnectedCallback() {
        this.stopAnimation();
        this.removeEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 160px;
                    pointer-events: none;
                    z-index: 9999;
                    overflow: hidden;
                }
                
                .walker-container {
                    position: absolute;
                    bottom: 20px;
                    width: 100px;
                    height: 140px;
                    transition: transform 0.1s linear;
                }
                
                .rhubarb-walker {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    display: flex;
                    align-items: flex-end;
                }
                
                .body {
                    width: 80px;
                    height: 100px;
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    bottom: 15px;
                    z-index: 2;
                    cursor: pointer;
                    pointer-events: auto;
                    background-image: var(--body-image, url('/rhubarb-body.png'));
                }
                
                .body:hover {
                    filter: brightness(1.1) drop-shadow(0 0 8px rgba(199, 62, 58, 0.5));
                    transform: translateX(-50%) scale(1.05);
                }
                
                .spinning {
                    animation: spin 0.6s ease-in-out;
                }
                
                @keyframes spin {
                    0% { transform: translateX(-50%) rotateY(0deg); }
                    50% { transform: translateX(-50%) rotateY(180deg); }
                    100% { transform: translateX(-50%) rotateY(360deg); }
                }
                
                .legs {
                    position: absolute;
                    bottom: 0px;
                    width: 60px;
                    height: 50px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    justify-content: space-between;
                }
                
                .leg {
                    width: 25px;
                    height: 50px;
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                    transition: transform 0.1s ease-in-out;
                }
                
                .leg-left {
                    background-image: var(--leg-left-image, url('/rhubarb-leg-left.png'));
                }
                
                .leg-right {
                    background-image: var(--leg-right-image, url('/rhubarb-leg-right.png'));
                }
                
                .leg-walking-left {
                    transform: rotate(-10deg) translateY(-3px);
                }
                
                .leg-walking-right {
                    transform: rotate(10deg) translateY(-3px);
                }
                
                .shadow {
                    position: absolute;
                    bottom: -5px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 80px;
                    height: 10px;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 50%;
                    filter: blur(5px);
                }
                
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                
                .bouncing {
                    animation: bounce 0.6s ease-in-out infinite;
                }
            </style>
            
            <div class="walker-container">
                <div class="rhubarb-walker">
                    <div class="body"></div>
                    <div class="legs">
                        <div class="leg leg-left"></div>
                        <div class="leg leg-right"></div>
                    </div>
                    <div class="shadow"></div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Mouse movement detection
        this.mouseMoveHandler = () => {
            this.lastActivity = Date.now();
            if (this.isPaused) {
                this.resumeAnimation();
            }
        };

        // Click detection
        this.clickHandler = () => {
            this.lastActivity = Date.now();
        };

        // Touch detection for mobile
        this.touchHandler = () => {
            this.lastActivity = Date.now();
        };

        // Click to reverse direction
        this.clickBodyHandler = () => {
            this.toggleDirection();
        };

        document.addEventListener('mousemove', this.mouseMoveHandler);
        document.addEventListener('click', this.clickHandler);
        document.addEventListener('touchstart', this.touchHandler);
        
        // Add click listener to body
        setTimeout(() => {
            const body = this.shadowRoot.querySelector('.body');
            if (body) {
                body.addEventListener('click', this.clickBodyHandler);
            }
        }, 100);

        // Check for inactivity every second
        this.inactivityTimer = setInterval(() => {
            const inactiveTime = Date.now() - this.lastActivity;
            if (inactiveTime > 3000 && !this.isPaused) { // 3 seconds of inactivity
                this.pauseAnimation();
            }
        }, 1000);
    }

    removeEventListeners() {
        document.removeEventListener('mousemove', this.mouseMoveHandler);
        document.removeEventListener('click', this.clickHandler);
        document.removeEventListener('touchstart', this.touchHandler);
        
        // Remove body click listener
        const body = this.shadowRoot.querySelector('.body');
        if (body) {
            body.removeEventListener('click', this.clickBodyHandler);
        }
        
        if (this.inactivityTimer) {
            clearInterval(this.inactivityTimer);
        }
    }

    startAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.isPaused = false;
        this.animate();
    }

    stopAnimation() {
        this.isAnimating = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    pauseAnimation() {
        this.isPaused = true;
        const walker = this.shadowRoot.querySelector('.rhubarb-walker');
        const legs = this.shadowRoot.querySelectorAll('.leg');
        
        walker.classList.remove('bouncing');
        legs.forEach(leg => {
            leg.classList.remove('leg-walking-left', 'leg-walking-right');
        });
    }

    resumeAnimation() {
        if (!this.isAnimating) return;
        
        this.isPaused = false;
        this.animate();
    }

    animate() {
        if (!this.isAnimating || this.isPaused) return;

        const container = this.shadowRoot.querySelector('.walker-container');
        const walker = this.shadowRoot.querySelector('.rhubarb-walker');
        const leftLeg = this.shadowRoot.querySelector('.leg-left');
        const rightLeg = this.shadowRoot.querySelector('.leg-right');
        
        // Update position based on direction
        if (this.direction === 'right-to-left') {
            this.position -= this.animationSpeed;
        } else {
            this.position += this.animationSpeed;
        }
        container.style.transform = `translateX(${this.position}px)`;
        
        // Walking animation
        const time = Date.now() * 0.01;
        const walkCycle = Math.sin(time) > 0;
        
        if (walkCycle) {
            leftLeg.classList.add('leg-walking-left');
            rightLeg.classList.remove('leg-walking-right');
        } else {
            leftLeg.classList.remove('leg-walking-left');
            rightLeg.classList.add('leg-walking-right');
        }
        
        // Bounce animation
        walker.classList.add('bouncing');
        
        // Reset position based on direction
        const screenWidth = window.innerWidth;
        if (this.direction === 'right-to-left') {
            if (this.position < -150) {
                this.position = screenWidth + 100;
            }
        } else {
            if (this.position > screenWidth + 150) {
                this.position = -100;
            }
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// Register the custom element
customElements.define('rhubarb-walker', RhubarbWalker);

export default RhubarbWalker;
