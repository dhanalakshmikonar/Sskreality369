'use strict';

document.addEventListener('DOMContentLoaded', () => {

    /* ── HEADER SCROLL ────────────────────── */
    const header   = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const navIds   = ['home','about','services','testimonials','contact'];

    function onScroll() {
        if (!header) return;
        header.classList.toggle('scrolled', window.scrollY > 60);
        let current = 'home';
        navIds.forEach(id => {
            const el = document.getElementById(id);
            if (el && window.scrollY >= el.offsetTop - 140) current = id;
        });
        navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ── MOBILE MENU ──────────────────────── */
    const hamburger = document.getElementById('hamburger');
    const nav       = document.getElementById('nav');
    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            const open = nav.classList.toggle('open');
            hamburger.classList.toggle('open', open);
            document.body.style.overflow = open ? 'hidden' : '';
        });
        nav.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                nav.classList.remove('open');
                hamburger.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    /* ── SMOOTH SCROLL ────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' });
            }
        });
    });

    /* ── HERO SLIDER ──────────────────────── */
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.dots');
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');

    if (slides.length && dotsContainer && nextBtn && prevBtn) {
        let current = 0;
        let timer = null;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            if (i === 0) dot.classList.add('active-dot');
            dotsContainer.appendChild(dot);
            dot.addEventListener('click', () => { goTo(i); start(); });
        });
        const dots = document.querySelectorAll('.dot');

        function goTo(index) {
            slides[current].classList.remove('active');
            dots[current].classList.remove('active-dot');
            current = (index + slides.length) % slides.length;
            slides[current].classList.add('active');
            dots[current].classList.add('active-dot');
        }
        function start() {
            clearInterval(timer);
            timer = setInterval(() => goTo(current + 1), 5500);
        }
        nextBtn.addEventListener('click', () => { goTo(current + 1); start(); });
        prevBtn.addEventListener('click', () => { goTo(current - 1); start(); });
        document.addEventListener('keydown', e => {
            if (e.key === 'ArrowRight') { goTo(current + 1); start(); }
            if (e.key === 'ArrowLeft')  { goTo(current - 1); start(); }
        });
        let touchX = 0;
        const sliderEl = document.querySelector('.slider');
        if (sliderEl) {
            sliderEl.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
            sliderEl.addEventListener('touchend',   e => {
                const diff = touchX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 48) { diff > 0 ? goTo(current + 1) : goTo(current - 1); start(); }
            });
            sliderEl.addEventListener('mouseenter', () => clearInterval(timer));
            sliderEl.addEventListener('mouseleave', start);
        }
        start();
    }

    /* ── STATS COUNTER ────────────────────── */
    function animateCount(el) {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const numEl  = el.querySelector('.stat-num');
        const dur    = 1600;
        const t0     = performance.now();
        function step(now) {
            const p = Math.min((now - t0) / dur, 1);
            const e = 1 - Math.pow(1 - p, 3);
            numEl.textContent = Math.floor(e * target) + suffix;
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    const statsObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { animateCount(entry.target); statsObs.unobserve(entry.target); }
        });
    }, { threshold: 0.6 });
    document.querySelectorAll('.stat-item[data-count]').forEach(el => statsObs.observe(el));

    /* ── SCROLL REVEAL ────────────────────── */
    const revealObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

    /* ── TESTIMONIAL CAROUSEL ─────────────── */
    const track     = document.getElementById('testiTrack');
    const dotsWrap  = document.getElementById('testiDots');
    if (!track || !dotsWrap) return;

    const cards = track.querySelectorAll('.testi-card');
    let cardsVisible = () => window.innerWidth <= 768 ? 1 : window.innerWidth <= 1100 ? 2 : 3;
    let tCurrent = 0;
    let tTimer   = null;
    let tTotal   = () => Math.ceil(cards.length / cardsVisible());

    // Build dots
    function buildDots() {
        dotsWrap.innerHTML = '';
        for (let i = 0; i < tTotal(); i++) {
            const d = document.createElement('button');
            d.classList.add('testi-dot');
            if (i === 0) d.classList.add('active');
            d.setAttribute('aria-label', `Testimonial group ${i + 1}`);
            d.addEventListener('click', () => { tGoTo(i); tStart(); });
            dotsWrap.appendChild(d);
        }
    }

    function tGoTo(index) {
        const total = tTotal();
        tCurrent = (index + total) % total;
        const cv = cardsVisible();
        const cardW = cards[0].offsetWidth + 28; // gap = 28px
        track.style.transform = `translateX(-${tCurrent * cv * cardW}px)`;
        dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === tCurrent));
    }

    function tStart() {
        clearInterval(tTimer);
        tTimer = setInterval(() => tGoTo(tCurrent + 1), 5000);
    }

    // Touch/swipe
    let tTouchX = 0;
    track.addEventListener('touchstart', e => { tTouchX = e.touches[0].clientX; clearInterval(tTimer); }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = tTouchX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 48) { diff > 0 ? tGoTo(tCurrent + 1) : tGoTo(tCurrent - 1); }
        tStart();
    });

    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(tTimer));
    track.addEventListener('mouseleave', tStart);

    // Rebuild on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            tCurrent = 0;
            buildDots();
            tGoTo(0);
            tStart();
        }, 200);
    });

    buildDots();
    tStart();

});