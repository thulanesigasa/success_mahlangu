/**
 * ═══════════════════════════════════════════
 *  OUR LOVE STORY — Main Application Script
 * ═══════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTimeline();
    initMemories();
    initParticles();
    initScrollReveal();
    initScrollSpy();
});

/* ─── DATA ──────────────────────────────── */

const TIMELINE_DATA = [
    {
        date: 'The Beginning',
        title: 'When We First Met',
        description: 'The universe conspired to bring us together — and from that very first moment, everything changed.',
        icon: '✨'
    },
    {
        date: 'First Chapters',
        title: 'Getting to Know You',
        description: 'Late night conversations, stolen glances, and the beautiful discovery of a kindred soul.',
        icon: '💬'
    },
    {
        date: 'A Turning Point',
        title: 'The Moment I Knew',
        description: 'There was a moment — quiet and certain — when I knew this was something extraordinary, something forever.',
        icon: '💫'
    },
    {
        date: 'Growing Together',
        title: 'Building Our World',
        description: 'Through every laugh and every challenge, we built something unbreakable — a love that only grows stronger.',
        icon: '🌱'
    },
    {
        date: 'Today & Beyond',
        title: 'Our Forever',
        description: 'Every day with you is my favourite day. Here\'s to the rest of our story, yet to be written.',
        icon: '♥️'
    }
];

const STORAGE_KEY = 'love_story_memories';

/* ─── NAVIGATION ────────────────────────── */

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    const allLinks = links.querySelectorAll('a');

    // Scroll: add shadow to navbar
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    });

    // Mobile toggle
    toggle.addEventListener('click', () => {
        links.classList.toggle('open');
    });

    // Close mobile menu on link click
    allLinks.forEach(link => {
        link.addEventListener('click', () => {
            links.classList.remove('open');
        });
    });
}

/* ─── SCROLL SPY ────────────────────────── */

function initScrollSpy() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const fab = document.getElementById('fab-add');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(l => l.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-links a[data-section="${id}"]`);
                if (activeLink) activeLink.classList.add('active');

                // Show FAB only in memories section
                if (id === 'memories') {
                    fab.classList.add('visible');
                } else {
                    fab.classList.remove('visible');
                }
            }
        });
    }, {
        threshold: 0.35
    });

    sections.forEach(s => observer.observe(s));
}

/* ─── TIMELINE ──────────────────────────── */

function initTimeline() {
    const container = document.getElementById('timeline');
    if (!container) return;

    TIMELINE_DATA.forEach((item, i) => {
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
        container.appendChild(el);
    });

    // Animate timeline items on scroll
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    container.querySelectorAll('.timeline-item').forEach(item => {
        timelineObserver.observe(item);
    });
}

/* ─── MEMORIES ──────────────────────────── */

function getMemories() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function saveMemories(mems) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mems));
}

function initMemories() {
    renderMemories();
    initModal();
}

function renderMemories() {
    const grid = document.getElementById('memories-grid');
    const empty = document.getElementById('memories-empty');
    const memories = getMemories();

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
        btn.addEventListener('click', (e) => {
            const id = btn.dataset.id;
            if (confirm('Remove this memory?')) {
                const mems = getMemories().filter(m => m.id !== id);
                saveMemories(mems);
                renderMemories();
            }
        });
    });
}

function getTypeBadge(type) {
    switch (type) {
        case 'photo': return '📷 Photo';
        case 'video': return '🎥 Video';
        default: return '📝 Text';
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
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('mem-title').value.trim();
        const date = document.getElementById('mem-date').value;
        const type = typeSelect.value;
        const content = document.getElementById('mem-text').value.trim();

        if (!title || !date) return;

        const memory = {
            id: 'mem_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
            title,
            date,
            type,
            content,
            mediaUrl: currentFileData || null
        };

        const mems = getMemories();
        mems.push(memory);
        saveMemories(mems);
        renderMemories();
        closeModal();

        // Scroll to the new card
        setTimeout(() => {
            const grid = document.getElementById('memories-grid');
            grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
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
