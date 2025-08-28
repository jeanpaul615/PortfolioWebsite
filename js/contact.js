// Contact Form Functionality
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!data.nombre || !data.correo || !data.mensaje) {
            this.showMessage('Por favor, completa todos los campos.', 'error');
            return;
        }

        if (!this.isValidEmail(data.correo)) {
            this.showMessage('Por favor, ingresa un correo válido.', 'error');
            return;
        }

        // Success message
        this.showMessage('¡Gracias por tu mensaje! Te contactaré pronto. 🚀', 'success');
        this.form.reset();
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message ${type}`;
        messageEl.textContent = message;
        
        // Style the message
        messageEl.style.cssText = `
            padding: 1rem;
            margin-top: 1rem;
            border-radius: 5px;
            font-weight: 500;
            ${type === 'success' 
                ? 'background-color: rgba(34, 197, 94, 0.1); color: #22c55e; border: 1px solid #22c55e;' 
                : 'background-color: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid #ef4444;'
            }
        `;

        // Add to form
        this.form.appendChild(messageEl);

        // Remove after 5 seconds
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }
}

// Initialize contact form
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});
