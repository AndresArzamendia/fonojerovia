document.addEventListener('DOMContentLoaded', () => {

    if (typeof lucide !== 'undefined') lucide.createIcons();

    const loader = document.getElementById('loader-wrapper');
    if (loader) {
        function setViewportHeight() {
            const vh = window.innerHeight + 'px';
            loader.style.height = vh;
            document.documentElement.style.setProperty('--app-height', vh);
        }
        setViewportHeight();
        window.addEventListener('resize', setViewportHeight);
        setTimeout(() => loader.classList.add('loader-hidden'), 3500);
    }

    const navbar = document.querySelector('.navbar');
    if (navbar) setTimeout(() => navbar.classList.add('navbar-visible'), 3500);

    // Generate splash particles
    const splashParticles = document.getElementById('splashParticles');
    if (splashParticles) {
        const particleColors = ['#FFB6C1', '#A8E6CF', '#FFEAA7', '#DDA0DD', '#FFD3B6', '#B8D4E3', '#4B9CD3'];
        for (let i = 0; i < 18; i++) {
            const p = document.createElement('div');
            p.className = 'splash-particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.background = particleColors[i % particleColors.length];
            p.style.width = (4 + Math.random() * 6) + 'px';
            p.style.height = p.style.width;
            p.style.animationDuration = (2.5 + Math.random() * 3) + 's';
            p.style.animationDelay = (Math.random() * 3) + 's';
            splashParticles.appendChild(p);
        }
    }

    // Active nav link on scroll + progress bar
    const sections = document.querySelectorAll('section[id]');
    const navBtns = document.querySelectorAll('.nav-links a');
    const scrollProgressBar = document.getElementById('scrollProgress');
    function updateActiveNav() {
        const scrollY = window.scrollY + 120;
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollProgressBar && docHeight > 0) {
            scrollProgressBar.style.width = (scrollTop / docHeight * 100) + '%';
        }
        let current = '';
        sections.forEach(sec => {
            if (sec.offsetTop <= scrollY) current = sec.getAttribute('id');
        });
        navBtns.forEach(btn => {
            btn.classList.remove('active-nav');
            if (btn.getAttribute('href') === '#' + current) btn.classList.add('active-nav');
        });
        if (navbar) {
            if (scrollTop > 60) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // Parallax orbs
    const orbs = document.querySelectorAll('.orb');
    if (orbs.length > 0) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    orbs.forEach((orb, i) => {
                        const speed = 0.02 + (i * 0.008);
                        orb.style.transform = `translateY(${scrollY * speed}px)`;
                    });
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // Mobile menu
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    if (mobileBtn && navLinks) {
        let menuOverlay = null;

        function openMobileMenu() {
            navLinks.classList.add('open');
            menuOverlay = document.createElement('div');
            menuOverlay.className = 'mobile-menu-overlay';
            menuOverlay.addEventListener('click', closeMobileMenu);
            document.body.appendChild(menuOverlay);
            requestAnimationFrame(() => menuOverlay.classList.add('visible'));
        }

        function closeMobileMenu() {
            navLinks.classList.remove('open');
            if (menuOverlay) {
                menuOverlay.classList.remove('visible');
                setTimeout(() => { if (menuOverlay && menuOverlay.parentNode) menuOverlay.parentNode.removeChild(menuOverlay); menuOverlay = null; }, 300);
            }
        }

        mobileBtn.addEventListener('click', () => {
            if (navLinks.classList.contains('open')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
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
        const shapeTypes = [
            { type: 'circle', count: 5 },
            { type: 'square', count: 4 },
            { type: 'heart', count: 3 },
            { type: 'note', count: 3 },
            { type: 'bubble', count: 3 },
            { type: 'star', count: 3 },
            { type: 'dots', count: 3 }
        ];
        const hearts = ['♥', '❤', '♡'];
        const notes = ['♪', '♫', '♬'];
        const stars = ['★', '✦', '✧', '☆'];

        shapeTypes.forEach(({ type, count }) => {
            for (let i = 0; i < count; i++) {
                const el = document.createElement('div');
                el.className = `shape shape-${type}`;
                el.style.top = `${5 + Math.random() * 85}%`;
                el.style.left = `${3 + Math.random() * 90}%`;
                el.style.animationDuration = `${12 + Math.random() * 14}s`;
                el.style.animationDelay = `${-Math.random() * 8}s`;

                if (type === 'circle') {
                    const size = 40 + Math.random() * 60;
                    el.style.width = size + 'px';
                    el.style.height = size + 'px';
                } else if (type === 'square') {
                    const size = 30 + Math.random() * 50;
                    el.style.width = size + 'px';
                    el.style.height = size + 'px';
                } else if (type === 'bubble') {
                    const size = 0.7 + Math.random() * 0.6;
                    el.style.transform = `scale(${size})`;
                } else if (type === 'heart') {
                    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
                } else if (type === 'note') {
                    el.textContent = notes[Math.floor(Math.random() * notes.length)];
                } else if (type === 'star') {
                    el.textContent = stars[Math.floor(Math.random() * stars.length)];
                }
                shapesContainer.appendChild(el);
            }
        });
    }

    // Load data
    let siteData = null;

    function deepMerge(base, override) {
        if (!base || typeof base !== 'object') return override || base;
        if (!override || typeof override !== 'object') return base;
        const result = { ...base };
        for (const key of Object.keys(override)) {
            if (override[key] !== null && typeof override[key] === 'object' && !Array.isArray(override[key]) && typeof base[key] === 'object' && !Array.isArray(base[key])) {
                result[key] = deepMerge(base[key], override[key]);
            } else if (override[key] !== '' && override[key] !== null && override[key] !== undefined) {
                result[key] = override[key];
            }
        }
        return result;
    }

    async function loadData() {
        let defaults = null;
        try {
            const res = await fetch('data.json');
            defaults = await res.json();
        } catch (e) {
            console.error('Error loading data.json:', e);
        }

        const cloudResult = await sbLoad('main');
        const cloudData = cloudResult.ok ? cloudResult.data : null;

        const saved = localStorage.getItem('jerovia_data');

        if (cloudData && defaults) {
            siteData = deepMerge(defaults, cloudData);
            localStorage.setItem('jerovia_data', JSON.stringify(siteData));
        } else if (cloudData) {
            siteData = cloudData;
            localStorage.setItem('jerovia_data', JSON.stringify(siteData));
        } else if (saved && defaults) {
            const savedData = JSON.parse(saved);
            siteData = deepMerge(defaults, savedData);
            localStorage.setItem('jerovia_data', JSON.stringify(siteData));
        } else if (saved) {
            siteData = JSON.parse(saved);
        } else if (defaults) {
            siteData = defaults;
            localStorage.setItem('jerovia_data', JSON.stringify(siteData));
        }

        await Promise.all([
            syncGalleryFromCloud(),
            syncReviewsFromCloud(),
            syncPhotoFromCloud(),
            syncLogoFromCloud()
        ]);

        renderAll();
    }

    async function syncGalleryFromCloud() {
        const result = await sbLoad('gallery');
        if (result.ok && result.data && Array.isArray(result.data) && result.data.length > 0) {
            if (!siteData) siteData = {};
            siteData.gallery = result.data;
            localStorage.setItem('jerovia_data', JSON.stringify(siteData));
        }
    }

    async function syncReviewsFromCloud() {
        const result = await sbLoad('reviews');
        if (result.ok && result.data && Array.isArray(result.data)) {
            localStorage.setItem('jerovia_reviews', JSON.stringify(result.data));
        }
    }

    async function syncPhotoFromCloud() {
        const result = await sbLoad('profile_photo');
        if (result.ok && result.data) {
            if (!siteData) siteData = {};
            if (!siteData.personal) siteData.personal = {};
            siteData.personal.photo = result.data;
            localStorage.setItem('jerovia_data', JSON.stringify(siteData));
        }
    }

    async function syncLogoFromCloud() {
        const result = await sbLoad('site_logo');
        if (result.ok && result.data) {
            if (!siteData) siteData = {};
            if (!siteData.personal) siteData.personal = {};
            siteData.personal.siteLogo = result.data;
            localStorage.setItem('jerovia_data', JSON.stringify(siteData));
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
        renderFAQ();
        renderLogo();
        applyVisibility();
        applyTheme();
        applySectionColors();
    }

    function renderLogo() {
        const p = siteData.personal;
        if (!p) return;
        const logoEl = document.getElementById('siteLogo');
        if (logoEl && p.siteLogo) {
            logoEl.src = p.siteLogo;
        }
        const splashLogoEl = document.getElementById('splashLogoImg');
        if (splashLogoEl && p.siteLogo) {
            splashLogoEl.src = p.siteLogo;
        }
    }

    function applyVisibility() {
        const vis = siteData.visibility || {};
        Object.keys(vis).forEach(id => {
            const section = document.getElementById(id);
            if (section) {
                section.style.display = vis[id] === false ? 'none' : '';
            }
        });
    }

    function applyTheme() {
        const theme = siteData.theme;
        if (!theme || !theme.accent) return;
        const root = document.documentElement;
        root.style.setProperty('--accent-color', theme.accent);
        root.style.setProperty('--accent-dark', theme.accentDark || '#1E4363');
        root.style.setProperty('--accent-glow', theme.accent + '26');
    }

    function applySectionColors() {
        const sc = siteData.sectionColors || {};
        const root = document.documentElement;
        if (sc.about) root.style.setProperty('--section-about', sc.about);
        if (sc.services) root.style.setProperty('--section-services', sc.services);
        if (sc.certs) root.style.setProperty('--section-certs', sc.certs);
        if (sc.contact) root.style.setProperty('--section-contact', sc.contact);
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

        if (p.statYears) setText('statYears', p.statYears);
        if (p.statPatients) setText('statPatients', p.statPatients);
        if (p.statCertifications) setText('statCertifications', p.statCertifications);

        const waLink = document.querySelector('.whatsapp-float');
        if (waLink && p.whatsapp) waLink.href = `https://wa.me/${p.whatsapp}`;

        const waFooter = document.querySelector('.footer-links a[aria-label="WhatsApp"]');
        if (waFooter && p.whatsapp) waFooter.href = `https://wa.me/${p.whatsapp}`;

        if (p.photo) {
            const heroPhoto = document.getElementById('heroPhoto');
            if (heroPhoto) heroPhoto.src = p.photo;
        }

        const navAddress = document.getElementById('navAddress');
        if (navAddress && p.address) navAddress.textContent = p.address;

        const navLocation = document.getElementById('navLocation');
        if (navLocation && p.googleMapsUrl) navLocation.href = p.googleMapsUrl;

        const navPhone = document.getElementById('navPhone');
        if (navPhone && p.phone) navPhone.href = `tel:${p.phone.replace(/\s/g, '')}`;

        const navPhoneNum = document.getElementById('navPhoneNum');
        if (navPhoneNum && p.phone) navPhoneNum.textContent = p.phone;

        const heroAddressCard = document.getElementById('heroAddressCard');
        if (heroAddressCard && p.googleMapsUrl) {
            heroAddressCard.href = p.googleMapsUrl;
        }

        const heroPhoneCard = document.getElementById('heroPhoneCard');
        if (heroPhoneCard && p.phone) {
            heroPhoneCard.href = `tel:${p.phone.replace(/\s/g, '')}`;
        }

        const instaLink = document.querySelector('.footer-links a[aria-label="Instagram"]');
        if (instaLink && p.instagram) instaLink.href = p.instagram;

        const fbLink = document.querySelector('.footer-links a[aria-label="Facebook"]');
        if (fbLink && p.facebook) fbLink.href = p.facebook;

        const scheduleEl = document.getElementById('contactSchedule');
        if (scheduleEl && p.schedule) scheduleEl.textContent = p.schedule;

        setText('footerPhone', p.phone);
        setText('footerEmail', p.email);
        setText('footerAddress', p.address);
        setText('footerSchedule', p.schedule);

        const footerPhoneLink = document.getElementById('footerPhoneLink');
        if (footerPhoneLink && p.phone) footerPhoneLink.href = `tel:${p.phone.replace(/\s/g, '')}`;

        const footerEmailLink = document.getElementById('footerEmailLink');
        if (footerEmailLink && p.email) footerEmailLink.href = `mailto:${p.email}`;

        const footerAddressLink = document.getElementById('footerAddressLink');
        if (footerAddressLink && p.googleMapsUrl) footerAddressLink.href = p.googleMapsUrl;

        const footerLogoImg = document.getElementById('footerLogoImg');
        if (footerLogoImg && p.siteLogo) footerLogoImg.src = p.siteLogo;

        const phoneCard = document.getElementById('contactPhoneCard');
        if (phoneCard && p.phone) phoneCard.href = `tel:${p.phone.replace(/\s/g, '')}`;

        const emailCard = document.getElementById('contactEmailCard');
        if (emailCard && p.email) emailCard.href = `mailto:${p.email}`;

        const addressCard = document.getElementById('contactAddressCard');
        if (addressCard && p.googleMapsUrl) addressCard.href = p.googleMapsUrl;

        document.title = `${p.name} | ${p.title} - Jerovia`;
    }

    function renderEducation() {
        const container = document.getElementById('educationTimeline');
        if (!container || !siteData.education) return;
        container.innerHTML = siteData.education.map((item, i) => `
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content" data-type="education" data-index="${i}">
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
        container.innerHTML = siteData.experience.map((item, i) => `
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content" data-type="experience" data-index="${i}">
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
            <div class="cert-card" data-type="certification" data-index="${i}" style="cursor:pointer;">
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
        const iconSVGs = {
            'message-circle': '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/></svg>',
            'volume-2': '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
            'ear': '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10.5"/><path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 0 0 4 0"/></svg>',
            'mic': '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>',
            'baby': '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/></svg>',
            'heart': '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
            'hearing': '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10.5"/><path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 0 0 4 0"/></svg>'
        };
        container.innerHTML = siteData.services.map(item => {
            const icon = item.icon || 'heart';
            const svg = iconSVGs[icon] || iconSVGs['heart'];
            return `
                <div class="service-card">
                    <div class="service-icon">
                        ${svg}
                    </div>
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            `;
        }).join('');
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

        const createCard = (t) => {
            const initial = t.name ? t.name.charAt(0).toUpperCase() : 'U';
            const stars = '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating);
            return `
                <div class="review-card">
                    <div class="review-header">
                        <div class="review-avatar">${initial}</div>
                        <div>
                            <h4>${t.name}</h4>
                            <span class="review-date"><i data-lucide="user" style="width:12px;height:12px;"></i> ${t.role}</span>
                        </div>
                    </div>
                    <div class="stars">${stars}</div>
                    <p>${t.text}</p>
                </div>
            `;
        };

        const cloudReviews = JSON.parse(localStorage.getItem('jerovia_reviews')) || [];
        const siteReviews = (siteData && siteData.testimonials) || [];

        const seen = new Set();
        const merged = [];
        [...cloudReviews, ...siteReviews].forEach(r => {
            const key = (r.name || '') + '|' + (r.text || '') + '|' + (r.role || '');
            if (!seen.has(key)) {
                seen.add(key);
                merged.push(r);
            }
        });

        if (merged.length === 0) return;

        let group1 = '';
        let group2 = '';
        merged.forEach(t => {
            group1 += createCard(t);
            group2 += createCard(t);
        });

        track.innerHTML = `
            <div class="ticker-group">${group1}</div>
            <div class="ticker-group">${group2}</div>
        `;

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function renderFAQ() {
        const container = document.getElementById('faqList');
        if (!container) return;
        const items = (siteData && siteData.faq) || [];
        if (items.length === 0) {
            container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem 0;">No hay preguntas frecuentes disponibles.</p>';
            return;
        }
        container.innerHTML = items.map(item => `
            <div class="faq-item">
                <button class="faq-question">
                    <span>${item.question}</span>
                    <i data-lucide="chevron-down"></i>
                </button>
                <div class="faq-answer">
                    <p>${item.answer}</p>
                </div>
            </div>
        `).join('');
        if (typeof lucide !== 'undefined') lucide.createIcons();

        container.querySelectorAll('.faq-question').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.closest('.faq-item');
                const wasActive = item.classList.contains('active');
                container.querySelectorAll('.faq-item.active').forEach(a => a.classList.remove('active'));
                if (!wasActive) item.classList.add('active');
            });
        });
    }

    function setText(id, text) {
        const el = document.getElementById(id);
        if (el && text) el.textContent = text;
    }

    loadData();

    // Detail modal
    const detailOverlay = document.getElementById('detailOverlay');
    const detailModal = document.getElementById('detailModal');
    const detailClose = document.getElementById('detailClose');

    const detailColorMap = {
        education: { bg: 'rgba(221,160,221,0.12)', color: '#9b59b6', icon: 'graduation-cap', tag: 'Formacion Academica', tagIcon: 'book-open' },
        experience: { bg: 'rgba(75,156,211,0.1)', color: '#1E4363', icon: 'briefcase', tag: 'Experiencia Profesional', tagIcon: 'briefcase' },
        certification: { bg: 'rgba(255,182,193,0.12)', color: '#d4607a', icon: 'award', tag: 'Certificacion', tagIcon: 'award' }
    };

    function openDetailModal(type, index) {
        if (!siteData || !detailOverlay) return;
        const items = type === 'education' ? siteData.education :
                      type === 'experience' ? siteData.experience :
                      siteData.certifications;
        if (!items || !items[index]) return;
        const item = items[index];
        const config = detailColorMap[type] || detailColorMap.education;

        detailModal.setAttribute('data-type', type);

        const icon = document.getElementById('detailIcon');
        const title = document.getElementById('detailTitle');
        const subtitle = document.getElementById('detailSubtitle');
        const periodText = document.getElementById('detailPeriodText');
        const body = document.getElementById('detailBody');
        const heroLabel = document.getElementById('detailHeroLabel');
        const footer = document.getElementById('detailFooter');

        if (icon) {
            icon.style.background = config.bg;
            icon.style.color = config.color;
            icon.innerHTML = `<i data-lucide="${config.icon}"></i>`;
        }
        if (heroLabel) heroLabel.textContent = config.tag;
        if (type === 'education') {
            if (title) title.textContent = item.degree || '';
            if (subtitle) subtitle.textContent = item.institution || '';
            if (periodText) periodText.textContent = item.year || '';
        } else if (type === 'experience') {
            if (title) title.textContent = item.role || '';
            if (subtitle) subtitle.textContent = item.company || '';
            if (periodText) periodText.textContent = item.period || '';
        } else {
            if (title) title.textContent = item.name || '';
            if (subtitle) subtitle.textContent = item.institution || '';
            if (periodText) periodText.textContent = item.year || '';
        }
        if (body) body.textContent = item.description || '';
        if (footer) {
            footer.innerHTML = `
                <span class="detail-tag"><i data-lucide="${config.tagIcon}"></i> ${config.tag}</span>
                ${item.year || item.period ? `<span class="detail-tag"><i data-lucide="calendar"></i> ${item.year || item.period}</span>` : ''}
            `;
        }

        detailOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function closeDetailModal() {
        if (detailOverlay) detailOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    document.addEventListener('click', (e) => {
        const el = e.target.closest('[data-type]');
        if (el) {
            e.preventDefault();
            openDetailModal(el.dataset.type, parseInt(el.dataset.index, 10));
        }
    });

    if (detailClose) detailClose.addEventListener('click', closeDetailModal);
    if (detailOverlay) detailOverlay.addEventListener('click', (e) => {
        if (e.target === detailOverlay) closeDetailModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeDetailModal();
            closeBioModal();
        }
    });

    // =========================================
    // BIO MODAL — Carousel + Story
    // =========================================
    const bioOverlay = document.getElementById('bioOverlay');
    const bioModalClose = document.getElementById('bioModalClose');
    const bioCarouselTrack = document.getElementById('bioCarouselTrack');
    const bioCarouselDots = document.getElementById('bioCarouselDots');
    const bioPrev = document.getElementById('bioPrev');
    const bioNext = document.getElementById('bioNext');
    const bioModalText = document.getElementById('bioModalText');
    let bioCurrentSlide = 0;
    let bioAutoTimer = null;
    let bioTouchStartX = 0;

    function renderBioCarousel() {
        if (!bioCarouselTrack || !bioCarouselDots) return;
        const photos = (siteData && siteData.bioPhotos) || [];
        const profilePhoto = (siteData && siteData.personal && siteData.personal.photo) ? [{ src: siteData.personal.photo, caption: 'Paola Torres - Fonoaudiologa' }] : [];
        const allPhotos = [...profilePhoto, ...photos];

        if (allPhotos.length === 0) {
            bioCarouselTrack.innerHTML = '<div class="bio-carousel-empty"><i data-lucide="image"></i><span>Sin fotos disponibles</span></div>';
            bioCarouselDots.innerHTML = '';
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        bioCarouselTrack.innerHTML = allPhotos.map((p, i) => `
            <div class="bio-carousel-slide">
                <img src="${p.src}" alt="${p.caption || 'Foto ' + (i + 1)}" loading="lazy">
                ${p.caption ? `<div class="slide-caption">${p.caption}</div>` : ''}
            </div>
        `).join('');

        bioCarouselDots.innerHTML = allPhotos.map((_, i) => `
            <button class="bio-carousel-dot${i === 0 ? ' active' : ''}" data-slide="${i}" aria-label="Slide ${i + 1}"></button>
        `).join('');

        bioCurrentSlide = 0;
        updateBioSlide(false);
    }

    function updateBioSlide(animate = true) {
        if (!bioCarouselTrack) return;
        if (animate) {
            bioCarouselTrack.style.transition = 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)';
        } else {
            bioCarouselTrack.style.transition = 'none';
        }
        bioCarouselTrack.style.transform = `translateX(-${bioCurrentSlide * 100}%)`;
        bioCarouselDots.querySelectorAll('.bio-carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === bioCurrentSlide);
        });
    }

    function nextBioSlide() {
        const total = bioCarouselTrack.querySelectorAll('.bio-carousel-slide').length;
        if (total === 0) return;
        bioCurrentSlide = (bioCurrentSlide + 1) % total;
        updateBioSlide();
    }

    function prevBioSlide() {
        const total = bioCarouselTrack.querySelectorAll('.bio-carousel-slide').length;
        if (total === 0) return;
        bioCurrentSlide = (bioCurrentSlide - 1 + total) % total;
        updateBioSlide();
    }

    function startBioAutoPlay() {
        stopBioAutoPlay();
        bioAutoTimer = setInterval(nextBioSlide, 4500);
    }

    function stopBioAutoPlay() {
        if (bioAutoTimer) { clearInterval(bioAutoTimer); bioAutoTimer = null; }
    }

    function openBioModal() {
        if (!bioOverlay) return;
        renderBioCarousel();
        if (bioModalText) bioModalText.textContent = (siteData && siteData.personal && siteData.personal.bio) || '';
        bioOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        startBioAutoPlay();
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function closeBioModal() {
        if (bioOverlay) bioOverlay.classList.remove('open');
        document.body.style.overflow = '';
        stopBioAutoPlay();
    }

    if (bioModalClose) bioModalClose.addEventListener('click', closeBioModal);
    if (bioOverlay) bioOverlay.addEventListener('click', (e) => { if (e.target === bioOverlay) closeBioModal(); });
    if (bioPrev) bioPrev.addEventListener('click', () => { prevBioSlide(); startBioAutoPlay(); });
    if (bioNext) bioNext.addEventListener('click', () => { nextBioSlide(); startBioAutoPlay(); });

    if (bioCarouselDots) {
        bioCarouselDots.addEventListener('click', (e) => {
            const dot = e.target.closest('.bio-carousel-dot');
            if (dot) {
                bioCurrentSlide = parseInt(dot.dataset.slide, 10);
                updateBioSlide();
                startBioAutoPlay();
            }
        });
    }

    if (bioCarouselTrack) {
        bioCarouselTrack.addEventListener('touchstart', (e) => { bioTouchStartX = e.touches[0].clientX; stopBioAutoPlay(); }, { passive: true });
        bioCarouselTrack.addEventListener('touchend', (e) => {
            const diff = bioTouchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) { diff > 0 ? nextBioSlide() : prevBioSlide(); }
            startBioAutoPlay();
        }, { passive: true });
    }

    // Hook bio card click
    document.addEventListener('click', (e) => {
        const bioCard = e.target.closest('[data-type="bio"]');
        if (bioCard) { e.preventDefault(); openBioModal(); }
    });

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

            if (sb_client) {
                sbSave('reviews', saved).catch(() => {});
            }

            renderTestimonials();
            showToast('Opinion publicada con exito');
            commentForm.reset();
        });
    }

    // Contact form → WhatsApp + confirmation
    const contactForm = document.getElementById('contactForm');
    const confirmOverlay = document.getElementById('confirmOverlay');
    const confirmCloseBtn = document.getElementById('confirmClose');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contactName').value.trim();
            const phone = document.getElementById('contactPhoneInput').value.trim();
            const service = document.getElementById('contactService').value;
            const msg = document.getElementById('contactMsg').value.trim();
            if (!name || !phone || !service || !msg) return;

            const waNum = '595976220370';
            const text = encodeURIComponent(
                `Hola, me comunico desde la pagina web de Jerovia.\n\n` +
                `*Nombre:* ${name}\n` +
                `*Telefono:* ${phone}\n` +
                `*Servicio requerido:* ${service}\n\n` +
                `*Consulta:*\n${msg}`
            );

            window.open(`https://wa.me/${waNum}?text=${text}`, '_blank');
            contactForm.reset();

            if (confirmOverlay) {
                confirmOverlay.classList.add('open');
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        });
    }

    if (confirmCloseBtn && confirmOverlay) {
        confirmCloseBtn.addEventListener('click', () => confirmOverlay.classList.remove('open'));
        confirmOverlay.addEventListener('click', (e) => { if (e.target === confirmOverlay) confirmOverlay.classList.remove('open'); });
    }

    // Carousel — Infinite auto-scroll + smooth arrows + touch drag
    const container = document.getElementById('tickerContainer');
    const track = document.getElementById('tickerTrack');
    const btnPrev = document.getElementById('tickerPrev');
    const btnNext = document.getElementById('tickerNext');

    if (container && track) {
        let pos = 0;
        let speed = 0.5;
        let autoScrollId = null;
        let isPaused = false;
        let isDragging = false;
        let startX = 0;
        let dragStartPos = 0;
        const CARD_GAP = 24;

        function getGroupWidth() {
            const firstGroup = track.querySelector('.ticker-group');
            return firstGroup ? firstGroup.offsetWidth + CARD_GAP : 0;
        }

        function getCardWidth() {
            const card = track.querySelector('.review-card');
            return card ? card.offsetWidth + CARD_GAP : 364;
        }

        function setTranslate() {
            track.style.transform = `translateX(${pos}px)`;
        }

        function wrapPosition() {
            const gw = getGroupWidth();
            if (gw <= 0) return;
            if (pos <= -gw) pos += gw;
            if (pos > 0) pos -= gw;
        }

        function startAutoScroll() {
            stopAutoScroll();
            autoScrollId = setInterval(() => {
                if (!isPaused && !isDragging) {
                    pos -= speed;
                    wrapPosition();
                    setTranslate();
                }
            }, 16);
        }

        function stopAutoScroll() {
            if (autoScrollId) { clearInterval(autoScrollId); autoScrollId = null; }
        }

        function smoothScrollTo(target, duration) {
            const start = pos;
            const diff = target - start;
            const startTime = performance.now();

            function step(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                pos = start + diff * eased;
                wrapPosition();
                setTranslate();
                if (progress < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        }

        if (btnNext) {
            btnNext.addEventListener('click', (e) => {
                e.stopPropagation();
                const cw = getCardWidth();
                smoothScrollTo(pos - cw, 400);
            });
        }

        if (btnPrev) {
            btnPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                const cw = getCardWidth();
                smoothScrollTo(pos + cw, 400);
            });
        }

        container.addEventListener('mouseenter', () => isPaused = true);
        container.addEventListener('mouseleave', () => isPaused = false);

        const startDrag = (e) => {
            isDragging = true;
            startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            dragStartPos = pos;
        };

        const moveDrag = (e) => {
            if (!isDragging) return;
            const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            pos = dragStartPos + (x - startX);
            wrapPosition();
            setTranslate();
        };

        const endDrag = () => { isDragging = false; };

        container.addEventListener('mousedown', startDrag);
        container.addEventListener('mousemove', moveDrag);
        window.addEventListener('mouseup', endDrag);
        container.addEventListener('touchstart', startDrag, { passive: true });
        container.addEventListener('touchmove', moveDrag, { passive: true });
        window.addEventListener('touchend', endDrag);

        startAutoScroll();
    }

    // Appointment modal
    const apptModal = document.getElementById('appointmentModal');
    const apptClose = document.getElementById('modalClose');
    const apptForm = document.getElementById('appointmentForm');
    const dateInput = document.getElementById('apptDate');

    function openApptModal() {
        if (apptModal) apptModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeApptModal() {
        if (apptModal) apptModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.btn-nav-cta, .btn-primary[href="#contacto"]').forEach(el => {
        if (el.textContent.includes('Pedir') || el.textContent.includes('Agendar')) {
            el.addEventListener('click', (e) => { e.preventDefault(); openApptModal(); });
        }
    });

    if (apptClose) apptClose.addEventListener('click', closeApptModal);
    if (apptModal) apptModal.addEventListener('click', (e) => { if (e.target === apptModal) closeApptModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeApptModal(); });

    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.min = `${yyyy}-${mm}-${dd}`;
    }

    const dayNames = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];
    if (apptForm) {
        apptForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('apptName').value.trim();
            const phone = document.getElementById('apptPhone').value.trim();
            const email = document.getElementById('apptEmail').value.trim();
            const day = document.getElementById('apptDay').value;
            const dateVal = document.getElementById('apptDate').value;
            const time = document.getElementById('apptTime').value;
            const message = document.getElementById('apptMessage').value.trim();

            if (!name || !phone || !day || !dateVal || !time || !message) return;

            let dateFormatted = dateVal;
            const dateObj = new Date(dateVal + 'T12:00:00');
            if (!isNaN(dateObj)) {
                const dayOfWeek = dayNames[dateObj.getDay()];
                const dd = String(dateObj.getDate()).padStart(2, '0');
                const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
                const yyyy = dateObj.getFullYear();
                dateFormatted = `${dayOfWeek} ${dd}/${mm}/${yyyy}`;
            }

            const timeFormatted = time.replace(':', ':');

            const waNum = '595976220370';
            const text = encodeURIComponent(
                `Hola, me comunico desde la pagina web de Jerovia.\n\n` +
                `*Nombre:* ${name}\n` +
                `*Telefono:* ${phone}\n` +
                (email ? `*Email:* ${email}\n` : '') +
                `\n*--- Horario Preferido ---*\n` +
                `*Dia de la semana:* ${day}\n` +
                `*Fecha:* ${dateFormatted}\n` +
                `*Hora:* ${timeFormatted}\n\n` +
                `*Consulta:*\n${message}\n\n` +
                `_Nota: El horario sera confirmado segun disponibilidad._`
            );

            window.open(`https://wa.me/${waNum}?text=${text}`, '_blank');
            closeApptModal();
            apptForm.reset();
        });
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
