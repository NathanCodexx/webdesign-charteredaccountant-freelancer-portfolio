/**
 * Maxwell Akilan ACCA — Main JavaScript
 */

(function () {
  'use strict';

  /* --- DOM Ready --- */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    handlePreloader();
    initNavbar();
    initScrollOffset();
    initScrollReveal();
    initCounterAnimation();
    initSkillBars();
    initPortfolioFilter();
    initContactForm();
    initSubscribeForm();
    initBackToTop();
    initSmoothScroll();
    initActiveNavLink();
    initDownloadCv();
  }

  /* --- Preloader --- */
  function handlePreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = '';
      }, 1400);
    });

    document.body.style.overflow = 'hidden';
  }

  /* --- Navbar Scroll Effect --- */
  function initNavbar() {
    const navbar = document.getElementById('mainNav');
    if (!navbar) return;

    const toggleScrolled = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    };

    window.addEventListener('scroll', toggleScrolled, { passive: true });
    toggleScrolled();

    const navLinks = navbar.querySelectorAll('.nav-link');
    const collapse = document.getElementById('navbarContent');

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (collapse && collapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(collapse);
          if (bsCollapse) bsCollapse.hide();
        }
      });
    });
  }

  /* --- Dynamic scroll offset for fixed navbar --- */
  function initScrollOffset() {
    const navbar = document.getElementById('mainNav');
    if (!navbar) return;

    const updateOffset = () => {
      const height = Math.ceil(navbar.getBoundingClientRect().height);
      document.documentElement.style.scrollPaddingTop = height + 'px';
      document.body.setAttribute('data-bs-offset', String(height));
    };

    updateOffset();
    window.addEventListener('resize', updateOffset, { passive: true });
    window.addEventListener('orientationchange', () => {
      setTimeout(updateOffset, 150);
    });
  }

  /* --- Scroll Reveal --- */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(el => observer.observe(el));
  }

  /* --- Counter Animation --- */
  function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const duration = 2000;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(counter => observer.observe(counter));
  }

  /* --- Skill Bars --- */
  function initSkillBars() {
    const fills = document.querySelectorAll('.skill-fill');
    if (!fills.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const width = entry.target.getAttribute('data-width');
            entry.target.style.width = width + '%';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    fills.forEach(fill => observer.observe(fill));
  }

  /* --- Portfolio Filter --- */
  function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.portfolio-item');
    if (!filterBtns.length || !items.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        items.forEach(item => {
          const categories = item.getAttribute('data-category') || '';
          const match = filter === 'all' || categories.includes(filter);

          if (match) {
            item.classList.remove('hidden-item');
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';

            requestAnimationFrame(() => {
              item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            });
          } else {
            item.classList.add('hidden-item');
          }
        });
      });
    });
  }

  /* --- Contact Form --- */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const inputs = form.querySelectorAll('[required]');
      let isValid = true;

      inputs.forEach(input => {
        if (!input.checkValidity()) {
          isValid = false;
          input.classList.add('is-invalid');
        } else {
          input.classList.remove('is-invalid');
        }
      });

      if (!isValid) return;

      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        form.reset();

        const successMsg = document.getElementById('formSuccess');
        if (successMsg) {
          successMsg.classList.remove('d-none');
          setTimeout(() => successMsg.classList.add('d-none'), 5000);
        }
      }, 1500);
    });

    form.querySelectorAll('[required]').forEach(input => {
      input.addEventListener('input', () => {
        if (input.checkValidity()) {
          input.classList.remove('is-invalid');
        }
      });
    });
  }

  /* --- Subscribe Form --- */
  function initSubscribeForm() {
    const form = document.getElementById('subscribeForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.checkValidity()) {
        input.value = '';
        input.placeholder = 'Subscribed! Thank you.';
        setTimeout(() => {
          input.placeholder = 'Your email';
        }, 3000);
      }
    });
  }

  /* --- Back to Top --- */
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --- Smooth Scroll for Anchor Links --- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  /* --- Active Nav Link on Scroll --- */
  function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#mainNav .nav-link');

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
              link.classList.toggle('active', link.getAttribute('href') === '#' + id);
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach(section => observer.observe(section));
  }

  /* --- Download CV Placeholder --- */
  function initDownloadCv() {
    const btn = document.getElementById('downloadCv');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Firm profile download will be available once you upload your profile PDF. Replace this with a link to your actual document.');
    });
  }

})();
