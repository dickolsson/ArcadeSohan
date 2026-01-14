// ==========================================================
// 🎮 ARCADE SOHAN - JavaScript
// Interactions simples pour améliorer l'expérience utilisateur
// ==========================================================

// Attendre que le DOM soit chargé (Wait for DOM to load)
document.addEventListener('DOMContentLoaded', function() {
  
  // === MENU MOBILE (Mobile hamburger menu) ===
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const menuOverlay = document.getElementById('menu-overlay');
  
  if (menuToggle && navLinks) {
    // Toggle menu on hamburger click (support touch and click)
    const toggleMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      if (menuOverlay) {
        menuOverlay.classList.toggle('active');
      }
      // Prevent body scroll when menu is open
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    };
    
    menuToggle.addEventListener('click', toggleMenu);
    menuToggle.addEventListener('touchstart', toggleMenu, { passive: false });
    
    // Close menu when clicking a link - only use 'click' event to allow navigation
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        // Let the link navigate, then close menu after a tiny delay
        setTimeout(() => {
          menuToggle.classList.remove('active');
          navLinks.classList.remove('active');
          if (menuOverlay) {
            menuOverlay.classList.remove('active');
          }
          document.body.style.overflow = '';
        }, 100);
      });
    });
    
    // Close menu when clicking overlay
    if (menuOverlay) {
      const closeOnOverlay = (e) => {
        e.preventDefault();
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
      };
      menuOverlay.addEventListener('click', closeOnOverlay);
      menuOverlay.addEventListener('touchstart', closeOnOverlay);
    }
    
    // Close menu when clicking outside
    const closeOnOutside = (e) => {
      if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        if (menuOverlay) {
          menuOverlay.classList.remove('active');
        }
        document.body.style.overflow = '';
      }
    };
    
    document.addEventListener('click', closeOnOutside);
    document.addEventListener('touchstart', closeOnOutside);
  }
  
  // === SMOOTH SCROLL FOR ANCHOR LINKS (Défilement fluide) ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // === FADE IN ANIMATION ON SCROLL (Animation au défilement) ===
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeIn 0.8s ease-out forwards';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Appliquer l'animation aux cartes (Apply animation to cards)
  const cards = document.querySelectorAll('.game-card, .feature-card, .component-card, .system-card, .learning-card');
  cards.forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
  });

  // === HIGHLIGHT ACTIVE SECTION IN NAV (Surligner la section active) ===
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.scrollY >= (sectionTop - 100)) {
        currentSection = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(currentSection)) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);

  // === MOBILE MENU TOGGLE (Toggle menu mobile) ===
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.scrollY;
    
    // Cache la navbar en scrollant vers le bas (Hide navbar when scrolling down)
    if (currentScroll > lastScroll && currentScroll > 100) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
  });

  // === ADD SPARKLE EFFECT ON HOVER (Effet scintillant au survol) ===
  const buttons = document.querySelectorAll('.btn-arcade');
  
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      // Petit effet sonore visuel (Small visual sound effect)
      this.style.transform = 'scale(1.05)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });

  // === COPY CODE SNIPPETS (Copier les extraits de code) ===
  const codeBlocks = document.querySelectorAll('pre code');
  
  codeBlocks.forEach(block => {
    // Créer le bouton de copie (Create copy button)
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-code-btn';
    copyButton.textContent = '📋 Copier';
    copyButton.style.cssText = `
      position: absolute;
      top: 8px;
      right: 8px;
      background: var(--arcade-pink);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.8rem;
      opacity: 0;
      transition: opacity 0.3s;
    `;
    
    // Wrapper pour positionner le bouton (Wrapper to position button)
    const pre = block.parentElement;
    pre.style.position = 'relative';
    pre.appendChild(copyButton);
    
    // Afficher le bouton au survol (Show button on hover)
    pre.addEventListener('mouseenter', () => {
      copyButton.style.opacity = '1';
    });
    
    pre.addEventListener('mouseleave', () => {
      copyButton.style.opacity = '0';
    });
    
    // Copier le code (Copy code)
    copyButton.addEventListener('click', async () => {
      const text = block.textContent;
      
      try {
        await navigator.clipboard.writeText(text);
        copyButton.textContent = '✅ Copié!';
        setTimeout(() => {
          copyButton.textContent = '📋 Copier';
        }, 2000);
      } catch (err) {
        console.error('Erreur de copie:', err);
        copyButton.textContent = '❌ Erreur';
        setTimeout(() => {
          copyButton.textContent = '📋 Copier';
        }, 2000);
      }
    });
  });

  // === PROGRESS BAR ANIMATION (Animation des barres de progrès) ===
  const progressBars = document.querySelectorAll('.progress-fill');
  
  const progressObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animer la barre de progrès (Animate progress bar)
        const bar = entry.target;
        const width = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
          bar.style.width = width;
        }, 200);
        
        progressObserver.unobserve(bar);
      }
    });
  });
  
  progressBars.forEach(bar => progressObserver.observe(bar));

  // === EASTER EGG: KONAMI CODE (Code Konami) ===
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      
      if (konamiIndex === konamiCode.length) {
        // Easter egg activé! (Easter egg activated!)
        document.body.style.animation = 'rainbow 2s linear infinite';
        
        // Créer les étoiles qui tombent (Create falling stars)
        for (let i = 0; i < 20; i++) {
          setTimeout(() => {
            createFallingStar();
          }, i * 100);
        }
        
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

  function createFallingStar() {
    const star = document.createElement('div');
    star.textContent = '⭐';
    star.style.cssText = `
      position: fixed;
      top: -50px;
      left: ${Math.random() * 100}vw;
      font-size: 2rem;
      pointer-events: none;
      z-index: 9999;
      animation: fall 3s linear forwards;
    `;
    
    document.body.appendChild(star);
    
    setTimeout(() => {
      star.remove();
    }, 3000);
  }

  // Ajouter l'animation de chute (Add falling animation)
  if (!document.querySelector('#fall-animation')) {
    const style = document.createElement('style');
    style.id = 'fall-animation';
    style.textContent = `
      @keyframes fall {
        to {
          top: 100vh;
          transform: rotate(360deg);
        }
      }
      
      @keyframes rainbow {
        0%, 100% { filter: hue-rotate(0deg); }
        50% { filter: hue-rotate(180deg); }
      }
    `;
    document.head.appendChild(style);
  }

  // === CONSOLE MESSAGE (Message console) ===
  console.log('%c🎮 ARCADE SOHAN 🎮', 'font-size: 24px; color: #00D4FF; font-weight: bold;');
  console.log('%cBienvenue dans le code source!', 'font-size: 14px; color: #FF6F91;');
  console.log('%cCe site a été créé pour expliquer le projet Arduino Arcade.', 'color: #B8B8D1;');
  console.log('%cTape le code Konami pour un easter egg! ↑↑↓↓←→←→BA', 'color: #FFE66D;');
  
});
