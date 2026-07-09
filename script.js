/* ==========================================================================
   YAHYEH PORTFOLIO - MODERN INTERACTIVE LOGIC & ANIMATIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initTheme();
    initScrollProgress();
    initMobileNav();
    initCustomCursor();
    initParticles();
    initScrollReveal();
    initScrollToTop();
    initContactForm();
});

/* ==========================================================================
   1. PRELOADER
   ========================================================================== */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    window.addEventListener('load', () => {
        // Give a slight delay for a smoother load feel
        setTimeout(() => {
            preloader.classList.add('fade-out');
        }, 800);
    });

    // Fallback: in case load event already fired or is delayed too much
    setTimeout(() => {
        if (!preloader.classList.contains('fade-out')) {
            preloader.classList.add('fade-out');
        }
    }, 3000);
}

/* ==========================================================================
   2. THEME SWITCHER (DARK / LIGHT)
   ========================================================================== */
function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    // Detect initial theme
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const initialTheme = savedTheme || (systemPrefersLight ? 'light' : 'dark');

    // Apply initial theme
    document.documentElement.setAttribute('data-theme', initialTheme);

    toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

/* ==========================================================================
   3. SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

/* ==========================================================================
   4. MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !navMenu) return;

    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scrolling when menu is open on mobile
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    hamburger.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
}

/* ==========================================================================
   5. CUSTOM CURSOR WITH LERP (SMOOTH INERTIA)
   ========================================================================== */
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const cursorDot = document.getElementById('custom-cursor-dot');
    if (!cursor || !cursorDot) return;

    // Check if device is touch-enabled
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
        cursor.style.display = 'none';
        cursorDot.style.display = 'none';
        return;
    }

    // Display cursor on desktop
    cursor.style.display = 'block';
    cursorDot.style.display = 'block';

    let mouseX = 0, mouseY = 0;   // Target position
    let cursorX = 0, cursorY = 0; // Current position of outer ring

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Immediately place inner dot
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    // Lerp calculation for smooth ring trailing
    const render = () => {
        const ease = 0.15; // Speed of tracking ring (lower = smoother/slower)
        cursorX += (mouseX - cursorX) * ease;
        cursorY += (mouseY - cursorY) * ease;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        requestAnimationFrame(render);
    };
    render();

    // Hover states for interactive elements
    const hoverables = document.querySelectorAll('a, button, input, textarea, .btn, .theme-toggle, .hamburger');
    hoverables.forEach(item => {
        item.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
        });
        item.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
        });
    });
}

/* ==========================================================================
   6. NEURAL NETWORK PARTICLES CANVAS (AI-THEMED BACKDROP)
   ========================================================================== */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let mouse = {
        x: null,
        y: null,
        radius: 120
    };

    // Keep track of theme to adapt particle colors dynamically
    let particleColor = 'rgba(59, 130, 246, 0.4)';  // Blue
    let lineColor = 'rgba(6, 182, 212, 0.08)';     // Cyan / Transparent

    const updateColors = () => {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        if (isLight) {
            particleColor = 'rgba(37, 99, 235, 0.3)';  // Deep Blue
            lineColor = 'rgba(8, 145, 178, 0.06)';     // Soft Cyan/Teal
        } else {
            particleColor = 'rgba(59, 130, 246, 0.45)'; // Light Blue
            lineColor = 'rgba(6, 182, 212, 0.08)';     // Vibrant Cyan
        }
    };

    // Watch for theme changes to adapt particle colors
    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    updateColors();

    // Set canvas dimensions
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', () => {
        resizeCanvas();
        init();
    });
    resizeCanvas();

    // Track mouse
    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle constructor
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        // Draw particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = particleColor;
            ctx.fill();
        }

        // Update particle position and behavior
        update() {
            // Check canvas boundaries
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Simple collision check with mouse
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius + this.size) {
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                    this.x += 2;
                }
                if (mouse.x > this.x && this.x > this.size * 10) {
                    this.x -= 2;
                }
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                    this.y += 2;
                }
                if (mouse.y > this.y && this.y > this.size * 10) {
                    this.y -= 2;
                }
            }

            // Move particle
            this.x += this.directionX;
            this.y += this.directionY;

            this.draw();
        }
    }

    // Initialize particle array
    function init() {
        particlesArray = [];
        // Scale number of particles based on screen width
        let numberOfParticles = (canvas.width * canvas.height) / 13000;
        if (numberOfParticles > 120) numberOfParticles = 120; // Cap to preserve performance
        if (numberOfParticles < 30) numberOfParticles = 30;

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1.5;
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;

            particlesArray.push(new Particle(x, y, directionX, directionY, size, particleColor));
        }
    }

    // Connect particles with lines
    function connect() {
        let maxDistance = 150;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    // Line opacity decreases as distance increases
                    let opacity = 1 - (distance / maxDistance);
                    ctx.strokeStyle = lineColor.replace('rgba(6, 182, 212, 0.08)', `rgba(6, 182, 212, ${opacity * 0.12})`)
                                               .replace('rgba(8, 145, 178, 0.06)', `rgba(8, 145, 178, ${opacity * 0.10})`);
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
        requestAnimationFrame(animate);
    }

    init();
    animate();
}

/* ==========================================================================
   7. SCROLL REVEAL & NAVIGATION ACTIVE LINK SYNC
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.animate-on-scroll');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    // Observer options
    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: '0px'
    };

    // Reveal on scroll callback
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Optional: Stop observing after it has revealed once
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, observerOptions);
    revealElements.forEach(el => revealObserver.observe(el));

    // Active Section Menu Highlighting Callback
    const activeSectionOptions = {
        root: null,
        threshold: 0.3,
        rootMargin: '-10% 0px -60% 0px' // Offset to highlight based on center of view
    };

    const activeCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    const activeObserver = new IntersectionObserver(activeCallback, activeSectionOptions);
    sections.forEach(sec => activeObserver.observe(sec));
}

/* ==========================================================================
   8. SCROLL TO TOP BUTTON
   ========================================================================== */
function initScrollToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==========================================================================
   9. CONTACT FORM SIMULATED SUBMISSION
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    
    if (!form || !formMessage) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('form-name');
        const emailInput = document.getElementById('form-email');
        const subjectInput = document.getElementById('form-subject');
        const messageInput = document.getElementById('form-message-body');
        const submitBtn = form.querySelector('button[type="submit"]');

        // Simple validation
        if (!nameInput.value.trim() || !emailInput.value.trim() || !subjectInput.value.trim() || !messageInput.value.trim()) {
            showFeedback('Veuillez remplir tous les champs du formulaire.', 'error');
            return;
        }

        // Email regex check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            showFeedback('Veuillez entrer une adresse email valide.', 'error');
            return;
        }

        // Change button state
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Envoi en cours...';

        // Simulate API post delay
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;

            // Reset form and show success
            form.reset();
            showFeedback('Votre message a été envoyé avec succès ! Merci de me contacter, je vous répondrai bientôt.', 'success');
        }, 1500);
    });

    function showFeedback(text, type) {
        formMessage.textContent = text;
        formMessage.className = 'form-message ' + type;
        
        // Auto scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Remove feedback warning message after 6 seconds
        if (type === 'success') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 6000);
        }
    }
}
