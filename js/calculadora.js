document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       Header & Mobile Menu (same logic as main site)
       ========================================================================== */
    const header = document.querySelector('.header');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');

    window.addEventListener('scroll', () => {
        // Header is always styled dark on calc page, no toggle needed
    });

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
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

    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) menuBtn.click();
        });
    });

    /* ==========================================================================
       Scroll Animations (Intersection Observer)
       ========================================================================== */
    const observerOptions = { root: null, rootMargin: '50px', threshold: 0.05 };
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-animate').forEach(el => scrollObserver.observe(el));

    // Hero elements — animate immediately
    setTimeout(() => {
        document.querySelectorAll('.calc-hero .scroll-animate').forEach(el => el.classList.add('is-visible'));
    }, 100);

    /* ==========================================================================
       Lysholm Calculator Logic
       ========================================================================== */
    const categories = ['mancar', 'apoio', 'travamento', 'instabilidade', 'dor', 'inchaco', 'escadas', 'agachamento'];
    const maxScores = { mancar: 5, apoio: 5, travamento: 15, instabilidade: 25, dor: 25, inchaco: 10, escadas: 10, agachamento: 5 };
    const categoryLabels = { mancar: 'Mancar', apoio: 'Apoio', travamento: 'Travamento', instabilidade: 'Instabilidade', dor: 'Dor', inchaco: 'Inchaço', escadas: 'Subindo Escadas', agachamento: 'Agachamento' };

    const form = document.getElementById('lysholmForm');
    const submitBtn = document.getElementById('calcSubmitBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const resultWrapper = document.getElementById('resultWrapper');
    const steps = Array.from(document.querySelectorAll('.calc-step'));
    let currentStep = 0;
    const totalSteps = steps.length;

    function updateStepVisibility() {
        steps.forEach((step, index) => {
            if (index === currentStep) {
                step.style.display = 'block';
                step.classList.add('active');
            } else {
                step.style.display = 'none';
                step.classList.remove('active');
            }
        });

        const pct = (currentStep / (totalSteps - 1)) * 100;
        progressFill.style.width = pct + '%';
        progressText.textContent = `Passo ${currentStep + 1} de ${totalSteps}`;

        prevBtn.style.display = currentStep > 0 ? 'inline-flex' : 'none';
        
        if (currentStep === totalSteps - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-flex';
        } else {
            nextBtn.style.display = 'inline-flex';
            submitBtn.style.display = 'none';
        }

        validateStep();
    }

    function validateStep() {
        let isValid = false;
        if (currentStep === 0) {
            const nome = document.getElementById('pacienteNome').value.trim();
            const idade = document.getElementById('pacienteIdade').value.trim();
            isValid = nome !== '' && idade !== '';
        } else {
            const catName = categories[currentStep - 1];
            isValid = !!form.querySelector(`input[name="${catName}"]:checked`);
        }
        
        nextBtn.disabled = !isValid;
        submitBtn.disabled = !isValid;
    }

    form.addEventListener('input', validateStep);
    
    // Prevent Enter from submitting and trigger Next instead
    form.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!nextBtn.disabled && nextBtn.style.display !== 'none') {
                nextBtn.click();
            } else if (!submitBtn.disabled && submitBtn.style.display !== 'none') {
                submitBtn.click();
            }
        }
    });

    form.addEventListener('change', (e) => {
        if (e.target.type === 'radio') {
            const name = e.target.name;
            const groupOptions = form.querySelectorAll(`input[name="${name}"]`);
            groupOptions.forEach(input => input.closest('.calc-option').classList.remove('selected'));
            e.target.closest('.calc-option').classList.add('selected');
            
            e.target.closest('.calc-category').classList.add('completed');
            validateStep();

            setTimeout(() => {
                if(currentStep < totalSteps - 1) {
                    currentStep++;
                    updateStepVisibility();
                }
            }, 300);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps - 1) {
            currentStep++;
            updateStepVisibility();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateStepVisibility();
        }
    });

    updateStepVisibility();

    // Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let total = 0;
        const scores = {};

        categories.forEach(cat => {
            const checked = form.querySelector(`input[name="${cat}"]:checked`);
            const val = checked ? parseInt(checked.value, 10) : 0;
            scores[cat] = val;
            total += val;
        });

        showResult(total, scores);
    });

    function getClassification(score) {
        if (score >= 95) return { label: 'Excelente', key: 'excelente', desc: 'Seu joelho apresenta excelente funcionalidade. Continue cuidando da saúde articular com exercícios regulares.' };
        if (score >= 84) return { label: 'Bom', key: 'bom', desc: 'Boa funcionalidade do joelho. Algumas limitações podem ser trabalhadas com acompanhamento profissional.' };
        if (score >= 65) return { label: 'Regular', key: 'regular', desc: 'Funcionalidade moderada. Uma avaliação especializada pode ajudar a identificar pontos de melhoria.' };
        return { label: 'Ruim', key: 'ruim', desc: 'Funcionalidade comprometida. É recomendada uma avaliação profissional para definir o melhor plano de tratamento.' };
    }

    function showResult(total, scores) {
        const classification = getClassification(total);

        // Hide form, show result
        form.style.display = 'none';
        document.querySelector('.calc-progress-wrapper').style.display = 'none';
        resultWrapper.style.display = 'block';

        // Scroll to result
        resultWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Classification styling
        const resultEl = document.querySelector('.calc-result');
        resultEl.className = 'calc-result scroll-animate fade-up classification-' + classification.key;

        // Badge & description
        document.getElementById('classificationBadge').textContent = classification.label;
        document.getElementById('classificationDesc').textContent = classification.desc;

        // Animate score ring
        const ringFill = document.getElementById('ringFill');
        const circumference = 2 * Math.PI * 88; // r=88
        const offset = circumference - (total / 100) * circumference;

        ringFill.style.strokeDasharray = circumference;
        ringFill.style.strokeDashoffset = circumference;

        // Animate number
        const scoreNumber = document.getElementById('scoreNumber');
        scoreNumber.textContent = '0';

        setTimeout(() => {
            // Trigger animation
            resultEl.classList.add('is-visible');
            ringFill.style.strokeDashoffset = offset;

            // Animate number counting
            animateCounter(scoreNumber, 0, total, 1200);
        }, 200);

        // Breakdown
        const grid = document.getElementById('breakdownGrid');
        grid.innerHTML = '';
        categories.forEach(cat => {
            const item = document.createElement('div');
            item.className = 'calc-breakdown-item';
            item.innerHTML = `
                <span class="calc-breakdown-label">${categoryLabels[cat]}</span>
                <span class="calc-breakdown-value">${scores[cat]} / ${maxScores[cat]}</span>
            `;
            grid.appendChild(item);
        });
    }

    function animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (end - start) * eased);
            element.textContent = current;
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    document.getElementById('resetBtn').addEventListener('click', () => {
        form.reset();
        form.style.display = '';
        document.querySelector('.calc-progress-wrapper').style.display = '';
        resultWrapper.style.display = 'none';

        // Reset visual states
        document.querySelectorAll('.calc-option').forEach(opt => opt.classList.remove('selected'));
        document.querySelectorAll('.calc-category').forEach(cat => cat.classList.remove('completed'));

        currentStep = 0;
        updateStepVisibility();

        // Scroll to top of form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

});
