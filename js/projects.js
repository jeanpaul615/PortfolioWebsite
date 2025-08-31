(function () {
    if (window.__projectsModalInitialized) return;
    window.__projectsModalInitialized = true;

    function init() {
        console.log("Projects script init");

        // Load modal CSS with reliable relative path and fallback
        const modalCss = document.createElement('link');
        modalCss.rel = 'stylesheet';
        modalCss.href = 'css/modal.css';
        document.head.appendChild(modalCss);

        modalCss.onerror = function () {
            console.error("Failed to load modal CSS. Attempting alternate path...");
            this.href = '../css/modal.css';
            this.onerror = function () {
                console.error("All attempts to load CSS failed. Using inline styles.");
                applyFallbackStyles();
            };
        };

        // Delegated click handling for dynamically injected project cards and modal close
        document.addEventListener('click', function (e) {
            const card = e.target.closest('.project-card');
            if (card) {
                openModalWithCard(card);
                return;
            }

            // Close button
            if (e.target.closest('.modal .close')) {
                closeModal();
                return;
            }

            // Click outside modal content (on overlay)
            const modal = document.getElementById('project-modal');
            if (modal && e.target === modal) {
                closeModal();
            }
        });

        // ESC key to close
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        });
    }

    function openModalWithCard(card) {
        const modal = document.getElementById('project-modal');
        if (!modal) {
            console.error("Modal element not found yet.");
            return;
        }

        const modalTitle = modal.querySelector('#modal-title');
        const modalTech = modal.querySelector('#modal-tech');
        const modalDescription = modal.querySelector('#modal-description');
        const modalImages = modal.querySelector('#modal-images');
        const modalGithub = modal.querySelector('#modal-github');

        const title = card.getAttribute('data-title') || '';
        const tech = card.getAttribute('data-tech') || '';
        const description = card.getAttribute('data-description') || '';
        const githubUrl = card.getAttribute('data-github') || '#';
        const imagesAttr = card.getAttribute('data-images') || '';
        const images = imagesAttr ? imagesAttr.split(',').map(s => s.trim()).filter(Boolean) : [];

        modalTitle.textContent = title;
        modalTech.innerHTML = tech ? `<strong>Tecnologías:</strong> ${tech}` : '';
        modalDescription.textContent = description;
        modalGithub.href = githubUrl;

        // Clear previous images
        modalImages.innerHTML = '';

        // Add images with fade-in when loaded
        let successfullyLoadedImages = 0;
        images.forEach((imgSrc, i) => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = title || `Project image ${i + 1}`;
            // start hidden; CSS will fade when 'loaded' is added
            img.onerror = function () {
                console.error(`Failed to load image: ${imgSrc}`);
                this.alt = "Image failed to load";
                this.style.height = "100px";
                this.style.background = "#333";
                this.style.display = "flex";
                this.style.justifyContent = "center";
                this.style.alignItems = "center";
                this.classList.add('loaded'); // avoid keeping it transparent
            };
            img.onload = function () {
                successfullyLoadedImages++;
                this.classList.add('loaded');
                console.log(`Image ${i + 1} loaded successfully (${successfullyLoadedImages}/${images.length})`);
            };
            modalImages.appendChild(img);
        });

        // Show modal (CSS handles animation)
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        const modal = document.getElementById('project-modal');
        if (!modal) return;
        console.log("Closing modal");
        modal.classList.remove('show');
        setTimeout(() => {
            document.body.style.overflow = 'auto';
        }, 300);
    }

    // Fallback styles if CSS fails to load
    function applyFallbackStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .modal {
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.7);
            }
            .modal-content {
                background-color: #222;
                color: #fff;
                margin: 10% auto;
                padding: 20px;
                border-radius: 8px;
                width: 80%;
                max-width: 800px;
            }
            .close {
                color: #aaa;
                float: right;
                font-size: 28px;
                font-weight: bold;
                cursor: pointer;
            }
            #modal-images img {
                max-width: 100%;
                margin: 10px 0;
            }
            .modal-github-link {
                display: inline-block;
                margin-top: 15px;
                padding: 8px 16px;
                background-color: #4CAF50;
                color: white;
                text-decoration: none;
                border-radius: 4px;
            }
        `;
        document.head.appendChild(style);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
