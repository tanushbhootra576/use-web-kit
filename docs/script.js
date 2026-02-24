/* Hook Engine boot sequence + minimal nav toggle
   - Types boot lines, reveals wordmark and pulses network nodes
   - Respects prefers-reduced-motion
*/
document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('nav-toggle')
    const links = document.getElementById('nav-links')
    if (toggle && links) {
        // ensure initial aria state
        toggle.setAttribute('aria-expanded', 'false')
        toggle.addEventListener('click', () => {
            const currentlyShown = getComputedStyle(links).display === 'flex'
            const willShow = !currentlyShown
            links.style.display = willShow ? 'flex' : 'none'
            links.style.flexDirection = 'column'
            links.style.gap = '8px'
            links.style.padding = '10px 12px'
            links.style.background = '#0b0f12'
            links.style.borderRadius = '8px'
            links.style.boxShadow = willShow ? '0 8px 30px rgba(2,6,23,0.06)' : ''
            toggle.setAttribute('aria-expanded', String(willShow))
        })
    }

    // Boot sequence
    const bootLines = [
        'Initializing Hook Engine...',
        'Loading Web Utilities...',
        'Compiling React Signals...',
        'System Ready.'
    ]

    const bootContainer = document.getElementById('boot-lines')
    const wordmark = document.getElementById('wordmark')
    const nodes = Array.from(document.querySelectorAll('.node'))

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function typeText(targetEl, text, speed) {
        return new Promise(resolve => {
            if (prefersReduced) { targetEl.textContent = text; return resolve() }
            targetEl.textContent = ''
            let i = 0
            const id = setInterval(() => {
                targetEl.textContent += text[i++]
                if (i >= text.length) { clearInterval(id); setTimeout(resolve, 240) }
            }, speed)
        })
    }

    async function runBoot() {
        if (!bootContainer) return
        const span = bootContainer.querySelector('.boot-line')
        for (const line of bootLines) {
            await typeText(span, line, 35)
            await new Promise(r => setTimeout(r, 260))
            span.textContent = ''
        }
        // final ready line stays
        await typeText(span, bootLines[bootLines.length - 1], 35)

        // reveal wordmark and pulse nodes
        if (wordmark) setTimeout(() => wordmark.classList.add('revealed'), 240)
        if (nodes.length && !prefersReduced) {
            nodes.forEach((n, idx) => setTimeout(() => n.classList.add('pulse'), 120 * idx))
        }
    }

    // Start boot with tiny delay to allow paint
    setTimeout(() => runBoot(), 300)

})

    /* Small live demos (non-React simulations) */
    ; (function demos() {
        // Network demo
        const netEl = document.getElementById('network-state')
        if (netEl) {
            netEl.setAttribute('aria-live', 'polite')
            function updateNet() {
                const state = navigator.onLine ? 'online' : 'offline'
                netEl.textContent = state
            }
            updateNet()
            window.addEventListener('online', updateNet)
            window.addEventListener('offline', updateNet)
        }

        // Intersection demo
        const obsBox = document.getElementById('observe-box')
        const obsState = document.getElementById('observe-state')
        if (obsBox && obsState && 'IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    obsState.textContent = e.isIntersecting
                    obsBox.style.borderColor = e.isIntersecting ? 'rgba(156,255,0,0.18)' : 'rgba(156,255,0,0.06)'
                })
            }, { threshold: 0.5 })
            io.observe(obsBox)
        }
    })();

// Contributing modal behavior
; (function contribModal() {
    const openLink = document.getElementById('contrib-link')
    const modal = document.getElementById('contrib-modal')
    const closeBtn = document.getElementById('contrib-close')
    if (!openLink || !modal) return

    function open() {
        modal.setAttribute('aria-hidden', 'false')
        // focus the close button for accessibility
        const btn = modal.querySelector('.modal-close')
        if (btn) btn.focus()
        document.body.style.overflow = 'hidden'
    }
    function close() {
        modal.setAttribute('aria-hidden', 'true')
        document.body.style.overflow = ''
        openLink.focus()
    }

    openLink.addEventListener('click', (e) => { e.preventDefault(); open() })
    closeBtn && closeBtn.addEventListener('click', () => close())
    modal.addEventListener('click', (e) => { if (e.target === modal) close() })
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') close() })
})();

