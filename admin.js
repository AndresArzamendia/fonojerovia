document.addEventListener('DOMContentLoaded', () => {

    if (typeof lucide !== 'undefined') lucide.createIcons();

    const DEFAULT_PASSWORD = 'admin123';
    let siteData = null;

    // =========================================
    // AUTH
    // =========================================
    const loginScreen = document.getElementById('loginScreen');
    const adminPanel = document.getElementById('adminPanel');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const logoutBtn = document.getElementById('logoutBtn');

    function checkAuth() {
        const auth = localStorage.getItem('jerovia_admin_auth');
        if (auth === 'true') {
            loginScreen.classList.add('hidden');
            adminPanel.classList.remove('hidden');
            loadData();
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const pass = document.getElementById('loginPassword').value;
            const savedPass = localStorage.getItem('jerovia_admin_password') || DEFAULT_PASSWORD;
            if (pass === savedPass) {
                localStorage.setItem('jerovia_admin_auth', 'true');
                loginScreen.classList.add('hidden');
                adminPanel.classList.remove('hidden');
                loadData();
            } else {
                loginError.textContent = 'Contrasena incorrecta';
                document.getElementById('loginPassword').value = '';
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('jerovia_admin_auth');
            location.reload();
        });
    }

    checkAuth();

    // =========================================
    // DATA
    // =========================================
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

        const saved = localStorage.getItem('jerovia_data');
        if (saved && defaults) {
            const savedData = JSON.parse(saved);
            siteData = deepMerge(defaults, savedData);
            saveData();
        } else if (saved) {
            siteData = JSON.parse(saved);
        } else if (defaults) {
            siteData = defaults;
            saveData();
        } else {
            siteData = { personal: {}, education: [], experience: [], certifications: [], services: [], gallery: [], testimonials: [] };
        }
        populateForm();
        renderLists();
    }

    function saveData() {
        localStorage.setItem('jerovia_data', JSON.stringify(siteData));
    }

    // =========================================
    // POPULATE PERSONAL FORM
    // =========================================
    function populateForm() {
        const p = siteData.personal || {};
        setVal('field-name', p.name);
        setVal('field-title', p.title);
        setVal('field-subtitle', p.subtitle);
        setVal('field-badge', p.badge);
        setVal('field-quote', p.quote);
        setVal('field-bio', p.bio);
        setVal('field-phone', p.phone);
        setVal('field-email', p.email);
        setVal('field-address', p.address);
        setVal('field-whatsapp', p.whatsapp);
        setVal('field-googleMapsUrl', p.googleMapsUrl);
        setVal('field-schedule', p.schedule);
        setVal('field-instagram', p.instagram);
        setVal('field-facebook', p.facebook);
        setVal('field-statYears', p.statYears);
        setVal('field-statPatients', p.statPatients);
        setVal('field-statCertifications', p.statCertifications);
    }

    function setVal(id, val) {
        const el = document.getElementById(id);
        if (el && val) el.value = val;
    }

    function getVal(id) {
        const el = document.getElementById(id);
        return el ? el.value.trim() : '';
    }

    // =========================================
    // SAVE PERSONAL DATA
    // =========================================
    document.getElementById('saveAllBtn').addEventListener('click', () => {
        const activeSection = document.querySelector('.admin-section.active');
        if (!activeSection) return;

        const sectionId = activeSection.id;

        if (sectionId === 'sec-personal') {
            siteData.personal = {
                name: getVal('field-name'),
                title: getVal('field-title'),
                subtitle: getVal('field-subtitle'),
                badge: getVal('field-badge'),
                quote: getVal('field-quote'),
                bio: getVal('field-bio'),
                phone: getVal('field-phone'),
                email: getVal('field-email'),
                address: getVal('field-address'),
                whatsapp: getVal('field-whatsapp'),
                googleMapsUrl: getVal('field-googleMapsUrl'),
                schedule: getVal('field-schedule'),
                instagram: getVal('field-instagram'),
                facebook: getVal('field-facebook'),
                statYears: getVal('field-statYears'),
                statPatients: getVal('field-statPatients'),
                statCertifications: getVal('field-statCertifications'),
                photo: siteData.personal?.photo || ''
            };
        }

        saveData();
        showToast('Cambios guardados correctamente', 'success');
    });

    // =========================================
    // SIDEBAR NAVIGATION
    // =========================================
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const sections = document.querySelectorAll('.admin-section');
    const topbarTitle = document.getElementById('topbarTitle');
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const sidebarClose = document.getElementById('sidebarClose');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.dataset.section;
            if (!targetId) return;

            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');

            topbarTitle.textContent = item.querySelector('span').textContent;

            sidebar.classList.remove('open');
        });
    });

    if (menuToggle) menuToggle.addEventListener('click', () => sidebar.classList.add('open'));
    if (sidebarClose) sidebarClose.addEventListener('click', () => sidebar.classList.remove('open'));

    // =========================================
    // RENDER LISTS (Education, Experience, Certs, Services, Testimonials, Gallery)
    // =========================================
    function renderLists() {
        renderEducationList();
        renderExperienceList();
        renderCertList();
        renderServicesList();
        renderTestimonialsList();
        renderGalleryList();
    }

    // EDUCATION
    function renderEducationList() {
        const container = document.getElementById('educationList');
        if (!container) return;
        const items = siteData.education || [];
        container.innerHTML = items.map((item, i) => `
            <div class="list-item">
                <div class="item-content">
                    <h4>${item.degree}</h4>
                    <p>${item.description}</p>
                    <span class="item-meta">${item.institution} - ${item.year}</span>
                </div>
                <div class="item-actions">
                    <button onclick="editItem('education', ${i})" title="Editar"><i data-lucide="pencil"></i></button>
                    <button class="delete-btn" onclick="deleteItem('education', ${i})" title="Eliminar"><i data-lucide="trash-2"></i></button>
                </div>
            </div>
        `).join('');
        if (items.length === 0) {
            container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:1rem;">No hay formacion registrada.</p>';
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // EXPERIENCE
    function renderExperienceList() {
        const container = document.getElementById('experienceList');
        if (!container) return;
        const items = siteData.experience || [];
        container.innerHTML = items.map((item, i) => `
            <div class="list-item">
                <div class="item-content">
                    <h4>${item.role}</h4>
                    <p>${item.description}</p>
                    <span class="item-meta">${item.company} - ${item.period}</span>
                </div>
                <div class="item-actions">
                    <button onclick="editItem('experience', ${i})" title="Editar"><i data-lucide="pencil"></i></button>
                    <button class="delete-btn" onclick="deleteItem('experience', ${i})" title="Eliminar"><i data-lucide="trash-2"></i></button>
                </div>
            </div>
        `).join('');
        if (items.length === 0) {
            container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:1rem;">No hay experiencia registrada.</p>';
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // CERTIFICATIONS
    function renderCertList() {
        const container = document.getElementById('certList');
        if (!container) return;
        const items = siteData.certifications || [];
        container.innerHTML = items.map((item, i) => `
            <div class="list-item">
                <div class="item-content">
                    <h4>${item.name}</h4>
                    <p>${item.institution}</p>
                    <span class="item-meta">${item.year}</span>
                </div>
                <div class="item-actions">
                    <button onclick="editItem('certifications', ${i})" title="Editar"><i data-lucide="pencil"></i></button>
                    <button class="delete-btn" onclick="deleteItem('certifications', ${i})" title="Eliminar"><i data-lucide="trash-2"></i></button>
                </div>
            </div>
        `).join('');
        if (items.length === 0) {
            container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:1rem;">No hay certificaciones registradas.</p>';
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // SERVICES
    function renderServicesList() {
        const container = document.getElementById('servicesList');
        if (!container) return;
        const items = siteData.services || [];
        container.innerHTML = items.map((item, i) => `
            <div class="list-item">
                <div class="item-content">
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                    <span class="item-meta">Icono: ${item.icon || 'heart'}</span>
                </div>
                <div class="item-actions">
                    <button onclick="editItem('services', ${i})" title="Editar"><i data-lucide="pencil"></i></button>
                    <button class="delete-btn" onclick="deleteItem('services', ${i})" title="Eliminar"><i data-lucide="trash-2"></i></button>
                </div>
            </div>
        `).join('');
        if (items.length === 0) {
            container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:1rem;">No hay servicios registrados.</p>';
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // TESTIMONIALS
    function renderTestimonialsList() {
        const container = document.getElementById('testimonialsList');
        if (!container) return;
        const items = siteData.testimonials || [];
        container.innerHTML = items.map((item, i) => `
            <div class="list-item">
                <div class="item-content">
                    <h4>${item.name} - ${'★'.repeat(item.rating)}</h4>
                    <p>"${item.text}"</p>
                    <span class="item-meta">${item.role}</span>
                </div>
                <div class="item-actions">
                    <button class="delete-btn" onclick="deleteItem('testimonials', ${i})" title="Eliminar"><i data-lucide="trash-2"></i></button>
                </div>
            </div>
        `).join('');
        if (items.length === 0) {
            container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:1rem;">No hay testimonios.</p>';
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // GALLERY
    function renderGalleryList() {
        const container = document.getElementById('galleryList');
        if (!container) return;
        const items = siteData.gallery || [];
        if (items.length === 0) {
            container.innerHTML = '<div class="gallery-empty-admin"><p>No hay fotos en la galeria. Usa el boton de arriba para agregar.</p></div>';
            return;
        }
        container.innerHTML = items.map((img, i) => `
            <div class="gallery-admin-item">
                <img src="${img}" alt="Galeria ${i + 1}">
                <button class="delete-gallery-btn" onclick="deleteGalleryItem(${i})" title="Eliminar">
                    <i data-lucide="x"></i>
                </button>
            </div>
        `).join('');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // =========================================
    // CRUD OPERATIONS
    // =========================================
    window.deleteItem = function(category, index) {
        if (!confirm('Eliminar este elemento?')) return;
        siteData[category].splice(index, 1);
        saveData();
        renderLists();
        showToast('Elemento eliminado', 'success');
    };

    window.editItem = function(category, index) {
        const item = siteData[category][index];
        let fields = [];

        switch (category) {
            case 'education':
                fields = [
                    { key: 'degree', label: 'Titulo / Grado', value: item.degree },
                    { key: 'institution', label: 'Institucion', value: item.institution },
                    { key: 'year', label: 'Ano', value: item.year },
                    { key: 'description', label: 'Descripcion', value: item.description, type: 'textarea' }
                ];
                break;
            case 'experience':
                fields = [
                    { key: 'role', label: 'Cargo / Puesto', value: item.role },
                    { key: 'company', label: 'Empresa / Lugar', value: item.company },
                    { key: 'period', label: 'Periodo', value: item.period },
                    { key: 'description', label: 'Descripcion', value: item.description, type: 'textarea' }
                ];
                break;
            case 'certifications':
                fields = [
                    { key: 'name', label: 'Nombre de la certificacion', value: item.name },
                    { key: 'institution', label: 'Institucion emisora', value: item.institution },
                    { key: 'year', label: 'Ano', value: item.year }
                ];
                break;
            case 'services':
                fields = [
                    { key: 'title', label: 'Nombre del servicio', value: item.title },
                    { key: 'description', label: 'Descripcion', value: item.description, type: 'textarea' },
                    { key: 'icon', label: 'Icono (Lucide)', value: item.icon }
                ];
                break;
        }

        openModal('Editar', fields, (values) => {
            siteData[category][index] = { ...siteData[category][index], ...values };
            saveData();
            renderLists();
            showToast('Elemento actualizado', 'success');
        });
    };

    window.deleteGalleryItem = function(index) {
        if (!confirm('Eliminar esta foto?')) return;
        siteData.gallery.splice(index, 1);
        saveData();
        renderGalleryList();
        showToast('Foto eliminada', 'success');
    };

    // ADD BUTTONS
    document.getElementById('addEducationBtn').addEventListener('click', () => {
        openModal('Agregar Formacion', [
            { key: 'degree', label: 'Titulo / Grado', placeholder: 'Licenciatura en ...' },
            { key: 'institution', label: 'Institucion', placeholder: 'Universidad de ...' },
            { key: 'year', label: 'Ano', placeholder: '2020' },
            { key: 'description', label: 'Descripcion', type: 'textarea', placeholder: 'Descripcion del estudio...' }
        ], (values) => {
            if (!siteData.education) siteData.education = [];
            values.id = Date.now();
            siteData.education.push(values);
            saveData();
            renderEducationList();
            showToast('Formacion agregada', 'success');
        });
    });

    document.getElementById('addExperienceBtn').addEventListener('click', () => {
        openModal('Agregar Experiencia', [
            { key: 'role', label: 'Cargo', placeholder: 'Fonoaudiloga' },
            { key: 'company', label: 'Empresa / Lugar', placeholder: 'Centro ...' },
            { key: 'period', label: 'Periodo', placeholder: '2020 - Presente' },
            { key: 'description', label: 'Descripcion', type: 'textarea', placeholder: 'Describe tu rol...' }
        ], (values) => {
            if (!siteData.experience) siteData.experience = [];
            values.id = Date.now();
            siteData.experience.push(values);
            saveData();
            renderExperienceList();
            showToast('Experiencia agregada', 'success');
        });
    });

    document.getElementById('addCertBtn').addEventListener('click', () => {
        openModal('Agregar Certificacion', [
            { key: 'name', label: 'Nombre', placeholder: 'Certificacion en ...' },
            { key: 'institution', label: 'Institucion', placeholder: 'Colegio de ...' },
            { key: 'year', label: 'Ano', placeholder: '2023' }
        ], (values) => {
            if (!siteData.certifications) siteData.certifications = [];
            values.id = Date.now();
            values.image = '';
            siteData.certifications.push(values);
            saveData();
            renderCertList();
            showToast('Certificacion agregada', 'success');
        });
    });

    document.getElementById('addServiceBtn').addEventListener('click', () => {
        openModal('Agregar Servicio', [
            { key: 'title', label: 'Nombre del servicio', placeholder: 'Terapia de ...' },
            { key: 'description', label: 'Descripcion', type: 'textarea', placeholder: 'Describe el servicio...' },
            { key: 'icon', label: 'Icono (Lucide)', placeholder: 'heart, ear, mic, baby...' }
        ], (values) => {
            if (!siteData.services) siteData.services = [];
            values.id = Date.now();
            siteData.services.push(values);
            saveData();
            renderServicesList();
            showToast('Servicio agregado', 'success');
        });
    });

    document.getElementById('addTestimonialBtn').addEventListener('click', () => {
        openModal('Agregar Testimonio', [
            { key: 'name', label: 'Nombre', placeholder: 'Maria G.' },
            { key: 'role', label: 'Rol', type: 'select', options: ['Mama', 'Papa', 'Tutor'], value: 'Mama' },
            { key: 'rating', label: 'Calificacion', type: 'select', options: ['5', '4', '3'], value: '5' },
            { key: 'text', label: 'Testimonio', type: 'textarea', placeholder: 'Escribe el testimonio...' }
        ], (values) => {
            if (!siteData.testimonials) siteData.testimonials = [];
            values.rating = parseInt(values.rating, 10);
            siteData.testimonials.push(values);
            saveData();
            renderTestimonialsList();
            showToast('Testimonio agregado', 'success');
        });
    });

    // =========================================
    // PHOTO UPLOAD
    // =========================================
    const photoInput = document.getElementById('photoInput');
    const previewImg = document.getElementById('previewImg');

    if (photoInput) {
        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (file.size > 3 * 1024 * 1024) {
                showToast('La imagen es muy grande. Maximo 3MB.', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onload = (ev) => {
                const base64 = ev.target.result;
                previewImg.src = base64;
                if (!siteData.personal) siteData.personal = {};
                siteData.personal.photo = base64;
                saveData();
                showToast('Foto de perfil actualizada', 'success');
            };
            reader.readAsDataURL(file);
        });
    }

    // =========================================
    // GALLERY UPLOAD
    // =========================================
    const galleryInput = document.getElementById('galleryInput');

    if (galleryInput) {
        galleryInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            if (!files.length) return;
            if (!siteData.gallery) siteData.gallery = [];

            let processed = 0;
            files.forEach(file => {
                if (file.size > 3 * 1024 * 1024) {
                    showToast(`"${file.name}" es muy grande. Maximo 3MB.`, 'error');
                    processed++;
                    return;
                }
                const reader = new FileReader();
                reader.onload = (ev) => {
                    siteData.gallery.push(ev.target.result);
                    processed++;
                    if (processed === files.length) {
                        saveData();
                        renderGalleryList();
                        showToast(`${files.length} foto(s) agregada(s)`, 'success');
                    }
                };
                reader.readAsDataURL(file);
            });

            galleryInput.value = '';
        });
    }

    // =========================================
    // SETTINGS
    // =========================================
    document.getElementById('changePasswordForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const current = document.getElementById('currentPass').value;
        const newPass = document.getElementById('newPass').value;
        const confirm = document.getElementById('confirmPass').value;
        const saved = localStorage.getItem('jerovia_admin_password') || DEFAULT_PASSWORD;

        if (current !== saved) {
            showToast('Contrasena actual incorrecta', 'error');
            return;
        }

        if (newPass !== confirm) {
            showToast('Las contrasenas no coinciden', 'error');
            return;
        }

        if (newPass.length < 4) {
            showToast('Minimo 4 caracteres', 'error');
            return;
        }

        localStorage.setItem('jerovia_admin_password', newPass);
        document.getElementById('changePasswordForm').reset();
        showToast('Contrasena actualizada', 'success');
    });

    document.getElementById('resetDataBtn').addEventListener('click', () => {
        if (!confirm('Seguro que quieres restablecer todos los datos? Esto no se puede deshacer.')) return;
        localStorage.removeItem('jerovia_data');
        localStorage.removeItem('jerovia_reviews');
        showToast('Datos restablecidos. Recarga la pagina.', 'success');
        setTimeout(() => location.reload(), 1500);
    });

    // =========================================
    // EXPORT / IMPORT
    // =========================================
    document.getElementById('exportDataBtn').addEventListener('click', () => {
        const dataStr = JSON.stringify(siteData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jerovia-backup-${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Archivo exportado correctamente', 'success');
    });

    const importInput = document.getElementById('importDataInput');
    if (importInput) {
        importInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const imported = JSON.parse(ev.target.result);
                    if (!imported.personal && !imported.education) {
                        showToast('El archivo no tiene formato valido', 'error');
                        return;
                    }
                    if (!confirm('Esto reemplazara todos los datos actuales. Continuar?')) return;
                    siteData = imported;
                    saveData();
                    populateForm();
                    renderLists();
                    showToast('Datos importados correctamente', 'success');
                } catch (err) {
                    showToast('Error al leer el archivo', 'error');
                }
            };
            reader.readAsText(file);
            importInput.value = '';
        });
    }

    // =========================================
    // MODAL
    // =========================================
    const modal = document.getElementById('modal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    const modalConfirm = document.getElementById('modalConfirm');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    let modalCallback = null;

    function openModal(title, fields, callback) {
        modalTitle.textContent = title;
        modalCallback = callback;

        modalBody.innerHTML = fields.map(f => {
            if (f.type === 'textarea') {
                return `<div class="form-group">
                    <label>${f.label}</label>
                    <textarea id="modal-${f.key}" rows="3" placeholder="${f.placeholder || ''}">${f.value || ''}</textarea>
                </div>`;
            }
            if (f.type === 'select') {
                const opts = f.options.map(o => `<option value="${o}" ${o === f.value ? 'selected' : ''}>${o}</option>`).join('');
                return `<div class="form-group">
                    <label>${f.label}</label>
                    <select id="modal-${f.key}">${opts}</select>
                </div>`;
            }
            return `<div class="form-group">
                <label>${f.label}</label>
                <input type="text" id="modal-${f.key}" value="${f.value || ''}" placeholder="${f.placeholder || ''}">
            </div>`;
        }).join('');

        modal.classList.remove('hidden');
    }

    function closeModal() {
        modal.classList.add('hidden');
        modalCallback = null;
    }

    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalCancel) modalCancel.addEventListener('click', closeModal);

    if (modalConfirm) {
        modalConfirm.addEventListener('click', () => {
            if (!modalCallback) return;
            const inputs = modalBody.querySelectorAll('input, textarea, select');
            const values = {};
            inputs.forEach(input => {
                const key = input.id.replace('modal-', '');
                values[key] = input.value.trim();
            });
            modalCallback(values);
            closeModal();
        });
    }

    // =========================================
    // TOAST
    // =========================================
    function showToast(msg, type = '') {
        const toast = document.getElementById('toast');
        toast.textContent = msg;
        toast.className = 'toast-admin show ' + type;
        setTimeout(() => toast.className = 'toast-admin', 3000);
    }
});
