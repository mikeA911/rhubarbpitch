// Import CSS
import './style.css';

// Import Rhubarb Walker Component
import './rhubarb-walker.js';

// Main JavaScript for Rhubarb Landing Page

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    initSmoothScrolling();

    // Button click handlers
    initButtonHandlers();

    // Header scroll effect
    initHeaderScrollEffect();

    // Animate elements on scroll
    initScrollAnimations();
});

// Smooth Scrolling
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Scroll to the element
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Hero CTA buttons
    const heroCtas = document.querySelectorAll('.hero-ctas .btn');
    heroCtas.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = button.textContent.includes('Facility') ? 'facilities' : 'professionals';
            const targetElement = document.getElementById(targetSection);

            if (targetElement) {
                // Scroll to the section
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Button Handlers
function initButtonHandlers() {
    // CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-section .btn, .spots-remaining .btn');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            handleCtaClick(button);
        });
    });
    
    // Pricing card buttons
    const pricingButtons = document.querySelectorAll('.pricing-card .btn');
    
    pricingButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            handlePricingClick(button);
        });
    });
}

// Handle CTA clicks
function handleCtaClick(button) {
    const buttonText = button.textContent.toLowerCase();

    if (buttonText.includes('facility')) {
        // Scroll to facilities section
        const facilitiesSection = document.getElementById('facilities');
        if (facilitiesSection) {
            facilitiesSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        showNotification('Redirecting to facility signup...', 'success');
    } else if (buttonText.includes('professional')) {
        // Scroll to professionals section
        const professionalsSection = document.getElementById('professionals');
        if (professionalsSection) {
            professionalsSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        showNotification('Redirecting to professional signup...', 'success');
    } else if (buttonText.includes('founding member')) {
        // Scroll to founding members section
        const foundingSection = document.getElementById('founding');
        if (foundingSection) {
            foundingSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        showNotification('Redirecting to founding member application...', 'success');
    } else {
        showNotification('Thank you for your interest! Redirecting...', 'success');
    }
}

// Handle pricing button clicks
function handlePricingClick(button) {
    const card = button.closest('.pricing-card');
    const tierName = card.querySelector('.tier-badge').textContent;
    
    showNotification(`You've selected the ${tierName} plan. Redirecting to signup...`, 'success');
    
    // In a real application, this would redirect to the signup page with the selected tier
    setTimeout(() => {
        console.log(`Redirect to signup page with tier: ${tierName}`);
    }, 1500);
}

// Header Scroll Effect
function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add shadow when scrolled
        if (scrollTop > 10) {
            header.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Scroll Animations
function initScrollAnimations() {
    // Create intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.pricing-card, .roi-card, .earnings-card, .stage-card, .founding-tier-card, .faq-item, .about-item'
    );
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--rhubarb-green)' : 'var(--rhubarb-red)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Utility Functions

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Format numbers for display
function formatNumber(num) {
    return new Intl.NumberFormat().format(num);
}

// Calculate percentage
function calculatePercentage(value, total) {
    return Math.round((value / total) * 100);
}

// Add loading state to buttons
function addLoadingState(button, text = 'Loading...') {
    const originalText = button.textContent;
    button.textContent = text;
    button.disabled = true;
    button.style.opacity = '0.7';
    
    return () => {
        button.textContent = originalText;
        button.disabled = false;
        button.style.opacity = '1';
    };
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Allow tab navigation
    if (e.key === 'Tab') {
        return;
    }
    
    // ESC key to close notifications
    if (e.key === 'Escape') {
        const notification = document.querySelector('.notification');
        if (notification) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }
});

// Print styles support
window.addEventListener('beforeprint', () => {
    // Ensure all sections are visible for printing
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.pageBreakBefore = 'always';
    });
});

window.addEventListener('afterprint', () => {
    // Restore normal styling after printing
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.pageBreakBefore = '';
    });
});

console.log('Rhubarb Landing Page initialized successfully! 🌱');
