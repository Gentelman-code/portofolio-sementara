/**
 * Galih Adam — DKV Portfolio
 * Main JavaScript
 */

// ========================================
// Custom Cursor
// ========================================
class CustomCursor {
  constructor() {
    this.cursor = document.querySelector('.custom-cursor');
    if (!this.cursor) return;
    
    // Check for touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      this.cursor.style.display = 'none';
      return;
    }

    this.pos = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };
    this.isActive = true;

    this.init();
  }

  init() {
    document.addEventListener('mousemove', (e) => {
      this.target.x = e.clientX;
      this.target.y = e.clientY;
    });

    // Link hover
    document.querySelectorAll('a, button, .nav-link').forEach(el => {
      el.addEventListener('mouseenter', () => this.cursor.classList.add('link'));
      el.addEventListener('mouseleave', () => this.cursor.classList.remove('link'));
    });

    // Image hover
    document.querySelectorAll('.work-card, .category-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.cursor.classList.remove('link');
        this.cursor.classList.add('image');
      });
      el.addEventListener('mouseleave', () => this.cursor.classList.remove('image'));
    });

    this.animate();
  }

  animate() {
    if (!this.isActive) return;
    
    this.pos.x += (this.target.x - this.pos.x) * 0.15;
    this.pos.y += (this.target.y - this.pos.y) * 0.15;
    
    this.cursor.style.left = this.pos.x + 'px';
    this.cursor.style.top = this.pos.y + 'px';
    
    requestAnimationFrame(() => this.animate());
  }
}

// ========================================
// Navigation Scroll Effect
// ========================================
class Navigation {
  constructor() {
    this.nav = document.querySelector('.nav');
    if (!this.nav) return;
    
    this.mobileToggle = document.querySelector('.nav-mobile-toggle');
    this.navOverlay = document.querySelector('.nav-overlay');
    
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        this.nav.classList.add('scrolled');
      } else {
        this.nav.classList.remove('scrolled');
      }
    });

    // Mobile menu toggle
    if (this.mobileToggle && this.navOverlay) {
      this.mobileToggle.addEventListener('click', () => {
        this.mobileToggle.classList.toggle('active');
        this.navOverlay.classList.toggle('active');
        document.body.style.overflow = this.navOverlay.classList.contains('active') ? 'hidden' : '';
      });

      // Close overlay on link click
      this.navOverlay.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          this.mobileToggle.classList.remove('active');
          this.navOverlay.classList.remove('active');
          document.body.style.overflow = '';
        });
      });
    }
  }
}

// ========================================
// Particle Background
// ========================================
class ParticleBackground {
  constructor(container) {
    this.container = container;
    if (!this.container) return;
    
    this.particles = [];
    this.count = 40;
    this.isActive = true;
    
    this.init();
  }

