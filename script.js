document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SELETORES EM CACHE ---
    const header = document.querySelector('header');
    const revealElements = document.querySelectorAll('.reveal');
    const links = document.querySelectorAll('a[href^="#"]');

    // --- 2. BARRA DE PROGRESSO DO SCROLL ---
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.setAttribute('aria-hidden', 'true');
    document.body.prepend(progressBar);

    // --- 3. CONTROLE DE SCROLL DE ALTA PERFORMANCE (requestAnimationFrame + passive listener) ---
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollMetrics = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Atualiza a barra de progresso do scroll
        if (docHeight > 0) {
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${scrollPercent}%`;
        } else {
            progressBar.style.width = '0%';
        }

        // Adiciona classe sticky ao header com base no limite
        if (scrollTop > 40) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }

        lastScrollY = scrollTop;
        ticking = false;
    };

    const onScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(updateScrollMetrics);
            ticking = true;
        }
    };

    // Configurando listener passivo para máxima performance mobile no scroll (Evita CLS/Jank)
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Execução inicial caso a página comece com scroll
    updateScrollMetrics();

    // --- 4. ANIMAÇÃO SCROLL REVEAL (INTERSECTION OBSERVER) ---
    const revealObserverOptions = {
        root: null, // viewport
        threshold: 0.1, // reduzido para 10% para disparar mais cedo e evitar CLS
        rootMargin: '0px 0px -40px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Deixa de observar após ativar
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // --- 5. ROLAGEM SUAVE OTIMIZADA PARA LINKS INTERNOS ---
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerHeight - 15;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

