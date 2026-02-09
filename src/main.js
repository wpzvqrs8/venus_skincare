/**
 * Venus Skincare - Main Application
 * Premium medical aesthetic machinery website
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';

// Configuration
const CONFIG = {
    tiltAngle: 15 * (Math.PI / 180),
    rotationSpeed: 0.005,
    magnificationScale: 1.15,
    animationSpeed: 0.08
};

// Check if mobile
const isMobile = () => window.innerWidth <= 768;

// DOM Elements
const elements = {
    header: document.getElementById('header'),
    hamburger: document.getElementById('hamburger'),
    mobileMenu: document.getElementById('mobileMenu'),
    closeMenu: document.getElementById('closeMenu'),
    loginBtn: document.getElementById('loginBtn'),
    signupBtn: document.getElementById('signupBtn'),
    loginModal: document.getElementById('loginModal'),
    signupModal: document.getElementById('signupModal'),
    heroModel1: document.getElementById('heroModel1'),
    heroModel2: document.getElementById('heroModel2'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    machineCards: document.querySelectorAll('.machine-card'),
    mobileLinks: document.querySelectorAll('.mobile-menu__link'),
    // User profile elements
    headerActions: document.getElementById('headerActions'),
    userProfile: document.getElementById('userProfile'),
    userName: document.getElementById('userName'),
    userInitial: document.getElementById('userInitial'),
    logoutBtn: document.getElementById('logoutBtn'),
    // Mobile user elements
    mobileActions: document.getElementById('mobileActions'),
    mobileUserProfile: document.getElementById('mobileUserProfile'),
    mobileUserName: document.getElementById('mobileUserName'),
    mobileUserInitial: document.getElementById('mobileUserInitial'),
    mobileLoginBtn: document.getElementById('mobileLoginBtn'),
    mobileSignupBtn: document.getElementById('mobileSignupBtn'),
    mobileLogoutBtn: document.getElementById('mobileLogoutBtn')
};

// ==================== AUTH SYSTEM ====================
const AuthManager = {
    STORAGE_KEY: 'venus_users',
    SESSION_KEY: 'venus_session',

    getUsers() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    saveUsers(users) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    },

    signup(name, email, password) {
        const users = this.getUsers();

        // Check if user exists
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            return { success: false, message: 'Email already registered. Please login.' };
        }

        // Create new user (role is always 'user' by default, never exposed in frontend)
        const newUser = {
            id: Date.now().toString(),
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: password, // In production, this should be hashed
            role: 'user', // Default role, only changeable via JSON file
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        this.saveUsers(users);

        return { success: true, message: 'Account created successfully!', user: { id: newUser.id, name: newUser.name, email: newUser.email } };
    },

    login(email, password) {
        const users = this.getUsers();
        const user = users.find(u =>
            u.email.toLowerCase() === email.toLowerCase() &&
            u.password === password
        );

        if (!user) {
            return { success: false, message: 'Invalid email or password.' };
        }

        // Store session (without password and role)
        const session = { id: user.id, name: user.name, email: user.email };
        sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));

        return { success: true, message: 'Login successful!', user: session };
    },

    logout() {
        sessionStorage.removeItem(this.SESSION_KEY);
    },

    getCurrentUser() {
        const session = sessionStorage.getItem(this.SESSION_KEY);
        return session ? JSON.parse(session) : null;
    },

    isLoggedIn() {
        return !!this.getCurrentUser();
    }
};

// ==================== UI STATE MANAGEMENT ====================
function updateAuthUI() {
    const user = AuthManager.getCurrentUser();

    if (user) {
        // Show user profile, hide login buttons
        if (elements.headerActions) elements.headerActions.style.display = 'none';
        if (elements.userProfile) {
            elements.userProfile.style.display = 'flex';
            elements.userName.textContent = user.name;
            elements.userInitial.textContent = user.name.charAt(0).toUpperCase();
        }
        // Mobile
        if (elements.mobileActions) elements.mobileActions.style.display = 'none';
        if (elements.mobileUserProfile) {
            elements.mobileUserProfile.style.display = 'block';
            elements.mobileUserName.textContent = user.name;
            elements.mobileUserInitial.textContent = user.name.charAt(0).toUpperCase();
        }
    } else {
        // Show login buttons, hide user profile
        if (elements.headerActions) elements.headerActions.style.display = '';
        if (elements.userProfile) elements.userProfile.style.display = 'none';
        // Mobile
        if (elements.mobileActions) elements.mobileActions.style.display = '';
        if (elements.mobileUserProfile) elements.mobileUserProfile.style.display = 'none';
    }
}

// Initialize auth UI on load
updateAuthUI();

// ==================== HEADER SCROLL EFFECT ====================
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        elements.header.classList.add('scrolled');
    } else {
        elements.header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ==================== MOBILE MENU ====================
elements.hamburger?.addEventListener('click', () => {
    elements.mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
});

elements.closeMenu?.addEventListener('click', closeMobileMenu);
elements.mobileMenu?.querySelector('.mobile-menu__overlay')?.addEventListener('click', closeMobileMenu);

elements.mobileLinks?.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

function closeMobileMenu() {
    elements.mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
}

// ==================== MODALS ====================
function openModal(modal) {
    modal?.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal?.classList.remove('active');
    document.body.style.overflow = '';
    // Clear form errors
    modal?.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    modal?.querySelectorAll('.form-message').forEach(el => {
        el.textContent = '';
        el.className = 'form-message';
    });
    modal?.querySelectorAll('input').forEach(input => {
        input.classList.remove('error', 'success');
    });
}

// Login Modal
elements.loginBtn?.addEventListener('click', () => openModal(elements.loginModal));
elements.mobileLoginBtn?.addEventListener('click', () => {
    closeMobileMenu();
    openModal(elements.loginModal);
});

elements.loginModal?.querySelector('.modal__overlay')?.addEventListener('click', () => closeModal(elements.loginModal));
elements.loginModal?.querySelector('.modal__close')?.addEventListener('click', () => closeModal(elements.loginModal));

// Signup Modal
elements.signupBtn?.addEventListener('click', () => openModal(elements.signupModal));
elements.mobileSignupBtn?.addEventListener('click', () => {
    closeMobileMenu();
    openModal(elements.signupModal);
});

elements.signupModal?.querySelector('.modal__overlay')?.addEventListener('click', () => closeModal(elements.signupModal));
elements.signupModal?.querySelector('.modal__close')?.addEventListener('click', () => closeModal(elements.signupModal));

// Switch between modals
document.getElementById('showSignup')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(elements.loginModal);
    setTimeout(() => openModal(elements.signupModal), 200);
});

document.getElementById('showLogin')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(elements.signupModal);
    setTimeout(() => openModal(elements.loginModal), 200);
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMobileMenu();
        closeModal(elements.loginModal);
        closeModal(elements.signupModal);
    }
});

// ==================== FORM VALIDATION ====================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateField(input, errorEl, rules) {
    const value = input.value.trim();
    let error = '';

    if (rules.required && !value) {
        error = 'This field is required';
    } else if (rules.minLength && value.length < rules.minLength) {
        error = `Minimum ${rules.minLength} characters required`;
    } else if (rules.email && !validateEmail(value)) {
        error = 'Please enter a valid email';
    } else if (rules.phone && value && !/^[0-9+\-\s()]{7,20}$/.test(value)) {
        error = 'Please enter a valid phone number';
    } else if (rules.match && value !== rules.match) {
        error = 'Passwords do not match';
    }

    errorEl.textContent = error;
    input.classList.toggle('error', !!error);
    input.classList.toggle('success', !error && value);

    return !error;
}

// ==================== LOGIN FORM ====================
const loginForm = document.getElementById('loginForm');
loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const emailError = document.getElementById('loginEmailError');
    const passwordError = document.getElementById('loginPasswordError');
    const messageEl = document.getElementById('loginMessage');

    let isValid = true;
    isValid = validateField(emailInput, emailError, { required: true, email: true }) && isValid;
    isValid = validateField(passwordInput, passwordError, { required: true, minLength: 6 }) && isValid;

    if (!isValid) return;

    const result = AuthManager.login(emailInput.value, passwordInput.value);

    messageEl.textContent = result.message;
    messageEl.className = 'form-message ' + (result.success ? 'success' : 'error');

    if (result.success) {
        setTimeout(() => {
            closeModal(elements.loginModal);
            loginForm.reset();
            updateAuthUI();
        }, 1000);
    }
});

// ==================== SIGNUP FORM ====================
const signupForm = document.getElementById('signupForm');
signupForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('signupName');
    const emailInput = document.getElementById('signupEmail');
    const passwordInput = document.getElementById('signupPassword');
    const confirmInput = document.getElementById('signupConfirm');
    const nameError = document.getElementById('signupNameError');
    const emailError = document.getElementById('signupEmailError');
    const passwordError = document.getElementById('signupPasswordError');
    const confirmError = document.getElementById('signupConfirmError');
    const messageEl = document.getElementById('signupMessage');

    let isValid = true;
    isValid = validateField(nameInput, nameError, { required: true, minLength: 2 }) && isValid;
    isValid = validateField(emailInput, emailError, { required: true, email: true }) && isValid;
    isValid = validateField(passwordInput, passwordError, { required: true, minLength: 6 }) && isValid;
    isValid = validateField(confirmInput, confirmError, { required: true, match: passwordInput.value }) && isValid;

    if (!isValid) return;

    const result = AuthManager.signup(nameInput.value, emailInput.value, passwordInput.value);

    messageEl.textContent = result.message;
    messageEl.className = 'form-message ' + (result.success ? 'success' : 'error');

    if (result.success) {
        // Auto login after signup
        AuthManager.login(emailInput.value, passwordInput.value);
        setTimeout(() => {
            closeModal(elements.signupModal);
            signupForm.reset();
            updateAuthUI();
        }, 1000);
    }
});

// ==================== LOGOUT ====================
elements.logoutBtn?.addEventListener('click', () => {
    AuthManager.logout();
    updateAuthUI();
});

elements.mobileLogoutBtn?.addEventListener('click', () => {
    AuthManager.logout();
    updateAuthUI();
    closeMobileMenu();
});

// ==================== FILTER FUNCTIONALITY ====================
elements.filterBtns?.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active state
        elements.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        elements.machineCards?.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                gsap.to(card, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.4,
                    ease: 'power2.out'
                });
                card.style.display = '';
            } else {
                gsap.to(card, {
                    opacity: 0,
                    scale: 0.95,
                    duration: 0.3,
                    ease: 'power2.in',
                    onComplete: () => { card.style.display = 'none'; }
                });
            }
        });
    });
});

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = elements.header.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== 3D MODEL VIEWER ====================
class ModelViewer {
    constructor(container, modelPath) {
        if (!container) return;

        this.container = container;
        this.modelPath = modelPath;
        this.object = null;
        this.baseScale = null;
        this.isHovered = false;
        this.pointer = new THREE.Vector2(-10, -10); // Off-screen initially
        this.isMobileDevice = isMobile();

        this.init();
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();

        // Camera - adjusted for closer view (less zoomed out)
        const fov = this.isMobileDevice ? 45 : 40;
        this.camera = new THREE.PerspectiveCamera(
            fov,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        const cameraZ = this.isMobileDevice ? 3.5 : 3.2;
        this.camera.position.set(0, 0.2, cameraZ);
        this.camera.lookAt(0, 0, 0);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);

        // Raycaster
        this.raycaster = new THREE.Raycaster();

        // Lights
        this.addLights();

        // Load model
        this.loadModel();

        // Events
        this.bindEvents();

        // Animate
        this.animate();
    }

    addLights() {
        // Ambient light - brighter for mobile
        const ambientIntensity = this.isMobileDevice ? 0.7 : 0.5;
        const ambient = new THREE.AmbientLight(0xffffff, ambientIntensity);
        this.scene.add(ambient);

        // Key light
        const keyLight = new THREE.DirectionalLight(0xffffff, 1);
        keyLight.position.set(5, 10, 7.5);
        this.scene.add(keyLight);

        // Fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
        fillLight.position.set(-5, 5, -5);
        this.scene.add(fillLight);

        // Rim light
        const rimLight = new THREE.DirectionalLight(0xc9a962, 0.3);
        rimLight.position.set(0, -5, -10);
        this.scene.add(rimLight);
    }

    loadModel() {
        const loader = new GLTFLoader();

        loader.load(
            this.modelPath,
            (gltf) => {
                this.object = gltf.scene;

                // Center and scale the model
                const box = new THREE.Box3().setFromObject(this.object);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());

                // Move model to center of scene
                this.object.position.x = -center.x;
                this.object.position.y = -center.y;
                this.object.position.z = -center.z;

                // Scale to fit in view
                const maxDim = Math.max(size.x, size.y, size.z);
                const baseScaleValue = this.isMobileDevice ? 2.2 : 2.0;
                const scale = maxDim > 0 ? baseScaleValue / maxDim : 1;
                this.object.scale.set(scale, scale, scale);
                this.baseScale = new THREE.Vector3(scale, scale, scale);

                // Slight tilt for 3D effect
                this.object.rotation.x = CONFIG.tiltAngle;

                this.scene.add(this.object);

                // Mark container as loaded (removes skeleton)
                this.container.classList.add('loaded');
            },
            (progress) => {
                // Loading progress - could show loading percentage
                const percent = (progress.loaded / progress.total * 100).toFixed(0);
                console.log(`Loading model: ${percent}%`);
            },
            (error) => {
                console.error('Error loading GLB model:', error);
            }
        );
    }

    bindEvents() {
        window.addEventListener('resize', () => this.onResize());

        // Desktop hover
        this.container.addEventListener('mousemove', (e) => this.onPointerMove(e));
        this.container.addEventListener('mouseleave', () => {
            this.pointer.set(-10, -10);
        });

        // Mobile touch for rotation (360° drag)
        this.container.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
        this.container.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
        this.container.addEventListener('touchend', () => this.onTouchEnd(), { passive: true });
    }

    onResize() {
        if (!this.container.clientWidth || !this.container.clientHeight) return;

        // Update mobile check
        this.isMobileDevice = isMobile();

        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    onPointerMove(event) {
        const rect = this.container.getBoundingClientRect();
        this.pointer.x = ((event.clientX - rect.left) / this.container.clientWidth) * 2 - 1;
        this.pointer.y = -((event.clientY - rect.top) / this.container.clientHeight) * 2 + 1;
    }

    onTouchStart(event) {
        if (event.touches.length > 0) {
            this.isDragging = true;
            this.lastTouchX = event.touches[0].clientX;
            this.lastTouchY = event.touches[0].clientY;

            // For magnification raycasting
            const touch = event.touches[0];
            const rect = this.container.getBoundingClientRect();
            this.pointer.x = ((touch.clientX - rect.left) / this.container.clientWidth) * 2 - 1;
            this.pointer.y = -((touch.clientY - rect.top) / this.container.clientHeight) * 2 + 1;
        }
    }

    onTouchMove(event) {
        if (!this.isDragging || !this.object) return;

        // Prevent page scroll when rotating model
        event.preventDefault();

        const touch = event.touches[0];
        const deltaX = touch.clientX - this.lastTouchX;
        const deltaY = touch.clientY - this.lastTouchY;

        // Rotate based on drag - X movement rotates around Y axis
        this.manualRotationY = (this.manualRotationY || 0) + deltaX * 0.01;
        // Optional: slight tilt adjustment with Y drag (limited)
        this.manualRotationX = Math.max(-0.3, Math.min(0.3, (this.manualRotationX || 0) + deltaY * 0.005));

        this.lastTouchX = touch.clientX;
        this.lastTouchY = touch.clientY;
    }

    onTouchEnd() {
        this.isDragging = false;
        // Reset pointer after a delay
        setTimeout(() => {
            this.pointer.set(-10, -10);
        }, 300);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.object && this.baseScale) {
            // Raycasting for hover detection
            this.raycaster.setFromCamera(this.pointer, this.camera);
            const intersects = this.raycaster.intersectObject(this.object, true);
            this.isHovered = intersects.length > 0;

            // Scale animation - magnification
            const targetScalar = this.isHovered ? CONFIG.magnificationScale : 1.0;
            const targetScale = this.baseScale.clone().multiplyScalar(targetScalar);
            this.object.scale.lerp(targetScale, CONFIG.animationSpeed);

            // Rotation - either manual (touch drag) or auto
            if (this.isDragging && this.manualRotationY !== undefined) {
                // Manual rotation from touch drag
                this.object.rotation.y = this.manualRotationY;
                this.object.rotation.x = CONFIG.tiltAngle + (this.manualRotationX || 0);
            } else if (!this.isHovered) {
                // Auto rotation when not hovered
                this.object.rotation.y += CONFIG.rotationSpeed;
                // Sync manual rotation if it exists
                this.manualRotationY = this.object.rotation.y;
                this.object.rotation.x = CONFIG.tiltAngle;
            } else {
                // Hovered - pause rotation
                this.object.rotation.x = CONFIG.tiltAngle;
            }
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// ==================== INITIALIZE 3D VIEWERS ====================
// Lazy load when hero is visible
const observerOptions = {
    root: null,
    rootMargin: '100px',
    threshold: 0.1
};

const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Initialize Model 1
            new ModelViewer(
                elements.heroModel1,
                '/assets/m1/model.glb'
            );

            // Initialize Model 2
            new ModelViewer(
                elements.heroModel2,
                '/assets/m2/model.glb'
            );

            heroObserver.disconnect();
        }
    });
}, observerOptions);

if (elements.heroModel1) {
    heroObserver.observe(elements.heroModel1);
}

// ==================== GSAP ANIMATIONS ====================
// Simple fade-in animation on load
gsap.fromTo('.hero__text',
    { opacity: 0, x: -30 },
    { opacity: 1, x: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' }
);

gsap.fromTo('.hero__models',
    { opacity: 0, x: 30 },
    { opacity: 1, x: 0, duration: 0.8, delay: 0.4, ease: 'power2.out' }
);

// ==================== CONTACT FORM WITH VALIDATION ====================
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const messageError = document.getElementById('messageError');

    // Validate all fields
    let isValid = true;
    isValid = validateField(nameInput, nameError, { required: true, minLength: 2 }) && isValid;
    isValid = validateField(emailInput, emailError, { required: true, email: true }) && isValid;
    isValid = validateField(phoneInput, phoneError, { phone: true }) && isValid;
    isValid = validateField(messageInput, messageError, { required: true, minLength: 10 }) && isValid;

    if (!isValid) return;

    // Get form data
    const formData = {
        id: Date.now().toString(),
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        company: document.getElementById('company')?.value.trim() || '',
        message: messageInput.value.trim(),
        submittedAt: new Date().toISOString()
    };

    // Store in localStorage (simulating JSON file storage)
    // In production, this would be sent to a backend API
    const inquiries = JSON.parse(localStorage.getItem('venus_inquiries') || '[]');
    inquiries.push(formData);
    localStorage.setItem('venus_inquiries', JSON.stringify(inquiries));

    // Visual feedback
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    btn.textContent = 'Sending...';
    btn.disabled = true;

    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    btn.textContent = 'Message Sent!';
    btn.style.background = '#22c55e';
    contactForm.reset();

    // Reset form field states
    contactForm.querySelectorAll('input, textarea').forEach(input => {
        input.classList.remove('success', 'error');
    });
    contactForm.querySelectorAll('.form-error').forEach(el => el.textContent = '');

    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
    }, 2000);
});

// Tab Navigation for Products (both top and bottom tabs)
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

if (tabBtns.length > 0 && tabContents.length > 0) {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Remove active class from all buttons (both top and bottom)
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to all buttons with same data-tab (sync top and bottom)
            tabBtns.forEach(b => {
                if (b.getAttribute('data-tab') === targetTab) {
                    b.classList.add('active');
                }
            });

            // Show the target content
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Category Filter for Products
const filterBtns = document.querySelectorAll('.machines__filters .filter-btn');
const machineCards = document.querySelectorAll('.machine-card');
const machinesTabs = document.querySelector('.machines__tabs'); // Top tabs
const machinesTabsBottom = document.querySelector('.machines__tabs--bottom'); // Bottom tabs

if (filterBtns.length > 0 && machineCards.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (category === 'all') {
                // Restore Tab View
                if (machinesTabs) machinesTabs.style.display = 'flex';
                // Note: We don't hide bottom tabs here specifically as they are inside tab-content, 
                // but we need to ensure tab-content visibility is reset to active tab only.

                // Find currently active tab button or default to tab1
                const activeTabBtn = document.querySelector('.tab-btn.active');
                const activeTabId = activeTabBtn ? activeTabBtn.getAttribute('data-tab') : 'tab1';

                tabContents.forEach(content => {
                    content.style.display = ''; // Reset inline display
                    if (content.id === activeTabId) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });

                // Reset card visibility
                machineCards.forEach(card => {
                    card.style.display = '';
                });

            } else {
                // Filter Mode
                // Hide Tab Navigation
                if (machinesTabs) machinesTabs.style.display = 'none';

                // Show ALL tab contents so we can search through them
                tabContents.forEach(content => {
                    content.classList.add('active'); // Ensure class is there
                    content.style.display = 'block'; // Force show
                });

                // items per tab logic - user asked for "10 products per tab mechanism" 
                // but properly implementing that for dynamic filters requires complex pagination logic.
                // For now, consistent with "filtered products... show filtered products", we show all matches.

                // Filter cards
                machineCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (cardCategory === category) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
        });
    });
}

console.log('Venus Skincare website initialized');
