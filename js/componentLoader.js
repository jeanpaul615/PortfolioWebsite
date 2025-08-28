// Component Loader
class ComponentLoader {
    constructor() {
        this.components = [
            { selector: '#navbar-container', path: 'components/navbar.html' },
            { selector: '#hero-container', path: 'components/hero.html' },
            { selector: '#about-container', path: 'components/about.html' },
            { selector: '#experience-container', path: 'components/experience.html' },
            { selector: '#projects-container', path: 'components/projects.html' },
            { selector: '#contact-container', path: 'components/contact.html' },
            { selector: '#footer-container', path: 'components/footer.html' }
        ];
    }

    async loadComponent(selector, path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            const container = document.querySelector(selector);
            if (container) {
                container.innerHTML = html;
            }
        } catch (error) {
            console.error(`Error loading component ${path}:`, error);
        }
    }

    async loadAllComponents() {
        const promises = this.components.map(component => 
            this.loadComponent(component.selector, component.path)
        );
        
        try {
            await Promise.all(promises);
            this.initializeAfterLoad();
        } catch (error) {
            console.error('Error loading components:', error);
        }
    }

    initializeAfterLoad() {
        // Reinitialize AOS after components are loaded
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }

        // Initialize smooth scroll for navbar links
        this.initializeSmoothScroll();

        // Initialize scroll spy
        this.initializeScrollSpy();

        // Initialize other scripts
        if (typeof NavbarManager !== 'undefined') {
            new NavbarManager();
        }
        
        if (typeof ThemeManager !== 'undefined') {
            new ThemeManager();
        }
        
        if (typeof ContactForm !== 'undefined') {
            new ContactForm();
        }
    }

    initializeSmoothScroll() {
        // Add smooth scroll to all navbar links and other scroll links
        const scrollLinks = document.querySelectorAll('a[href^="#"], .scroll-link, .cta-button[href^="#"]');
        
        scrollLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                if (!targetId || targetId === '#') return;
                
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Calculate offset for fixed navbar
                    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
                    const targetPosition = targetSection.offsetTop - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update active link if it's a navbar link
                    if (link.closest('.navbar') || link.closest('.nav-links')) {
                        this.updateActiveNavLink(link);
                    }
                }
            });
        });
    }

    initializeScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar a[href^="#"], .nav-links a[href^="#"]');
        
        if (sections.length === 0 || navLinks.length === 0) return;

        // Initial check
        this.updateActiveNavOnScroll();

        // Update on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNavOnScroll();
        });
    }

    updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar a[href^="#"], .nav-links a[href^="#"]');
        const scrollPosition = window.scrollY + 100; // Offset for navbar
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    updateActiveNavLink(activeLink) {
        // Remove active class from all nav links
        const navLinks = document.querySelectorAll('.navbar a[href^="#"], .nav-links a[href^="#"]');
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to clicked link
        activeLink.classList.add('active');
    }
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    const loader = new ComponentLoader();
    await loader.loadAllComponents();
});
