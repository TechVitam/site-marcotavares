document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       Header Scroll Effect
       ========================================================================== */
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       Mobile Menu Toggle
       ========================================================================== */
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-list a');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            
            // Hamburger animation
            const spans = menuBtn.querySelectorAll('span');
            if (nav.classList.contains('active')) {
                spans[0].style.transform = 'translateY(8px) rotate(45deg)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                menuBtn.click();
            }
        });
    });

    /* ==========================================================================
       Smooth Scroll para Links Internos
       ========================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                // Considera a altura do header fixo
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ==========================================================================
       Scroll Animations (Intersection Observer)
       ========================================================================== */
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.05 // Baixado de 0.15 para disparar mais rápido no mobile
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Opcional: parar de observar após animar uma vez
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach(el => scrollObserver.observe(el));

    // Força a animação imediata nos elementos que já estão na tela ao carregar
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero .scroll-animate');
        heroElements.forEach(el => el.classList.add('is-visible'));
    }, 100);

    /* ==========================================================================
       Video Modal
       ========================================================================== */
    const playVideoBtn = document.querySelector('.play-video-btn');
    const videoModal = document.getElementById('video-modal');
    const closeModal = document.querySelector('.close-modal');

    if (playVideoBtn && videoModal && closeModal) {
        playVideoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            videoModal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Previne scroll da página
        });

        closeModal.addEventListener('click', () => {
            videoModal.classList.remove('show');
            document.body.style.overflow = '';
        });

        // Fechar ao clicar fora do modal
        window.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                videoModal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }

    /* ==========================================================================
       Swiper Carousel (Google Reviews)
       ========================================================================== */
    const reviewsSwiper = new Swiper('.reviews-swiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30,
            }
        }
    });

});
