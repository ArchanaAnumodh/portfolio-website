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

// Add this to your script.js file

// DYNAMIC IMAGE SIZE OPTIMIZER
(function() {
  'use strict';

  // Configuration
  const config = {
    quality: 0.8, // Image quality (0.1 to 1.0)
    maxWidth: {
      mobile: 400,
      tablet: 600,
      desktop: 800
    },
    maxHeight: {
      mobile: 300,
      tablet: 450,
      desktop: 600
    }
  };

  // Detect device type
  function getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  // Compress and resize image
  function optimizeImage(img) {
    return new Promise((resolve, reject) => {
      // Skip if already optimized
      if (img.dataset.optimized === 'true') {
        resolve(img);
        return;
      }

      const deviceType = getDeviceType();
      const maxWidth = config.maxWidth[deviceType];
      const maxHeight = config.maxHeight[deviceType];

      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Create temporary image to load original
      const tempImg = new Image();
      tempImg.crossOrigin = 'anonymous';

      tempImg.onload = function() {
        // Calculate new dimensions
        let width = tempImg.width;
        let height = tempImg.height;

        // Maintain aspect ratio
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(tempImg, 0, 0, width, height);

        // Convert to blob and create URL
        canvas.toBlob(
          function(blob) {
            const optimizedUrl = URL.createObjectURL(blob);
            img.src = optimizedUrl;
            img.dataset.optimized = 'true';
            img.dataset.originalSrc = tempImg.src;
            
            // Log size reduction
            console.log(`Optimized ${img.alt}: ${(blob.size / 1024).toFixed(2)} KB`);
            resolve(img);
          },
          'image/jpeg',
          config.quality
        );
      };

      tempImg.onerror = function() {
        console.warn(`Failed to optimize image: ${img.src}`);
        resolve(img);
      };

      tempImg.src = img.src;
    });
  }

  // Lazy loading with Intersection Observer
  function setupLazyLoading() {
    const images = document.querySelectorAll('img:not([data-optimized])');
    
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // Add loading indicator
            img.style.opacity = '0.5';
            img.style.transition = 'opacity 0.3s';

            optimizeImage(img).then(() => {
              img.style.opacity = '1';
              observer.unobserve(img);
            });
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
        threshold: 0.01
      }
    );

    images.forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Re-optimize on window resize (debounced)
  let resizeTimer;
  function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const currentDevice = getDeviceType();
      const images = document.querySelectorAll('img[data-optimized="true"]');
      
      images.forEach(img => {
        // Reset optimization flag to trigger re-optimization
        img.dataset.optimized = 'false';
        if (img.dataset.originalSrc) {
          img.src = img.dataset.originalSrc;
        }
        optimizeImage(img);
      });
    }, 500);
  }

  // Initialize
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupLazyLoading);
    } else {
      setupLazyLoading();
    }

    // Re-optimize on orientation/resize change
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
  }

  // Start optimization
  init();

})();

// PROGRESSIVE IMAGE LOADING
// Add blur-up effect for better UX
(function() {
  const style = document.createElement('style');
  style.textContent = `
    img[data-optimized="false"] {
      filter: blur(5px);
      transform: scale(1.05);
    }
    
    img[data-optimized="true"] {
      filter: blur(0);
      transform: scale(1);
      transition: filter 0.3s ease, transform 0.3s ease;
    }
    
    .img-loading {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
  document.head.appendChild(style);
})();

// ADDITIONAL: Convert images to WebP format (if browser supports)
function supportsWebP() {
  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
}

// Use WebP if supported
if (supportsWebP()) {
  console.log('WebP supported - using optimized format');
  config.format = 'image/webp';
} else {
  console.log('WebP not supported - using JPEG');
  config.format = 'image/jpeg';
}