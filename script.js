document.addEventListener('DOMContentLoaded', () => {

    if (typeof lucide !== 'undefined') lucide.createIcons();

    const loader = document.getElementById('loader-wrapper');
    if (loader) setTimeout(() => loader.classList.add('loader-hidden'), 300);

    // Mobile menu
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('open'));
        });
    }

    // Intersection Observer
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section-anim').forEach(s => observer.observe(s));

    // Generate floating shapes
    const shapesContainer = document.getElementById('shapesContainer');
    if (shapesContainer) {
        const types = ['circle', 'square', 'star', 'triangle'];
        const stars = ['★', '✦', '☆', '✧'];
        for (let i = 0; i < 25; i++) {
            const type = types[i % 4];
            const el = document.createElement('div');
            el.className = `shape shape-${type}`;
            el.style.top = `${Math.random() * 95}%`;
            el.style.left = `${Math.random() * 95}%`;
            el.style.animationDuration = `${8 + Math.random() * 8}s`;
            el.style.animationDelay = `${-Math.random() * 5}s`;
            if (type === 'circle') {
                const size = 50 + Math.random() * 50;
                el.style.width = size + 'px';
                el.style.height = size + 'px';
            } else if (type === 'square') {
                const size = 40 + Math.random() * 40;
                el.style.width = size + 'px';
                el.style.height = size + 'px';
            } else if (type === 'star') {
                el.textContent = stars[Math.floor(Math.random() * stars.length)];
            }
            shapesContainer.appendChild(el);
        }
    }

    // Load data
    let siteData = null;

    async function loadData() {
        const saved = localStorage.getItem('jerovia_data');
        if (saved) {
            siteData = JSON.parse(saved);
            renderAll();
            return;
        }
        try {
            const res = await fetch('data.json');
            siteData = await res.json();
            localStorage.setItem('jerovia_data', JSON.stringify(siteData));
            renderAll();
        } catch (e) {
            console.error('Error loading data:', e);
        }
    }

    function renderAll() {
        if (!siteData) return;
        renderPersonal();
        renderEducation();
        renderExperience();
        renderCertifications();
        renderServices();
        renderGallery();
        renderTestimonials();
    }

    function renderPersonal() {
        const p = siteData.personal;
        if (!p) return;
        setText('heroBadge', p.badge);
        setText('heroTitle', p.title);
        setText('heroName', p.name);
        setText('heroSubtitle', p.subtitle || p.bio?.substring(0, 100));
        setText('heroAddress', p.address);
        setText('heroPhone', p.phone);
        setText('heroQuote', p.quote);
        setText('bioText', p.bio);
        setText('contactPhone', p.phone);
        setText('contactEmail', p.email);
        setText('contactAddress', p.address);

        const waLink = document.querySelector('.whatsapp-float');
        if (waLink && p.whatsapp) waLink.href = `https://wa.me/${p.whatsapp}`;

        if (p.photo) {
            const heroPhoto = document.getElementById('heroPhoto');
            if (heroPhoto) heroPhoto.src = p.photo;
        }

        document.title = `${p.name} | ${p.title} - Jerovia`;
    }

    function renderEducation() {
        const container = document.getElementById('educationTimeline');
        if (!container || !siteData.education) return;
        container.innerHTML = siteData.education.map(item => `
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <span class="timeline-date">${item.year}</span>
                    <h3>${item.degree}</h3>
                    <h4>${item.institution}</h4>
                    <p>${item.description}</p>
                </div>
            </div>
        `).join('');
    }

    function renderExperience() {
        const container = document.getElementById('experienceTimeline');
        if (!container || !siteData.experience) return;
        container.innerHTML = siteData.experience.map(item => `
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <span class="timeline-date">${item.period}</span>
                    <h3>${item.role}</h3>
                    <h4>${item.company}</h4>
                    <p>${item.description}</p>
                </div>
            </div>
        `).join('');
    }

    function renderCertifications() {
        const container = document.getElementById('certGrid');
        if (!container || !siteData.certifications) return;
        const colors = ['pink', 'green', 'yellow', 'purple', 'blue'];
        const icons = ['award', 'book-open', 'badge-check', 'star', 'trophy'];
        container.innerHTML = siteData.certifications.map((item, i) => `
            <div class="cert-card">
                <div class="cert-icon ${colors[i % colors.length]}">
                    <i data-lucide="${icons[i % icons.length]}"></i>
                </div>
                <div class="cert-info">
                    <h4>${item.name}</h4>
                    <p>${item.institution}</p>
                    <span class="cert-year">${item.year}</span>
                </div>
            </div>
        `).join('');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function renderServices() {
        const container = document.getElementById('servicesGrid');
        if (!container || !siteData.services) return;
        container.innerHTML = siteData.services.map(item => `
            <div class="service-card">
                <div class="service-icon">
                    <i data-lucide="${item.icon || 'heart'}"></i>
                </div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        `).join('');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function renderGallery() {
        const container = document.getElementById('galleryGrid');
        if (!container) return;
        const gallery = siteData.gallery || [];
        if (gallery.length === 0) {
            container.innerHTML = `
                <div class="gallery-item"><img src="local.jpeg" alt="Consultorio Jerovia"></div>
                <div class="gallery-item"><img src="paola.jpeg" alt="Paola Torres"></div>
            `;
            return;
        }
        container.innerHTML = gallery.map(img => `
            <div class="gallery-item"><img src="${img}" alt="Galeria Jerovia"></div>
        `).join('');
    }

    function renderTestimonials() {
        const track = document.getElementById('tickerTrack');
        if (!track) return;
        const testimonials = siteData.testimonials || [];
        if (testimonials.length === 0) return;

        const createCard = (t) => {
            const initial = t.name ? t.name.charAt(0).toUpperCase() : 'U';
            const stars = '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating);
            return `
                <div class="review-card">
                    <div class="review-header">
                        <div class="review-avatar">${initial}</div>
                        <div>
                            <h4>${t.name}</h4>
                            <span class="review-date">${t.role}</span>
                        </div>
                    </div>
                    <div class="stars">${stars}</div>
                    <p>"${t.text}"</p>
                </div>
            `;
        };

        const savedReviews = JSON.parse(localStorage.getItem('jerovia_reviews')) || [];
        const allTestimonials = [...savedReviews, ...testimonials];

        let group1 = '';
        let group2 = '';
        allTestimonials.forEach(t => {
            group1 += createCard(t);
            group2 += createCard(t);
        });

        track.innerHTML = `
            <div class="ticker-group">${group1}</div>
            <div class="ticker-group">${group2}</div>
        `;
    }

    function setText(id, text) {
        const el = document.getElementById(id);
        if (el && text) el.textContent = text;
    }

    loadData();

    // Comment form
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('parentName').value.trim();
            const role = document.getElementById('authorRole').value;
            const rating = parseInt(document.getElementById('ratingSelect').value, 10);
            const text = document.getElementById('commentText').value.trim();
            if (!name || !text) return;

            const newReview = { name, role, rating, text };
            const saved = JSON.parse(localStorage.getItem('jerovia_reviews')) || [];
            saved.push(newReview);
            localStorage.setItem('jerovia_reviews', JSON.stringify(saved));

            if (siteData) {
                if (!siteData.testimonials) siteData.testimonials = [];
                siteData.testimonials.push(newReview);
            }

            renderTestimonials();
            showToast('Opinion publicada con exito');
            commentForm.reset();
        });
    }

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Mensaje enviado. Gracias!');
            contactForm.reset();
        });
    }

    // Carousel controls
    const container = document.getElementById('tickerContainer');
    const track = document.getElementById('tickerTrack');
    const btnPrev = document.getElementById('tickerPrev');
    const btnNext = document.getElementById('tickerNext');

    if (container && track) {
        let position = 0;
        let speed = -0.3;
        let isPaused = false;
        let isDragging = false;
        let startX = 0;
        let currentTranslate = 0;

        function getHalfWidth() { return track.scrollWidth / 2; }

        function animate() {
            if (!isPaused && !isDragging) {
                position += speed;
                const halfWidth = getHalfWidth();
                if (halfWidth > 0) {
                    if (position <= -halfWidth) position += halfWidth;
                    if (position > 0) position -= halfWidth;
                }
                track.style.transform = `translateX(${position}px)`;
            }
            requestAnimationFrame(animate);
        }

        animate();

        container.addEventListener('mouseenter', () => isPaused = true);
        container.addEventListener('mouseleave', () => isPaused = false);

        if (btnNext) {
            btnNext.addEventListener('click', (e) => {
                e.stopPropagation();
                position -= 340;
                const halfWidth = getHalfWidth();
                if (halfWidth > 0 && position <= -halfWidth) position += halfWidth;
                track.style.transform = `translateX(${position}px)`;
            });
        }

        if (btnPrev) {
            btnPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                position += 340;
                const halfWidth = getHalfWidth();
                if (halfWidth > 0 && position > 0) position -= halfWidth;
                track.style.transform = `translateX(${position}px)`;
            });
        }

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
            if (halfWidth > 0) {
                if (position <= -halfWidth) position += halfWidth;
                if (position > 0) position -= halfWidth;
            }
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

    function showToast(msg) {
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
});
