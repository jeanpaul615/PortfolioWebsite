// Navbar Functionality
class NavbarManager {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.lastScrollY = window.scrollY;
        this.init();
    }

    init() {
        this.setupScrollBehavior();
        this.setupMenuToggle(); // Renamed from setupMobileMenu
        this.setupSmoothScroll();
    }

    setupScrollBehavior() {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
                // Scrolling down
                this.navbar.classList.add('hidden');
            } else {
                // Scrolling up
                this.navbar.classList.remove('hidden');
            }
            
            this.lastScrollY = currentScrollY;
        });
    }

    setupMenuToggle() { // Renamed and updated
        if (this.menuToggle && this.navLinks) {
            this.menuToggle.addEventListener('click', () => {
                const isMobile = window.innerWidth <= 768;
                if (isMobile) {
                    this.navLinks.classList.toggle('active');
                } else {
                    this.navLinks.classList.toggle('collapsed');
                }
                
                // Update menu icon
                const icon = this.menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-bars');
                    icon.classList.toggle('fa-times');
                }
            });

            // Close menu when clicking on any link inside nav-links
            this.navLinks.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    const isMobile = window.innerWidth <= 768;
                    if (isMobile) {
                        this.navLinks.classList.remove('active');
                    } else {
                        this.navLinks.classList.add('collapsed');
                    }
                    const icon = this.menuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-times');
                    }
                }
            });
        }
    }

    setupSmoothScroll() {
        // Smooth scroll para cualquier link que apunte a un id (soportando nuevos links)
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Account for navbar height
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Initialize navbar manager
document.addEventListener('DOMContentLoaded', () => {
    new NavbarManager();
});
