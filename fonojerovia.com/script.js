document.addEventListener("DOMContentLoaded", () => {

    // 1. RENDERIZADO DE ICONOS (LUCIDE)
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. INTERSECTION OBSERVER (ANIMACIONES DE SCROLL)
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, observerOptions);

    const animatedSections = document.querySelectorAll(".section-anim");
    animatedSections.forEach(section => observer.observe(section));

    // 3. FORMULARIO DE COMENTARIOS (Con guardado permanente en localStorage)
    const commentForm = document.getElementById('commentForm');
    const tickerGroups = document.querySelectorAll('.ticker-group');

    const sanitize = (str) => {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    };

    const createCardHtml = (parentName, role, rating, text) => {
        const initial = parentName.charAt(0).toUpperCase() || 'U';
        const starsHtml = '★'.repeat(rating) + '☆'.repeat(5 - rating);

        const safeName = sanitize(parentName);
        const safeText = sanitize(text);
        const safeRole = sanitize(role);

        return `
            <div class="review-card">
                <div class="review-header">
                    <div class="review-avatar">${initial}</div>
                    <div>
                        <h4>${safeName}</h4>
                        <span class="review-date">${safeRole}</span>
                    </div>
                </div>
                <div class="stars">${starsHtml}</div>
                <p>"${safeText}"</p>
            </div>
        `;
    };

    // Cargar comentarios guardados previamente al iniciar la página
    const loadSavedComments = () => {
        const savedReviews = JSON.parse(localStorage.getItem('jerovia_reviews')) || [];
        savedReviews.forEach(review => {
            const cardHtml = createCardHtml(review.name, review.role, review.rating, review.text);
            tickerGroups.forEach(group => {
                group.insertAdjacentHTML('afterbegin', cardHtml);
            });
        });
    };

    loadSavedComments();

    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Evita recargar la página para seguir comentando libremente

            const parentNameInput = document.getElementById('parentName');
            const roleSelect = document.getElementById('authorRole');
            const ratingSelect = document.getElementById('ratingSelect');
            const textInput = document.getElementById('commentText');

            if (!parentNameInput || !roleSelect || !ratingSelect || !textInput) return;

            const parentName = parentNameInput.value.trim();
            const role = roleSelect.value;
            const rating = parseInt(ratingSelect.value, 10);
            const text = textInput.value.trim();

            if (!parentName || !text) return;

            const cardHtml = createCardHtml(parentName, role, rating, text);

            // Inserta la nueva tarjeta en todas las copias del carrusel para mantener la animación infinita
            tickerGroups.forEach(group => {
                group.insertAdjacentHTML('afterbegin', cardHtml);
            });

            // Guardar en el almacenamiento del navegador
            const newReview = { name: parentName, role, rating, text };
            const savedReviews = JSON.parse(localStorage.getItem('jerovia_reviews')) || [];
            savedReviews.push(newReview);
            localStorage.setItem('jerovia_reviews', JSON.stringify(savedReviews));

            // Limpia los campos para que la siguiente persona pueda escribir sin restricciones
            commentForm.reset();
        });
    }

    // 4. CARRUSEL INFINITO Y CONTROLES INTERACTIVOS
    const container = document.getElementById('tickerContainer');
    const track = document.getElementById('tickerTrack');
    const btnPrev = document.getElementById('tickerPrev');
    const btnNext = document.getElementById('tickerNext');

    if (container && track) {
        let position = 0;
        let speed = -0.2;
        let isPaused = false;
        let isDragging = false;
        let startX = 0;
        let currentTranslate = 0;

        function getHalfWidth() {
            return track.scrollWidth / 2;
        }

        function animate() {
            if (!isPaused && !isDragging) {
                position += speed;
                const halfWidth = getHalfWidth();

                if (position <= -halfWidth) position += halfWidth;
                if (position > 0) position -= halfWidth;

                track.style.transform = `translateX(${position}px)`;
            }
            requestAnimationFrame(animate);
        }

        animate();

        // Pausa automática inteligente cuando el usuario pone el cursor encima
        container.addEventListener('mouseenter', () => isPaused = true);
        container.addEventListener('mouseleave', () => isPaused = false);

        // Botones de desplazamiento
        if (btnNext) {
            btnNext.addEventListener('click', (e) => {
                e.stopPropagation();
                position -= 340; // Se desplaza el tamaño de una tarjeta
                const halfWidth = getHalfWidth();
                if (position <= -halfWidth) position += halfWidth;
                track.style.transform = `translateX(${position}px)`;
            });
        }

        if (btnPrev) {
            btnPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                position += 340;
                const halfWidth = getHalfWidth();
                if (position > 0) position -= halfWidth;
                track.style.transform = `translateX(${position}px)`;
            });
        }

        // Soporte Drag/Touch para arrastrar con el dedo o mouse
        const startDrag = (e) => {
            isDragging = true;
            startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            currentTranslate = position;
        };

        const moveDrag = (e) => {
            if (!isDragging) return;
            const currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            position = currentTranslate + (currentX - startX);

            const halfWidth = getHalfWidth();
            if (position <= -halfWidth) position += halfWidth;
            if (position > 0) position -= halfWidth;

            track.style.transform = `translateX(${position}px)`;
        };

        const endDrag = () => { isDragging = false; };

        container.addEventListener('mousedown', startDrag);
        container.addEventListener('mousemove', moveDrag);
        window.addEventListener('mouseup', endDrag);

        container.addEventListener('touchstart', startDrag, { passive: true });
        container.addEventListener('touchmove', moveDrag, { passive: true });
        window.addEventListener('touchend', endDrag);
    }
});