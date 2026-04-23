/* ============================================
   Ngoola (Pty) Ltd | Engineering & Infrastructure Solutions
   Interactive Functionality
   Author: Antswisa Solutions
   Description: Mobile menu toggle, smooth scrolling, 
                and FormSubmit AJAX integration with user feedback
   ============================================ */

(function() {
    'use strict';

    // Wait for DOM to be fully loaded before executing
    document.addEventListener('DOMContentLoaded', function() {
        
        /* ============================================
           1. MOBILE MENU TOGGLE
           ============================================ */
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('nav ul');
        
        if (menuToggle && navMenu) {
            // Toggle menu when clicking the hamburger button
            menuToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                navMenu.classList.toggle('showing');
                // Update aria-expanded for accessibility
                const isExpanded = navMenu.classList.contains('showing');
                menuToggle.setAttribute('aria-expanded', isExpanded);
                menuToggle.textContent = isExpanded ? '✕ Close' : '☰ Menu';
            });
            
            // Close mobile menu when clicking on any nav link
            const navLinks = document.querySelectorAll('nav a');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    navMenu.classList.remove('showing');
                    if (menuToggle) {
                        menuToggle.setAttribute('aria-expanded', 'false');
                        menuToggle.textContent = '☰ Menu';
                    }
                });
            });
            
            // Close menu when clicking outside (optional enhancement)
            document.addEventListener('click', function(e) {
                if (navMenu.classList.contains('showing') && 
                    !navMenu.contains(e.target) && 
                    !menuToggle.contains(e.target)) {
                    navMenu.classList.remove('showing');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    menuToggle.textContent = '☰ Menu';
                }
            });
        }
        
        /* ============================================
           2. SMOOTH SCROLLING FOR ANCHOR LINKS
           ============================================ */
        const allLinks = document.querySelectorAll('a[href^="#"]');
        
        allLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                // Skip if it's just "#" or empty
                if (targetId === '#' || targetId === '') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const offset = 80; // Height of sticky navbar + some padding
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        /* ============================================
           3. CONTACT FORM SUBMISSION (FormSubmit + AJAX)
           ============================================ */
        const contactForm = document.getElementById('contactForm');
        const formStatus = document.getElementById('formStatus');
        
        if (contactForm && formStatus) {
            contactForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(contactForm);
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.textContent;
                
                // Validate required fields (basic check)
                const name = formData.get('name')?.trim();
                const email = formData.get('email')?.trim();
                const message = formData.get('message')?.trim();
                
                if (!name || !email || !message) {
                    showFormMessage('Please fill in all required fields.', 'error');
                    return;
                }
                
                if (!isValidEmail(email)) {
                    showFormMessage('Please enter a valid email address.', 'error');
                    return;
                }
                
                // Disable button and show loading state
                submitButton.disabled = true;
                submitButton.textContent = 'Sending... ✉️';
                
                try {
                    // Send form data to FormSubmit endpoint
                    const response = await fetch(contactForm.action, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        // Success - show confirmation and reset form
                        showFormMessage('✓ Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');
                        contactForm.reset();
                        
                        // Optional: Clear success message after 6 seconds
                        setTimeout(() => {
                            if (formStatus) {
                                formStatus.style.display = 'none';
                            }
                        }, 6000);
                    } else {
                        // Server responded with error
                        throw new Error('Form submission failed with status: ' + response.status);
                    }
                } catch (error) {
                    console.error('Form submission error:', error);
                    showFormMessage('✗ Sorry, there was an error sending your message. Please try again or email us directly at admin@ngoola.com', 'error');
                    
                    // Auto-hide error after 7 seconds
                    setTimeout(() => {
                        if (formStatus) {
                            formStatus.style.display = 'none';
                        }
                    }, 7000);
                } finally {
                    // Re-enable submit button and restore original text
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }
            });
        }
        
        /* ============================================
           Helper Function: Display Form Messages
           ============================================ */
        function showFormMessage(message, type) {
            if (!formStatus) return;
            
            formStatus.textContent = message;
            formStatus.style.display = 'block';
            
            // Remove previous classes and add appropriate styling
            formStatus.classList.remove('error');
            if (type === 'error') {
                formStatus.classList.add('error');
                formStatus.style.background = '#f8d7da';
                formStatus.style.color = '#721c24';
            } else {
                formStatus.style.background = '#d4edda';
                formStatus.style.color = '#155724';
            }
            
            // Scroll to message for better UX
            formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        
        /* ============================================
           Helper Function: Email Validation
           ============================================ */
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
            return emailRegex.test(email);
        }
        
        /* ============================================
           4. ADD ACTIVE NAVIGATION HIGHLIGHT (Optional Enhancement)
           ============================================ */
        const sections = document.querySelectorAll('section[id]');
        
        function updateActiveNav() {
            const scrollPosition = window.scrollY + 100; // Offset for sticky header
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                const sectionId = section.getAttribute('id');
                const navLink = document.querySelector(`nav a[href="#${sectionId}"]`);
                
                if (navLink && scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    // Remove active class from all links
                    document.querySelectorAll('nav a').forEach(link => {
                        link.style.color = '';
                        link.style.borderBottom = 'none';
                    });
                    // Add active style to current section link
                    navLink.style.color = 'var(--secondary)';
                } else if (navLink && scrollPosition < sectionTop) {
                    navLink.style.color = '';
                }
            });
            
            // Handle hero section when at top of page
            if (window.scrollY < 100) {
                document.querySelectorAll('nav a').forEach(link => {
                    link.style.color = '';
                });
                const homeLink = document.querySelector('nav a[href="#overview"]');
                if (homeLink) homeLink.style.color = 'var(--secondary)';
            }
        }
        
        // Throttle scroll event for better performance
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = window.requestAnimationFrame(function() {
                updateActiveNav();
            });
        });
        
        // Initial call to set active nav on page load
        updateActiveNav();
        
        /* ============================================
           5. HANDLE MISSING IMAGES GRACEFULLY (Fallback)
           ============================================ */
        const allImages = document.querySelectorAll('img');
        allImages.forEach(img => {
            img.addEventListener('error', function() {
                // If logo image fails, set a default background but don't break layout
                if (this.src.includes('logo.png') || this.src.includes('process2.jpg') || 
                    this.src.includes('project') || this.src.includes('water.jpg') || 
                    this.src.includes('lub2.jpg')) {
                    this.style.opacity = '0.7';
                    this.alt = 'Image placeholder - ' + this.alt;
                    // Optionally set a fallback background color
                    this.style.backgroundColor = '#e0e0e0';
                }
            });
        });
        
        console.log('Ngoola website initialized successfully');
    });
})();