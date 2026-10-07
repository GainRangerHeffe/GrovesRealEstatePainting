// Groves Real Estate Painting
// Everything on the page works without this file except the theme toggle,
// the gallery controls and sending the forms.

const EMAILJS_PUBLIC_KEY = 'X5PGekQjcD2fjmxV7';
const EMAILJS_SERVICE_ID = 'service_562c71o';
const EMAILJS_TEMPLATE_ID = 'template_jxog6i3';
const CONTACT_EMAIL = 'Grovesrealestate@gmail.com';

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMenu();
    initActiveNav();
    initHeroVideo();
    initGallery();
    initForms();
    document.getElementById('year').textContent = new Date().getFullYear();
});

/* Theme ---------------------------------------------------------------- */

function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    const root = document.documentElement;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

    const apply = (theme) => {
        root.setAttribute('data-theme', theme);
        toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    };
    const saved = () => {
        try { return localStorage.getItem('theme'); } catch (e) { return null; }
    };

    apply(root.getAttribute('data-theme') || 'light');

    toggle.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        apply(next);
        try { localStorage.setItem('theme', next); } catch (e) {}
    });

    // Follow the system setting until the visitor picks a theme themselves.
    systemDark.addEventListener('change', (e) => {
        if (!saved()) apply(e.matches ? 'dark' : 'light');
    });
}

/* Navigation ----------------------------------------------------------- */

function initMenu() {
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('siteNav');
    if (!toggle || !nav) return;

    const setOpen = (open) => {
        nav.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
    };

    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    nav.addEventListener('click', (e) => {
        if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) {
            setOpen(false);
            toggle.focus();
        }
    });
}

function initActiveNav() {
    const links = new Map();
    document.querySelectorAll('.site-nav a[href^="#"]').forEach((link) => {
        links.set(link.getAttribute('href').slice(1), link);
    });
    const sections = [...links.keys()].map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            links.forEach((link, id) => {
                if (id === entry.target.id) link.setAttribute('aria-current', 'true');
                else link.removeAttribute('aria-current');
            });
        });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach((section) => observer.observe(section));
}

/* Hero video ----------------------------------------------------------- */

function initHeroVideo() {
    const video = document.getElementById('heroVideo');
    const playToggle = document.getElementById('videoPlayToggle');
    const soundToggle = document.getElementById('videoSoundToggle');
    if (!video || !playToggle || !soundToggle) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection && navigator.connection.saveData;

    const sync = () => {
        playToggle.classList.toggle('is-paused', video.paused);
        playToggle.setAttribute('aria-label', video.paused ? 'Play background video' : 'Pause background video');
        soundToggle.classList.toggle('is-on', !video.muted);
        soundToggle.setAttribute('aria-label', video.muted ? 'Turn video sound on' : 'Turn video sound off');
    };

    video.addEventListener('play', sync);
    video.addEventListener('pause', sync);
    video.addEventListener('volumechange', sync);

    playToggle.addEventListener('click', () => {
        if (video.paused) video.play().catch(() => {});
        else video.pause();
    });
    soundToggle.addEventListener('click', () => {
        video.muted = !video.muted;
        if (!video.muted && video.paused) video.play().catch(() => {});
    });

    // Autoplay muted, unless the visitor has asked for less motion or less data.
    if (!reducedMotion && !saveData) {
        video.muted = true;
        video.play().catch(() => {});
    }
    sync();
}

/* Before / after gallery ----------------------------------------------- */

function initGallery() {
    const track = document.getElementById('galleryTrack');
    const prev = document.getElementById('galleryPrev');
    const next = document.getElementById('galleryNext');
    if (!track) return;

    track.querySelectorAll('.job').forEach((job) => {
        const button = job.querySelector('.job-toggle');
        const state = job.querySelector('.job-state');
        const flip = () => {
            const showingAfter = job.classList.toggle('is-after');
            button.setAttribute('aria-pressed', String(showingAfter));
            button.textContent = showingAfter ? 'Show before' : 'Show after';
            state.textContent = showingAfter ? 'After' : 'Before';
        };
        button.addEventListener('click', flip);
        job.querySelector('.job-photos').addEventListener('click', flip);
    });

    if (!prev || !next) return;

    const step = () => {
        const first = track.querySelector('.job');
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        return first.getBoundingClientRect().width + gap;
    };
    const updateButtons = () => {
        prev.disabled = track.scrollLeft <= 8;
        next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
    };

    prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    track.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons);
    updateButtons();
}

/* Forms ---------------------------------------------------------------- */

function initForms() {
    if (window.emailjs) emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = new FormData(quoteForm);
            const params = {
                name: data.get('name'),
                email: data.get('email'),
                phone: data.get('phone'),
                address: data.get('address'),
                projectType: data.get('projectType'),
                message: data.get('message')
            };
            sendForm(quoteForm, params, {
                sending: 'Sending...',
                success: 'Quote request sent. We will get back to you soon.',
                subject: 'New Quote Request - Groves Real Estate Painting',
                body: [
                    `New quote request from ${params.name}`,
                    '',
                    `Name: ${params.name}`,
                    `Email: ${params.email}`,
                    `Phone: ${params.phone}`,
                    `Address: ${params.address}`,
                    `Project type: ${params.projectType}`,
                    '',
                    params.message
                ].join('\n')
            });
        });
    }

    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = new FormData(reviewForm);
            const rating = data.get('rating');
            // Reviews reuse the quote template, so they are mapped onto its fields.
            const params = {
                name: data.get('name'),
                email: 'Review Submission',
                phone: 'N/A',
                projectType: `${rating} Star Review`,
                message: data.get('review')
            };
            sendForm(reviewForm, params, {
                sending: 'Sending...',
                success: 'Review sent. Thank you for the feedback.',
                subject: 'New Customer Review - Groves Real Estate Painting',
                body: [
                    'New customer review',
                    '',
                    `Customer: ${params.name}`,
                    `Rating: ${rating} stars`,
                    '',
                    params.message
                ].join('\n')
            });
        });
    }
}

// Sends through EmailJS; if that fails, hands the same message to the
// visitor's own mail app so the request is not lost.
async function sendForm(form, params, text) {
    const button = form.querySelector('button[type="submit"]');
    const label = button.textContent;
    button.textContent = text.sending;
    button.disabled = true;

    try {
        if (!window.emailjs) throw new Error('EmailJS did not load');
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
        showToast(text.success);
        form.reset();
    } catch (error) {
        console.error('EmailJS error:', error);
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(text.subject)}&body=${encodeURIComponent(text.body)}`;
        showToast('That did not send from here. Your email app is opening with the message filled in, or call (814) 873-2129.', 'error');
    } finally {
        button.textContent = label;
        button.disabled = false;
    }
}

let toastTimer;

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.toggle('is-error', type === 'error');
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), type === 'error' ? 9000 : 5000);
}
