/* =====================================================
   YASWANTH M — Portfolio JavaScript
   Features:
   - Loader
   - Custom Cursor
   - Navbar scroll + active link
   - Mobile menu
   - Scroll reveal animations
   - Typing effect (Hero)
   - Terminal animation (Hero Visual)
   - Counter animation (About stats)
   - Skills tabs
   - Skill bar animation
   - Magnetic button effect
   - Contact form handling
   ===================================================== */

'use strict';

/* ─── UTILITIES ─────────────────────────────────────── */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ─── LOADER ─────────────────────────────────────────── */
window.addEventListener('load', () => {
    const loader = $('#loader');
    // Wait for fill animation (1.8s) then fade out
    setTimeout(() => {
        loader.classList.add('hidden');
        // Kick off reveal after loader gone
        setTimeout(revealOnScroll, 100);
    }, 2000);
});

/* ─── CUSTOM CURSOR ──────────────────────────────────── */
const cursor   = $('#cursor');
const follower = $('#cursorFollower');

let mouseX = 0, mouseY = 0;
let follX  = 0, follY  = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
});

(function animFollower() {
    follX += (mouseX - follX) * 0.12;
    follY += (mouseY - follY) * 0.12;
    follower.style.left = follX + 'px';
    follower.style.top  = follY + 'px';
    requestAnimationFrame(animFollower);
})();

// Hover state on interactive elements
const hoverEls = 'a, button, .tab-btn, .proj-card, .skill-item, .contact-item, input, textarea';
document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverEls)) {
        cursor.classList.add('hover');
        follower.classList.add('hover');
    }
});
document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverEls)) {
        cursor.classList.remove('hover');
        follower.classList.remove('hover');
    }
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
});

/* ─── NAVBAR ─────────────────────────────────────────── */
const navbar    = $('#navbar');
const hamburger = $('#hamburger');
const mobileMenu = $('#mobileMenu');

// Scroll class
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
    updateActiveLink();
    revealOnScroll();
}, { passive: true });

// Hamburger toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
$$('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
    });
});

// Active nav link based on scroll position
function updateActiveLink() {
    const sections = $$('section[id]');
    const scrollMid = window.scrollY + window.innerHeight / 2;

    sections.forEach(sec => {
        const top = sec.offsetTop;
        const bot = top + sec.offsetHeight;
        const link = $(`.nav-link[href="#${sec.id}"]`);
        if (link) link.classList.toggle('active', scrollMid >= top && scrollMid < bot);
    });
}
updateActiveLink();

/* ─── REVEAL ON SCROLL ───────────────────────────────── */
function revealOnScroll() {
    const revealEls = $$('.reveal-up, .reveal-left, .reveal-right');
    revealEls.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
            // Stagger siblings in same parent
            const delay = [...el.parentElement.children].indexOf(el) * 60;
            setTimeout(() => {
                el.classList.add('visible');
                // Trigger skill fill animation too
                if (el.classList.contains('skill-item')) {
                    el.classList.add('visible');
                }
            }, delay);
        }
    });
    // Counter
    triggerCounters();
}

/* ─── TYPING EFFECT ──────────────────────────────────── */
const typeTarget = $('#typeTarget');
const roles = [
    'GenAI Solutions',
    'LLM-Powered Apps',
    'Azure Infrastructure',
    'Intelligent Automations',
    'Secure Cloud Systems'
];
let roleIdx = 0, charIdx = 0, deleting = false;

function type() {
    const current = roles[roleIdx];
    if (!deleting) {
        typeTarget.textContent = current.slice(0, ++charIdx);
        if (charIdx === current.length) {
            deleting = true;
            setTimeout(type, 2000);
            return;
        }
        setTimeout(type, 70);
    } else {
        typeTarget.textContent = current.slice(0, --charIdx);
        if (charIdx === 0) {
            deleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            setTimeout(type, 400);
            return;
        }
        setTimeout(type, 40);
    }
}

// Start typing after loader
setTimeout(type, 2200);

/* ─── TERMINAL ANIMATION ─────────────────────────────── */
const termBody = $('#termBody');
const termLines = [
    { type: 'cmd',    text: 'python --version' },
    { type: 'out',    text: 'Python 3.11.4' },
    { type: 'cmd',    text: 'groq.chat(model="llama3-8b", prompt=doc)' },
    { type: 'out',    text: '>>> Summary generated in 1.8s' },
    { type: 'cmd',    text: 'az vm list --output table' },
    { type: 'out',    text: 'VM-Web   Running   eastus' },
    { type: 'out',    text: 'VM-DB    Running   eastus' },
    { type: 'cmd',    text: 'langchain.run_agents(research, writer)' },
    { type: 'out',    text: '[Agent 1] Research complete' },
    { type: 'out',    text: '[Agent 2] Draft ready ✓' },
];

