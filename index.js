/* ============================================
   NGoola (Pty) Ltd | Interactive Functionality
   ============================================ */

(function() {
  'use strict';

  /* ============================================
     MOBILE MENU TOGGLE
     =========================================== */
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('nav ul');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      navMenu.classList.toggle('showing');
      menuToggle.textContent = navMenu.classList.contains('showing') ? '✕ Close' : '☰ Menu';
    });
    
    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('showing');
        if (menuToggle) menuToggle.textContent = '☰ Menu';
      });
    });
  }

  /* ============================================
     SMOOTH SCROLLING FOR ANCHOR LINKS
     =========================================== */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    });
  });

  /* ============================================
     CONTACT FORM SUBMISSION (FormSubmit AJAX)
     =========================================== */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  
  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      // Validate email
      const email = formData.get('email');
      const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
      if (!emailRegex.test(email)) {
        formStatus.style.display = 'block';
        formStatus.textContent = '✗ Please enter a valid email address.';
        formStatus.style.background = '#f8d7da';
        formStatus.style.color = '#721c24';
        setTimeout(() => { formStatus.style.display = 'none'; }, 3000);
        return;
      }
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      
      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        
        if (response.ok) {
          formStatus.style.display = 'block';
          formStatus.textContent = '✓ Thank you! Your message has been sent successfully. We will get back to you soon.';
          formStatus.style.background = '#d4edda';
          formStatus.style.color = '#155724';
          contactForm.reset();
          setTimeout(() => { formStatus.style.display = 'none'; }, 5000);
        } else {
          throw new Error('Submission failed');
        }
      } catch (error) {
        formStatus.style.display = 'block';
        formStatus.textContent = '✗ Sorry, there was an error sending your message. Please email us directly at admin@ngoola.com';
        formStatus.style.background = '#f8d7da';
        formStatus.style.color = '#721c24';
        setTimeout(() => { formStatus.style.display = 'none'; }, 5000);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  /* ============================================
     ACTIVE NAVIGATION HIGHLIGHT ON SCROLL
     =========================================== */
  const sections = document.querySelectorAll('section[id]');
  
  function updateActiveNav() {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`nav a[href="#${id}"]`);
      
      if (link && scrollPos >= top && scrollPos < bottom) {
        document.querySelectorAll('nav a').forEach(l => l.style.color = '');
        link.style.color = 'var(--secondary)';
      }
    });
  }
  
  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  /* ============================================
     IMAGE ERROR HANDLING (FALLBACK)
     =========================================== */
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      this.style.opacity = '0.7';
      this.style.backgroundColor = '#e0e0e0';
    });
  });

  /* ============================================
     CONSOLE CONFIRMATION
     =========================================== */
  console.log('Ngoola website loaded successfully');
})();