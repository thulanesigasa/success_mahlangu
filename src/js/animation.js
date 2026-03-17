/**
 * ═══════════════════════════════════════════
 *  OUR LOVE STORY — Main Application Script
 * ═══════════════════════════════════════════
 */

/* ─── DATA ──────────────────────────────── */

const TIMELINE_DATA = {
    "February 2026": [
        {
            date: '14 Feb',
            title: 'The First Connection',
            description: 'Success reached out with a message that changed everything: "I\'m someone you\'d love to meet...". A spiritual vision began a journey of two souls.',
            icon: '<i class="fa-solid fa-star"></i>'
        },
        {
            date: '15 Feb',
            title: 'First Calls & Deep Conversations',
            description: 'Long nights of talking about faith, the five-fold ministry, and shared prophetic callings. Two souls discovering that their connection was far more than ordinary.',
            icon: '<i class="fa-solid fa-comments"></i>'
        },
        {
            date: '16 Feb',
            title: '"Call Me Princess"',
            description: 'On this day, a nickname was born. "Rather call me Princess," she said — and he never forgot. Their conversations deepened over theology, dreams, and building futures.',
            icon: '<i class="fa-solid fa-crown"></i>'
        },
        {
            date: '23 Feb',
            title: 'You Are My Treasure',
            description: '"Treasure is rare for a reason. Glad you recognized the sparkle & I found my treasure." In the quiet of the night, the depths of their feelings became undeniable.',
            icon: '<i class="fa-solid fa-gem"></i>'
        }
    ],
    "March 2026": [
        {
            date: '11 Mar',
            title: 'Planning the First Visit',
            description: '"We are moving... it\'s no longer an I thing but we\'re in it together." Thulane sent travel money — a quiet act that made everything feel real.',
            icon: '<i class="fa-solid fa-map-location-dot"></i>'
        },
        {
            date: '12 Mar',
            title: 'She Took the Taxi to Springs',
            description: 'Success navigated her way alone from Standerton to Springs. The moment she arrived, he left work immediately — nothing else mattered. Two hearts finally in the same city.',
            icon: '<i class="fa-solid fa-bus-simple"></i>'
        },
        {
            date: '13 Mar',
            title: 'First Day Together',
            description: 'Their first full day under the same roof — cooking together, laughing over Mdm Sketch Comedy, and the warmth of finally being near each other after weeks of longing.',
            icon: '<i class="fa-solid fa-house-heart"></i>'
        },
        {
            date: '15 Mar',
            title: 'The Bittersweet Goodbye',
            description: '"Bye Husband," she typed, heart sore. "I madly love you," he replied. She left with his warmth in her heart and the promise of a soon reunion on her lips.',
            icon: '<i class="fa-solid fa-heart-crack"></i>'
        }
    ]
};

/* ─── NAVIGATION ────────────────────────── */

