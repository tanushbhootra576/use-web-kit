/* ============================================================
   use-web-kit  —  Landing Page Scripts
   ============================================================
   • Boot sequence animation
   • Copy-to-clipboard with toast
   • Mobile nav drawer
   • Contributing modal
   • Respects prefers-reduced-motion
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ─── Mobile Navigation Drawer ─── */
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');

    if (toggle && links) {
        toggle.addEventListener('click', function () {
            const isOpen = links.classList.contains('open');
            links.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(!isOpen));
        });

        // Close drawer when a link is clicked
        links.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                links.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close drawer on outside click
        document.addEventListener('click', function (e) {
            if (!links.contains(e.target) && !toggle.contains(e.target)) {
                links.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* ─── Toast Notification ─── */
    const toast = document.getElementById('toast');
    let toastTimer = null;

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            toast.classList.remove('show');
        }, 2200);
    }

    /* ─── Copy to Clipboard ─── */
    function copyText(text, btn) {
        if (!navigator.clipboard) {
            // Fallback for older browsers
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy'); } catch (e) { /* noop */ }
            document.body.removeChild(ta);
            showToast('Copied to clipboard!');
            return;
        }
        navigator.clipboard.writeText(text).then(function () {
            showToast('Copied to clipboard!');
            if (btn) {
                btn.classList.add('copied');
                setTimeout(function () { btn.classList.remove('copied'); }, 1500);
            }
        }).catch(function () {
            showToast('Failed to copy');
        });
    }

    // Bind all [data-copy] buttons
    document.querySelectorAll('[data-copy]').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            copyText(btn.getAttribute('data-copy'), btn);
        });
    });

    // Bind code-copy buttons inside pre.code blocks
    document.querySelectorAll('.code-copy').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const codeEl = btn.closest('pre').querySelector('code');
            if (codeEl) {
                copyText(codeEl.textContent, btn);
            }
        });
    });

    /* ─── Boot Sequence Animation ─── */
    const bootLines = [
        'Initializing Hook Engine...',
        'Loading Web Utilities...',
        'Compiling React Signals...',
        'System Ready.'
    ];

    const bootLine = document.getElementById('boot-line');
    const bootCursor = document.getElementById('boot-cursor');
    const wordmark = document.getElementById('wordmark');

    function typeText(el, text, speed) {
        return new Promise(function (resolve) {
            if (prefersReduced) {
                el.textContent = text;
                return resolve();
            }
            el.textContent = '';
            var i = 0;
            var id = setInterval(function () {
                el.textContent += text[i++];
                if (i >= text.length) {
                    clearInterval(id);
                    setTimeout(resolve, 200);
                }
            }, speed);
        });
    }

    async function runBoot() {
        if (!bootLine) return;

        for (var j = 0; j < bootLines.length; j++) {
            await typeText(bootLine, bootLines[j], 30);
            await new Promise(function (r) { setTimeout(r, 220); });
            if (j < bootLines.length - 1) bootLine.textContent = '';
        }

        // Final line stays, reveal wordmark
        if (bootCursor) bootCursor.style.display = 'none';
        if (wordmark) {
            setTimeout(function () {
                wordmark.classList.add('revealed');
            }, 200);
        }
    }

    setTimeout(function () { runBoot(); }, 300);

    /* ─── Contributing Modal ─── */
    var openLink = document.getElementById('contrib-link');
    var modal = document.getElementById('contrib-modal');
    var closeBtn = document.getElementById('contrib-close');

    function openModal() {
        if (!modal) return;
        modal.setAttribute('aria-hidden', 'false');
        var btn = modal.querySelector('.modal-close');
        if (btn) btn.focus();
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modal) return;
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (openLink) openLink.focus();
    }

    if (openLink) {
        openLink.addEventListener('click', function (e) {
            e.preventDefault();
            openModal();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });
    }

    window.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') {
            closeModal();
        }
    });

    /* ─── Active Nav Highlight on Scroll ─── */
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    function updateActiveNav() {
        var scrollY = window.scrollY + 100;
        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(function (link) {
                    link.style.color = '';
                    link.style.background = '';
                    if (link.getAttribute('href') === '#' + id) {
                        link.style.color = 'var(--accent)';
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
});
