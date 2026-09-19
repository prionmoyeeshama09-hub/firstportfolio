document.addEventListener('DOMContentLoaded', () => {
    
    // --- Set current year in footer ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Sticky Header ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-links a, .nav-cta');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('open');
            document.body.classList.toggle('menu-open');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                mainNav.classList.remove('open');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // --- Active Navigation State ---
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);
            
            if(navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    });

    // --- Number Counter Animation ---
    const counters = document.querySelectorAll('.counter');
    let hasAnimated = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current) + (counter.innerText.includes('+') ? '+' : '');
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target + (counter.getAttribute('data-target') === '5' || counter.getAttribute('data-target') === '250' ? '+' : '');
                }
            };
            updateCounter();
        });
    };

    // Intersection Observer for Counters
    if ('IntersectionObserver' in window) {
        const statsSection = document.querySelector('.credibility-stats');
        if (statsSection) {
            const observer = new IntersectionObserver((entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && !hasAnimated) {
                    animateCounters();
                    hasAnimated = true;
                }
            }, { threshold: 0.5 });
            observer.observe(statsSection);
        }
    } else {
        // Fallback if IntersectionObserver is not supported
        animateCounters();
    }

    // --- Contact Form Handling ---
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            
            // Basic Validation
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const service = document.getElementById('service');
            const details = document.getElementById('details');
            
            [name, email, service, details].forEach(field => {
                if (!field.value.trim()) {
                    field.parentElement.classList.add('has-error');
                    isValid = false;
                } else {
                    field.parentElement.classList.remove('has-error');
                }
                
                // Remove error on input
                field.addEventListener('input', () => {
                    field.parentElement.classList.remove('has-error');
                }, { once: true });
            });
            
            // Email validation regex
            if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                email.parentElement.classList.add('has-error');
                isValid = false;
            }

            if (isValid) {
                const submitBtn = contactForm.querySelector('.submit-btn');
                const btnText = submitBtn.querySelector('.btn-text');
                const loadingState = submitBtn.querySelector('.loading-state');
                const successMsg = contactForm.querySelector('.success');
                const errorMsg = contactForm.querySelector('.error');
                
                // Loading state
                submitBtn.disabled = true;
                btnText.style.display = 'none';
                loadingState.style.display = 'inline-block';
                successMsg.style.display = 'none';
                errorMsg.style.display = 'none';
                
                // Simulate API call (fake delay)
                setTimeout(() => {
                    // Success state
                    contactForm.reset();
                    submitBtn.disabled = false;
                    btnText.style.display = 'inline-block';
                    loadingState.style.display = 'none';
                    successMsg.style.display = 'block';
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        successMsg.style.display = 'none';
                    }, 5000);
                }, 1500);
            }
        });
    }

    // --- Slow Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Unobserve after revealing to prevent repeating animation
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('active'));
    }

});
