document.addEventListener('DOMContentLoaded', function() {
    // Alternancia de modo oscuro (dark mode)
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            html.classList.toggle('dark');
            // Guarda la preferencia del usuario en localStorage
            if (html.classList.contains('dark')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Verifica la preferencia de tema guardada o la del sistema
    if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }

    // Referencias a los elementos del simulador de la Ley de Ohm
    const voltageSlider = document.getElementById('voltage');
    const resistanceSlider = document.getElementById('resistance');
    const voltageValue = document.getElementById('voltage-value');
    const resistanceValue = document.getElementById('resistance-value');
    const currentCalculated = document.getElementById('current-calculated');
    const voltageDisplay = document.getElementById('voltage-display');
    const currentDisplay = document.getElementById('current-display');
    const resistanceDisplay = document.getElementById('resistance-display');
    const bulb = document.getElementById('bulb');

    /**
     * Actualiza los valores visuales del simulador y la animación de los electrones.
     * Si el proyecto crece, este bloque puede moverse a un módulo "simulador.js".
     */
    function updateDisplays() {
        if (!voltageSlider || !resistanceSlider) return;
        const voltage = parseFloat(voltageSlider.value);
        const resistance = parseFloat(resistanceSlider.value);
        const current = resistance > 0 ? voltage / resistance : 0;

        if (voltageValue) voltageValue.textContent = `${voltage.toFixed(1)} V`;
        if (resistanceValue) resistanceValue.textContent = `${resistance} Ω`;
        if (currentCalculated) currentCalculated.textContent = `${current.toFixed(2)} A`;

        if (voltageDisplay) voltageDisplay.textContent = `${voltage.toFixed(1)} V`;
        if (resistanceDisplay) resistanceDisplay.textContent = `${resistance} Ω`;
        if (currentDisplay) currentDisplay.textContent = `${current.toFixed(2)} A`;

        // Ajusta el brillo del foco según el voltaje
        if (bulb) {
            const brightness = Math.min(voltage / 12, 1);
            bulb.style.opacity = 0.5 + (brightness * 0.5);
        }

        // Ajusta la velocidad de los electrones SVG según la corriente
        const electronsGroup = document.getElementById('electrons');
        if (electronsGroup) {
            let dur = 2;
            if (current > 0) {
                dur = Math.max(0.5, Math.min(4, 2 / current));
            }
            const motions = electronsGroup.querySelectorAll('animateMotion');
            motions.forEach(motion => {
                motion.setAttribute('dur', dur + 's');
            });
        }
    }

    // Inicializa la visualización del simulador
    updateDisplays();

    if (voltageSlider) voltageSlider.addEventListener('input', updateDisplays);
    if (resistanceSlider) resistanceSlider.addEventListener('input', updateDisplays);

    // Inicialización de eventos y controles para desafíos e insignias
    if (typeof window.initDesafios === 'function') {
        window.initDesafios();
    }
    if (typeof window.initInsignias === 'function') {
        window.initInsignias();
    }

    // Lógica del modal de información de insignias
    const badgesInfoBtn = document.getElementById('badges-info-btn');
    const badgesInfoModal = document.getElementById('badges-info-modal');
    const closeBadgesInfo = document.getElementById('close-badges-info');

    if (badgesInfoBtn && badgesInfoModal && closeBadgesInfo) {
        badgesInfoBtn.addEventListener('click', () => {
            badgesInfoModal.classList.remove('hidden');
        });
        closeBadgesInfo.addEventListener('click', () => {
            badgesInfoModal.classList.add('hidden');
        });
        badgesInfoModal.addEventListener('click', (e) => {
            if (e.target === badgesInfoModal) {
                badgesInfoModal.classList.add('hidden');
            }
        });
    }
});