function buildTermLine(item) {
    const div = document.createElement('div');
    div.className = 'term-line';
    if (item.type === 'cmd') {
        div.innerHTML = `<span class="term-prompt">PS C:\\></span><span class="term-cmd"> ${item.text}</span>`;
    } else {
        div.innerHTML = `<span class="term-output">${item.text}</span>`;
    }
    return div;
}

async function runTerminal() {
    await delay(2500);
    for (let i = 0; i < termLines.length; i++) {
        const line = termLines[i];
        if (line.type === 'cmd') await delay(600);
        termBody.appendChild(buildTermLine(line));
        termBody.scrollTop = termBody.scrollHeight;
        await delay(line.type === 'cmd' ? 300 : 120);
    }
    // Add blinking cursor at end
    const curDiv = document.createElement('div');
    curDiv.className = 'term-line';
    curDiv.innerHTML = `<span class="term-prompt">PS C:\\></span><span class="term-cursor"></span>`;
    termBody.appendChild(curDiv);
}

function delay(ms) { return new Promise(res => setTimeout(res, ms)); }
runTerminal();

/* ─── COUNTER ANIMATION ──────────────────────────────── */
const countersTriggered = new Set();

function triggerCounters() {
    $$('.count[data-target]').forEach(el => {
        if (countersTriggered.has(el)) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50) {
            countersTriggered.add(el);
            animateCounter(el);
        }
    });
}

function animateCounter(el) {
    const target = +el.dataset.target;
    const duration = 1600;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
    }
    requestAnimationFrame(update);
}

/* ─── SKILLS TABS ────────────────────────────────────── */
const tabBtns   = $$('.tab-btn');
const tabPanels = $$('.skills-panel');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.tab;

        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const panel = $(`#tab-${target}`);
        if (panel) {
            panel.classList.add('active');
            // Re-trigger reveals inside newly shown panel
            setTimeout(() => {
                $$('.reveal-up', panel).forEach(el => {
                    el.classList.remove('visible');
                    setTimeout(() => el.classList.add('visible'), 50);
                });
            }, 50);
        }
    });
});

/* ─── MAGNETIC BUTTONS ───────────────────────────────── */
$$('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width  / 2);
        const dy = e.clientY - (rect.top  + rect.height / 2);
        el.style.transform = `translate(${dx * 0.22}px, ${dy * 0.22}px)`;
    });
    el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
    });
});

/* ─── SMOOTH ANCHOR SCROLL ───────────────────────────── */
$$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const id = a.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ─── CONTACT FORM ───────────────────────────────────── */
const form   = $('#contactForm');
const status = $('#formStatus');

if (form) {
    form.addEventListener('submit', async e => {
        e.preventDefault();

        const name    = $('#cf-name');
        const email   = $('#cf-email');
        const message = $('#cf-msg');
        let valid = true;

        // Basic validation
        [name, email, message].forEach(field => {
            field.closest('.form-group').classList.remove('error');
            if (!field.value.trim()) {
                field.closest('.form-group').classList.add('error');
                valid = false;
            }
        });

        if (!valid) {
            showStatus('error', 'Please fill in all required fields.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            email.closest('.form-group').classList.add('error');
            showStatus('error', 'Please enter a valid email address.');
            return;
        }

        const btn = $('#submitBtn');
        btn.querySelector('span').textContent = 'Sending...';
        btn.disabled = true;

        // Simulate send (replace with real API / EmailJS / Formspree)
        await delay(1400);

        btn.querySelector('span').textContent = 'Send Message';
        btn.disabled = false;
        form.reset();
        showStatus('success', "Message sent! I'll get back to you soon.");
    });
}

function showStatus(type, msg) {
    status.className = `form-status ${type}`;
    status.textContent = msg;
    setTimeout(() => { status.className = 'form-status'; }, 5000);
}

/* ─── TILT EFFECT (Project cards) ───────────────────── */
$$('.proj-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
        const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 10;
        card.style.transform = `perspective(800px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

/* ─── INITIAL REVEAL ─────────────────────────────────── */
// Trigger once immediately in case elements already in view
setTimeout(revealOnScroll, 100);
