/**
 * Venus Skincare - Machine Detail Page
 * Image carousel with auto-slide, swipe gestures, and dot navigation
 */

import gsap from 'gsap';

// ==================== IMAGE CAROUSEL ====================
class ImageCarousel {
    constructor(container) {
        if (!container) return;

        this.container = container;
        this.slides = container.querySelectorAll('.carousel__slide');
        this.dots = container.querySelectorAll('.carousel__dot');
        this.currentIndex = 0;
        this.slideCount = this.slides.length;
        this.autoSlideInterval = 4000; // 4 seconds
        this.intervalId = null;
        this.isPaused = false;

        // Swipe tracking
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.minSwipeDistance = 50; // Minimum swipe distance in px

        this.init();
    }

    init() {
        // Bind dot clicks
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
                this.resetAutoSlide();
            });
        });

        // Pause on hover (desktop)
        this.container.addEventListener('mouseenter', () => {
            this.pause();
        });

        this.container.addEventListener('mouseleave', () => {
            this.resume();
        });

        // Swipe support for mobile
        this.container.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: true });
        this.container.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: true });
        this.container.addEventListener('touchend', (e) => this.onTouchEnd(e), { passive: true });

        // Start auto-slide
        this.startAutoSlide();

        // Preload images
        this.preloadImages();
    }

    onTouchStart(event) {
        this.pause();
        this.touchStartX = event.touches[0].clientX;
        this.touchStartY = event.touches[0].clientY;
    }

    onTouchMove(event) {
        this.touchEndX = event.touches[0].clientX;
        this.touchEndY = event.touches[0].clientY;
    }

    onTouchEnd(event) {
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;

        // Check if horizontal swipe is greater than vertical (to distinguish from scroll)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.minSwipeDistance) {
            if (deltaX < 0) {
                // Swipe left -> next slide
                this.nextSlide();
            } else {
                // Swipe right -> previous slide
                this.prevSlide();
            }
            this.resetAutoSlide();
        }

        // Reset touch tracking
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;

        // Resume auto-slide after delay
        setTimeout(() => this.resume(), 2000);
    }

    preloadImages() {
        this.slides.forEach(slide => {
            const img = slide.querySelector('img');
            if (img && img.loading === 'lazy') {
                // Force load lazy images
                const src = img.src;
                const preload = new Image();
                preload.src = src;
            }
        });
    }

    goToSlide(index) {
        if (index === this.currentIndex) return;

        // Determine slide direction for animation
        const direction = index > this.currentIndex ? 1 : -1;

        // Update slides
        const currentSlide = this.slides[this.currentIndex];
        const nextSlide = this.slides[index];

        // Animate out current slide
        gsap.to(currentSlide, {
            opacity: 0,
            x: -50 * direction,
            scale: 0.95,
            duration: 0.4,
            ease: 'power2.inOut',
            onComplete: () => {
                currentSlide.classList.remove('active');
                gsap.set(currentSlide, { x: 0 });
            }
        });

        // Animate in next slide
        nextSlide.classList.add('active');
        gsap.fromTo(nextSlide,
            { opacity: 0, x: 50 * direction, scale: 1.02 },
            { opacity: 1, x: 0, scale: 1, duration: 0.4, ease: 'power2.inOut' }
        );

        // Update dots
        this.dots[this.currentIndex].classList.remove('active');
        this.dots[index].classList.add('active');

        // Animate dot transition
        gsap.fromTo(this.dots[index],
            { width: 10 },
            { width: 24, duration: 0.3, ease: 'power2.out' }
        );
        gsap.to(this.dots[this.currentIndex],
            { width: 10, duration: 0.3, ease: 'power2.out' }
        );

        this.currentIndex = index;
    }

    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.slideCount;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentIndex - 1 + this.slideCount) % this.slideCount;
        this.goToSlide(prevIndex);
    }

    startAutoSlide() {
        this.intervalId = setInterval(() => {
            if (!this.isPaused) {
                this.nextSlide();
            }
        }, this.autoSlideInterval);
    }

    resetAutoSlide() {
        clearInterval(this.intervalId);
        this.startAutoSlide();
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }
}

// Initialize carousel
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('imageCarousel');
    if (carousel) {
        new ImageCarousel(carousel);
    }
});

// ==================== HEADER SCROLL EFFECT ====================
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        header?.classList.add('scrolled');
    } else {
        header?.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ==================== MOBILE MENU ====================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');

hamburger?.addEventListener('click', () => {
    mobileMenu?.classList.add('active');
    document.body.style.overflow = 'hidden';
});

function closeMobileMenu() {
    mobileMenu?.classList.remove('active');
    document.body.style.overflow = '';
}

closeMenu?.addEventListener('click', closeMobileMenu);
mobileMenu?.querySelector('.mobile-menu__overlay')?.addEventListener('click', closeMobileMenu);

// ==================== GSAP ANIMATIONS ====================
// Animate hero on load
gsap.fromTo('.machine-hero__header',
    { opacity: 0, y: -20 },
    { opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: 'power2.out' }
);

gsap.fromTo('.machine-hero__carousel-wrapper',
    { opacity: 0, scale: 0.95 },
    { opacity: 1, scale: 1, duration: 0.6, delay: 0.2, ease: 'power2.out' }
);

gsap.fromTo('.machine-hero__price',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5, delay: 0.4, ease: 'power2.out' }
);

gsap.fromTo('.machine-hero__details',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5, delay: 0.5, ease: 'power2.out' }
);

console.log('Venus Skincare Machine Detail page initialized');

