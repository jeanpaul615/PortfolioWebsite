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
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    const loader = new ComponentLoader();
    await loader.loadAllComponents();
});
