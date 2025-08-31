// Component Loader
class ComponentLoader {
    constructor() {
        this.components = [
            { selector: '#navbar-container', path: 'components/navbar.html' },
            { selector: '#about-container', path: 'components/about.html' },
            { selector: '#experience-container', path: 'components/experience.html' },
            { selector: '#projects-container', path: 'components/projects.html' },
            { selector: '#certifications-container', path: 'components/certifications.html' },
            { selector: '#contact-container', path: 'components/contact.html' },
            { selector: '#footer-container', path: 'components/footer.html' }
        ];
    }

    async loadComponent(selector, path) {
        try {
            console.log(`Loading component from ${path} into ${selector}`); // Debugging log
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            const container = document.querySelector(selector);
            if (container) {
                container.innerHTML = html;

                // Execute any inline or external scripts present inside the loaded HTML
                const scripts = Array.from(container.querySelectorAll('script'));
                for (const oldScript of scripts) {
                    const newScript = document.createElement('script');
                    // copy attributes (e.g., type, src, async)
                    Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                    if (oldScript.src) {
                        // external script - ensure it loads
                        await new Promise((resolve, reject) => {
                            newScript.onload = resolve;
                            newScript.onerror = reject;
                            document.head.appendChild(newScript);
                        });
                    } else {
                        // inline script - copy text
                        newScript.textContent = oldScript.textContent;
                        document.head.appendChild(newScript);
                    }
                    // remove the original script tag from container to avoid duplication
                    oldScript.remove();
                }

                console.log(`Successfully loaded component into ${selector}`); // Debugging log
            } else {
                console.warn(`Container not found for selector: ${selector}`);
            }
        } catch (error) {
            console.error(`Error loading component from ${path}:`, error);
        }
    }

    async loadAllComponents() {
        const promises = this.components.map(component => 
            this.loadComponent(component.selector, component.path)
        );
        
        try {
            await Promise.all(promises);
            await this.initializeAfterLoad(); // wait for post-load initialization (now async)
        } catch (error) {
            console.error('Error loading components:', error);
        }
    }

    // helper to dynamically load external scripts
    loadScript(path) {
        return new Promise((resolve, reject) => {
            // prevent loading twice
            if (document.querySelector(`script[src="${path}"]`)) {
                return resolve();
            }
            const s = document.createElement('script');
            s.src = path;
            s.async = false;
            s.onload = () => resolve();
            s.onerror = () => reject(new Error(`Failed to load script: ${path}`));
            document.body.appendChild(s);
        });
    }

    async initializeAfterLoad() {
        // Reinitialize AOS after components are loaded
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }

        // Initialize smooth scroll for navbar links
        this.initializeSmoothScroll();

        // Initialize scroll spy
        this.initializeScrollSpy();

        // Load navbar script after navbar markup exists
        try {
            await this.loadScript('js/navbar.js');
        } catch (e) {
            console.warn('Could not load navbar.js dynamically:', e);
        }

        // Initialize other scripts if needed (they can be kept static or loaded dynamically similarly)
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