function initNavigation() {
    const navCheckbox = document.getElementById('nav-checkbox');
    const navLinks = document.getElementById('nav-links');

    if (navCheckbox && navLinks) {
        // Toggle menu on checkbox change
        navCheckbox.addEventListener('change', () => {
            if (navCheckbox.checked) {
                navLinks.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close mobile nav on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navCheckbox.checked = false;
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu if user clicks outside
        document.addEventListener('click', (e) => {
            if (navCheckbox.checked && !navLinks.contains(e.target) && !e.target.closest('.hamburger')) {
                navCheckbox.checked = false;
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

function initCommon() {
    initParticles();
    initNavigation();
    initRevealOnScroll();
}

function initRevealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    reveals.forEach(r => observer.observe(r));
}

document.addEventListener('DOMContentLoaded', () => {
    initCommon();

    // Page-specific initialization
    if (document.getElementById('timeline')) {
        initTimeline();
    }
    if (document.getElementById('memories-grid')) {
        initMemories();
    }

    // Show FAB if it exists
    const fab = document.getElementById('fab-add');
    if (fab) {
        setTimeout(() => fab.classList.add('visible'), 500);
    }
});

/* ─── SCROLL SPY (Legacy) ─── */
function initScrollSpy() { }


/* ─── TIMELINE ──────────────────────────── */

function initTimeline() {
    const container = document.getElementById('timeline');
    const filterSelect = document.getElementById('month-filter');
    if (!container) return;

    // Populate dropdown from data keys
    if (filterSelect) {
        Object.keys(TIMELINE_DATA).forEach(month => {
            const option = document.createElement('option');
            option.value = month;
            option.textContent = month;
            filterSelect.appendChild(option);
        });
    }

    // Render all month sections
    Object.entries(TIMELINE_DATA).forEach(([month, items]) => {
        // Month group wrapper
        const group = document.createElement('div');
        group.classList.add('timeline-month-group');
        group.setAttribute('data-month', month);

        // Month Header
        const monthHeader = document.createElement('h2');
        monthHeader.classList.add('month-divider', 'reveal');
        monthHeader.textContent = month;
        group.appendChild(monthHeader);

        // Timeline Items
        items.forEach(item => {
            const el = document.createElement('div');
            el.classList.add('timeline-item');
            el.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <div class="timeline-icon">${item.icon}</div>
                    <span class="timeline-date">${item.date}</span>
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            `;
            group.appendChild(el);
        });

        container.appendChild(group);
    });

    // Filter logic
    if (filterSelect) {
        filterSelect.addEventListener('change', () => {
            const selected = filterSelect.value;
            container.querySelectorAll('.timeline-month-group').forEach(group => {
                if (selected === 'all' || group.dataset.month === selected) {
                    group.style.display = '';
                    // Re-trigger scroll observer for newly visible items
                    group.querySelectorAll('.timeline-item, .reveal').forEach(el => {
                        el.classList.remove('visible');
                        setTimeout(() => timelineObserver.observe(el), 50);
                    });
                } else {
                    group.style.display = 'none';
                }
            });
        });
    }

    // Animate timeline items + reveals on scroll
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    container.querySelectorAll('.timeline-item, .reveal').forEach(item => {
        timelineObserver.observe(item);
    });
}

/* ─── MEMORIES API ──────────────────────── */

async function getMemories() {
    try {
        const res = await fetch('/api/memories');
        if (!res.ok) throw new Error('Failed to fetch');
        return await res.json();
    } catch (err) {
        console.error(err);
        return [];
    }
}

async function initMemories() {
    const empty = document.getElementById('memories-empty');
    if (empty) {
        empty.addEventListener('click', () => {
            const fab = document.getElementById('fab-add');
            if (fab) fab.click();
        });
        empty.style.cursor = 'pointer';
    }

    await renderMemories();
    initModal();
}

async function renderMemories() {
    const grid = document.getElementById('memories-grid');
    const empty = document.getElementById('memories-empty');

    // Loading state
    grid.innerHTML = '<p style="text-align:center;width:100%;">Loading memories...</p>';

    const memories = await getMemories();

    grid.innerHTML = '';

    if (memories.length === 0) {
        empty.style.display = 'block';
        return;
    }

    empty.style.display = 'none';

    // Sort newest first
    const sorted = [...memories].sort((a, b) => new Date(b.date) - new Date(a.date));

    sorted.forEach((mem, index) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.style.animationDelay = `${index * 0.08}s`;

        let mediaHTML = '';
        if (mem.type === 'photo' && mem.mediaUrl) {
            mediaHTML = `<img class="memory-card-media" src="${mem.mediaUrl}" alt="${mem.title}" loading="lazy">`;
        } else if (mem.type === 'video' && mem.mediaUrl) {
            mediaHTML = `<div class="memory-card-media"><video src="${mem.mediaUrl}" controls preload="metadata"></video></div>`;
        }

        const formattedDate = formatDate(mem.date);

        card.innerHTML = `
            ${mediaHTML}
            <div class="memory-card-body">
                <span class="memory-card-date">${formattedDate}</span>
                <h3 class="memory-card-title">${escapeHTML(mem.title)}</h3>
                ${mem.content ? `<p class="memory-card-text">${escapeHTML(mem.content)}</p>` : ''}
            </div>
            <div class="memory-card-footer">
                <span class="memory-type-badge">${getTypeBadge(mem.type)}</span>
                <button class="memory-delete-btn" data-id="${mem.id}" title="Delete memory">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;

        grid.appendChild(card);
    });

    // Delete handlers
    grid.querySelectorAll('.memory-delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = btn.dataset.id;
            if (confirm('Remove this memory from the secure database?')) {
                try {
                    btn.disabled = true;
                    const res = await fetch(`/api/memories/${id}`, { method: 'DELETE' });
                    if (res.ok) {
                        await renderMemories();
                    } else {
                        alert('Failed to delete memory.');
                        btn.disabled = false;
                    }
                } catch (err) {
                    console.error(err);
                    btn.disabled = false;
                }
            }
        });
    });
}

function getTypeBadge(type) {
    switch (type) {
        case 'photo': return '<i class="fa-solid fa-camera"></i> Photo';
        case 'video': return '<i class="fa-solid fa-video"></i> Video';
        default: return '<i class="fa-solid fa-pen"></i> Text';
    }
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/* ─── MODAL ─────────────────────────────── */

function initModal() {
    const overlay = document.getElementById('modal-overlay');
    const fab = document.getElementById('fab-add');
    const cancelBtn = document.getElementById('modal-cancel');
    const form = document.getElementById('memory-form');
    const typeSelect = document.getElementById('mem-type');
    const fileGroup = document.getElementById('file-group');
    const fileUploadArea = document.getElementById('file-upload-area');
    const fileInput = document.getElementById('mem-file');
    const filePreview = document.getElementById('file-preview');

    let currentFileData = null;

    // Open
    fab.addEventListener('click', () => {
        overlay.classList.add('open');
        document.getElementById('mem-title').focus();
    });

    // Close
    cancelBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    function closeModal() {
        overlay.classList.remove('open');
        form.reset();
        filePreview.style.display = 'none';
        fileUploadArea.classList.remove('has-file');
        fileUploadArea.querySelector('span').textContent = 'Click or drag to upload';
        currentFileData = null;
        fileGroup.style.display = 'none';
    }

    // Type toggle
    typeSelect.addEventListener('change', () => {
        const val = typeSelect.value;
        if (val === 'photo' || val === 'video') {
            fileGroup.style.display = 'block';
            fileInput.accept = val === 'photo' ? 'image/*' : 'video/*';
        } else {
            fileGroup.style.display = 'none';
        }
    });

    // File upload
    fileUploadArea.addEventListener('click', () => fileInput.click());

    fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.classList.add('has-file');
    });

    fileUploadArea.addEventListener('dragleave', () => {
        if (!currentFileData) fileUploadArea.classList.remove('has-file');
    });

    fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files[0]) handleFile(fileInput.files[0]);
    });

    function handleFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            currentFileData = e.target.result;
            fileUploadArea.classList.add('has-file');
            fileUploadArea.querySelector('span').textContent = file.name;

            if (file.type.startsWith('image/')) {
                filePreview.src = currentFileData;
                filePreview.style.display = 'block';
            } else {
                filePreview.style.display = 'none';
            }
        };
        reader.readAsDataURL(file);
    }

    // Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('mem-title').value.trim();
        const date = document.getElementById('mem-date').value;
        const type = typeSelect.value;
        const content = document.getElementById('mem-text').value.trim();
        const saveBtn = form.querySelector('button[type="submit"]');

        if (!title || !date) return;

        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving securely...';

        const memoryPayload = {
            id: 'mem_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
            title,
            date,
            type,
            content,
            mediaUrl: currentFileData || null
        };

        try {
            const res = await fetch('/api/memories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(memoryPayload)
            });

            if (res.ok) {
                await renderMemories();
                closeModal();
                // Scroll to top of grid
                setTimeout(() => {
                    const grid = document.getElementById('memories-grid');
                    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            } else {
                alert('Failed to save memory. Note: Payloads over 10MB may be rejected by the server firewall.');
            }
        } catch (err) {
            console.error(err);
            alert('Network error while saving.');
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Memory';
        }
    });
}

/* ─── PARTICLES ─────────────────────────── */

function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const COLORS = [
        'rgba(196, 149, 106, 0.4)',  // rose-gold
        'rgba(212, 197, 181, 0.35)', // beige-warm
        'rgba(212, 135, 143, 0.3)',  // heart-pink
        'rgba(168, 146, 121, 0.3)'   // beige-deep
    ];

    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        const size = 4 + Math.random() * 10;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
        p.style.animationDuration = (6 + Math.random() * 10) + 's';
        p.style.animationDelay = (Math.random() * 8) + 's';
        container.appendChild(p);
    }
}

/* ─── SCROLL REVEAL ─────────────────────── */

function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    reveals.forEach(el => observer.observe(el));
}
