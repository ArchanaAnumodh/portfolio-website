// SMOOTH SCROLL FOR NAVIGATION LINKS
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ACTIVE NAV LINK ON SCROLL & HEADER BACKGROUND
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  let current = '';
  
  // Add background to header on scroll
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  // Update active navigation link
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// PHOTO GALLERY - HIGHLIGHT ON MOUSE PROXIMITY
const photoCards = document.querySelectorAll('.photo-card');

// Initial animation - show photos one by one
photoCards.forEach((card, index) => {
  setTimeout(() => {
    card.style.opacity = '0.85';
    card.style.transform = `scale(0) ${card.style.transform}`;
    setTimeout(() => {
      card.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      card.style.transform = card.style.transform.replace('scale(0)', 'scale(1)');
    }, 50);
  }, index * 150);
});

// Mouse movement effect
document.addEventListener('mousemove', (e) => {
  photoCards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;
    
    const deltaX = e.clientX - cardCenterX;
    const deltaY = e.clientY - cardCenterY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Highlight cards near the mouse (within 300px)
    if (distance < 300) {
      const scale = 1 + (300 - distance) / 1000;
      card.style.opacity = '1';
      card.style.zIndex = Math.floor(100 - distance);
      card.style.filter = 'brightness(1.1)';
    } else {
      card.style.opacity = '0.85';
      card.style.zIndex = '1';
      card.style.filter = 'brightness(1)';
    }
  });
});

// Click to bring photo to front
photoCards.forEach(card => {
  card.addEventListener('click', () => {
    // Reset all cards
    photoCards.forEach(c => {
      c.style.zIndex = '1';
      c.style.transform = c.style.transform.replace(/scale\([^)]*\)/, 'scale(1)');
    });
    
    // Bring clicked card to front
    card.style.zIndex = '200';
    const currentRotation = card.style.transform.match(/rotate\([^)]*\)/)[0];
    card.style.transform = `scale(1.2) rotate(0deg)`;
    
    // Reset after 2 seconds
    setTimeout(() => {
      card.style.zIndex = '1';
      card.style.transform = card.style.transform.replace('scale(1.2) rotate(0deg)', `scale(1) ${currentRotation}`);
    }, 2000);
  });
});

// SKILL CARDS ANIMATION ON SCROLL
const skillCards = document.querySelectorAll('.skill-card');

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 100);
    }
  });
}, observerOptions);

skillCards.forEach(card => observer.observe(card));

// PARALLAX EFFECT ON MOUSE MOVE
document.addEventListener('mousemove', (e) => {
  const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
  const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
  
  const bgAnimation = document.querySelector('.bg-animation');
  bgAnimation.style.transform = `translate(${moveX}px, ${moveY}px)`;
});