/**
 * Venus Skincare - Header and Navigation Module
 * This module exports the header initialization function for use in other pages
 */

// Export initHeader for use in other pages (category pages, etc.)
export function initHeader() {
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');

    if (!header) return;

    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger?.addEventListener('click', () => {
        mobileMenu?.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close mobile menu function
    const close = () => {
        mobileMenu?.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeMenu?.addEventListener('click', close);
    mobileMenu?.querySelector('.mobile-menu__overlay')?.addEventListener('click', close);
    document.querySelectorAll('.mobile-menu__link').forEach(link => {
        link.addEventListener('click', close);
    });
}
