// USMLEwise Presentation JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentSlideEl = document.getElementById('currentSlide');
    const totalSlidesEl = document.getElementById('totalSlides');
    const progressFill = document.getElementById('progressFill');
    
    // State
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Initialize
    function init() {
        totalSlidesEl.textContent = totalSlides;
        updateSlide();
        setupKeyboardNavigation();
        setupTouchNavigation();
        animateCurrentSlide();
    }
    
    // Update slide display
    function updateSlide() {
        // Update slide visibility
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === currentSlide) {
                slide.classList.add('active');
            }
        });
        
        // Update counter
        currentSlideEl.textContent = currentSlide + 1;
        
        // Update progress bar
        const progress = ((currentSlide + 1) / totalSlides) * 100;
        progressFill.style.width = `${progress}%`;
        
        // Update button states
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;
        
        // Trigger animations for current slide
        animateCurrentSlide();
    }
    
    // Navigate to next slide
    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlide();
        }
    }
    
    // Navigate to previous slide
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlide();
        }
    }
    
    // Go to specific slide
    function goToSlide(index) {
        if (index >= 0 && index < totalSlides) {
            currentSlide = index;
            updateSlide();
        }
    }
    
    // Keyboard navigation
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            switch(e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                case 'PageDown':
                    e.preventDefault();
                    nextSlide();
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    prevSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    goToSlide(totalSlides - 1);
                    break;
            }
        });
    }
    
    // Touch/swipe navigation
    function setupTouchNavigation() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        document.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        document.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swiped left - next slide
                    nextSlide();
                } else {
                    // Swiped right - previous slide
                    prevSlide();
                }
            }
        }
    }
    
    // Animate elements in current slide
    function animateCurrentSlide() {
        const activeSlide = slides[currentSlide];
        
        // Animate stat numbers with counting effect
        const statNumbers = activeSlide.querySelectorAll('.stat-number[data-value]');
        statNumbers.forEach(el => {
            const targetValue = parseInt(el.dataset.value);
            animateNumber(el, 0, targetValue, 1500);
        });
        
        // Animate comparison bars
        const bars = activeSlide.querySelectorAll('.bar-fill');
        bars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 300);
        });
    }
    
    // Animate number counting
    function animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(start + (end - start) * easeOut);
            
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
    
    // Button click handlers
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Click on slide to advance (optional)
    slides.forEach(slide => {
        slide.addEventListener('click', function(e) {
            // Don't advance if clicking on a link or button
            if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
                // Only advance if clicking on the right half of the slide
                const slideRect = slide.getBoundingClientRect();
                const clickX = e.clientX - slideRect.left;
                
                if (clickX > slideRect.width / 2) {
                    nextSlide();
                } else if (clickX < slideRect.width / 3) {
                    prevSlide();
                }
            }
        });
    });
    
    // Initialize the presentation
    init();
    
    // Expose navigation functions globally for potential external control
    window.presentationNav = {
        next: nextSlide,
        prev: prevSlide,
        goTo: goToSlide,
        current: () => currentSlide,
        total: () => totalSlides
    };
});

// Fullscreen toggle (optional)
document.addEventListener('keydown', function(e) {
    if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen not available:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
});