  init() {
    for (let i = 0; i < this.count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const size = 2 + Math.random() * 4;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const opacity = 0.2 + Math.random() * 0.3;
      
      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        top: ${y}%;
        opacity: ${opacity};
      `;
      
      this.container.appendChild(particle);
      
      this.particles.push({
        el: particle,
        x,
        y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      });
    }
    
    this.animate();
  }

  animate() {
    if (!this.isActive) return;
    
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      
      if (p.x < 0 || p.x > 100) p.vx *= -1;
      if (p.y < 0 || p.y > 100) p.vy *= -1;
      
      p.el.style.left = p.x + '%';
      p.el.style.top = p.y + '%';
    });
    
    requestAnimationFrame(() => this.animate());
  }

  destroy() {
    this.isActive = false;
    this.particles.forEach(p => p.el.remove());
    this.particles = [];
  }
}

// ========================================
// Scroll Reveal
// ========================================
class ScrollReveal {
  constructor() {
    this.elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children, .image-reveal');
    if (!this.elements.length) return;
    
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          
          // Handle stagger children
          if (entry.target.classList.contains('stagger-children')) {
            const children = entry.target.querySelectorAll('.reveal-child');
            children.forEach((child, i) => {
              setTimeout(() => {
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
              }, i * 120);
            });
          }
          
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -80px 0px'
    });

    this.elements.forEach(el => observer.observe(el));
  }
}

// ========================================
// Split Text Animation
// ========================================
class SplitText {
  constructor() {
    this.elements = document.querySelectorAll('[data-split-text]');
    if (!this.elements.length) return;

    this.init();
  }

  init() {
    this.elements.forEach(el => {
      const text = el.textContent;
      el.innerHTML = '';
      el.classList.add('split-text');

      // Split into words, then characters
      const words = text.split(' ');
      let globalCharIndex = 0;

      words.forEach((word, wi) => {
        const wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline-block';
        wordSpan.style.whiteSpace = 'nowrap';

        for (let char of word) {
          const charSpan = document.createElement('span');
          charSpan.className = 'char';
          charSpan.textContent = char;
          charSpan.style.animationDelay = `${globalCharIndex * 0.03}s`;
          globalCharIndex++;
          wordSpan.appendChild(charSpan);
        }

        el.appendChild(wordSpan);

        if (wi < words.length - 1) {
          const space = document.createTextNode(' ');
          el.appendChild(space);
        }
      });
    });

    // Trigger animation after a short delay
    setTimeout(() => {
      this.elements.forEach(el => {
        el.classList.add('animated');
        const chars = el.querySelectorAll('.char');
        chars.forEach((char, i) => {
          char.style.animationDelay = `${i * 0.03}s`;
        });
      });
    }, 250);
  }
}


// ========================================
// Skill Bar Animation
// ========================================
// ========================================
// Timeline Animation
// ========================================
class TimelineAnimation {
  constructor() {
    this.timeline = document.querySelector('.timeline');
    if (!this.timeline) return;
    
    this.lineFill = this.timeline.querySelector('.timeline-line-fill');
    this.items = this.timeline.querySelectorAll('.timeline-item');
    
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animate();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(this.timeline);
  }

  animate() {
    // Fill line
    if (this.lineFill) {
      this.lineFill.style.height = '100%';
      this.lineFill.style.transition = 'height 2s ease-out';
    }
    
    // Stagger items
    this.items.forEach((item, i) => {
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = item.classList.contains('item-left') 
          ? 'translateX(0)' 
          : 'translateX(0)';
      }, 300 + i * 300);
    });
  }
}

// ========================================
// Marquee Speed Coupling
// ========================================
// ========================================
// Page Transition
// ========================================
class PageTransition {
  constructor() {
    this.overlay = document.querySelector('.page-transition');
    this.init();
  }

  init() {
    // Fade out on page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        if (this.overlay) {
          this.overlay.classList.remove('active');
        }
      }, 100);
    });

    // Handle internal link clicks
    document.querySelectorAll('a[href^="./"], a[href^="/"], a[href^="works/"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href) return;

        // Skip hash links (same page)
        if (href.startsWith('#')) return;
        // Skip external links
        if (href.startsWith('http')) return;

        e.preventDefault();

        if (this.overlay) {
          this.overlay.classList.add('active');
          setTimeout(() => {
            window.location.href = href;
          }, 300);
        } else {
          window.location.href = href;
        }
      });
    });
  }
}


// ========================================
// EmailJS Contact Form
// ========================================
class ContactForm {
  constructor() {
    this.form = document.getElementById('contact-form');
    if (!this.form) return;
    
    this.init();
  }

  init() {
    emailjs.init('QJyhRCSHdC4Qf2HFW');
    
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = this.form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Sending...</span>';
      submitBtn.disabled = true;
      
      emailjs.sendForm('service_o9ezthc', 'template_mlqbyg7', this.form)
        .then(() => {
          this.showMessage('Message sent successfully!', 'success');
          this.form.reset();
        })
        .catch(() => {
          this.showMessage('Something went wrong. Please try again.', 'error');
        })
        .finally(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        });
    });
  }

  showMessage(text, type) {
    const existing = this.form.querySelector('.form-message');
    if (existing) existing.remove();
    
    const msg = document.createElement('div');
    msg.className = 'form-message';
    msg.textContent = text;
    msg.style.cssText = `
      margin-top: 16px;
      padding: 12px;
      border-radius: 4px;
      font-size: 13px;
      text-align: center;
      color: ${type === 'success' ? '#D4AF37' : '#ff6b6b'};
      background: ${type === 'success' ? 'rgba(212,175,55,0.1)' : 'rgba(255,107,107,0.1)'};
      border: 1px solid ${type === 'success' ? 'rgba(212,175,55,0.2)' : 'rgba(255,107,107,0.2)'};
    `;
    
    this.form.appendChild(msg);
    
    setTimeout(() => {
      msg.style.opacity = '0';
      msg.style.transition = 'opacity 0.5s';
      setTimeout(() => msg.remove(), 500);
    }, 5000);
  }
}

// ========================================
// Parallax Effect
// ========================================
class ParallaxEffect {
  constructor() {
    this.elements = document.querySelectorAll('[data-parallax]');
    if (!this.elements.length) return;
    
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => {
      requestAnimationFrame(() => {
        this.elements.forEach(el => {
          const rate = parseFloat(el.dataset.parallax) || 0.3;
          const rect = el.getBoundingClientRect();
          const scrolled = window.scrollY;
          const elTop = rect.top + scrolled;
          const offset = (scrolled - elTop) * rate;
          el.style.transform = `translateY(${offset}px)`;
        });
      });
    }, { passive: true });
  }
}

// ========================================
// Initialize Everything
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reduceHeavyEffects = isCoarsePointer || prefersReducedMotion;

  new CustomCursor();
  new Navigation();

  // Scroll reveal: tetap boleh, tapi matikan transform berat jika reduceHeavyEffects
  new ScrollReveal();

  if (!reduceHeavyEffects) {
    new SplitText();
    new PageTransition();
    new ParallaxEffect();

    // Initialize particles if container exists
    const particleContainer = document.getElementById('particles');
    if (particleContainer) {
      new ParticleBackground(particleContainer);
    }
  }

  // Smooth scroll for anchor links
  // (hindari smooth scrolling kalau reduce heavy motion)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: reduceHeavyEffects ? 'auto' : 'smooth' });
      }
    });
  });
});

