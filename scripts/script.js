// Alternancia de modo oscuro (dark mode)
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    // Guarda la preferencia del usuario en localStorage
    if (html.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

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
    const voltage = parseFloat(voltageSlider.value);
    const resistance = parseFloat(resistanceSlider.value);
    const current = resistance > 0 ? voltage / resistance : 0;

    voltageValue.textContent = `${voltage.toFixed(1)} V`;
    resistanceValue.textContent = `${resistance} Ω`;
    currentCalculated.textContent = `${current.toFixed(2)} A`;

    voltageDisplay.textContent = `${voltage.toFixed(1)} V`;
    resistanceDisplay.textContent = `${resistance} Ω`;
    currentDisplay.textContent = `${current.toFixed(2)} A`;

    // Ajusta el brillo del foco según el voltaje
    const brightness = Math.min(voltage / 12, 1);
    bulb.style.opacity = 0.5 + (brightness * 0.5);

    // Ajusta la velocidad de los electrones SVG según la corriente
    const electronsGroup = document.getElementById('electrons');
    if (electronsGroup) {
        // A mayor corriente, menor duración (más rápido)
        // Limita la duración entre 0.5s (rápido) y 4s (lento)
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

// --- Lógica de desafíos Ley de Ohm ---

// Referencias a los elementos del DOM para desafíos
const challengeQuestion = document.getElementById('challenge-question');
const answerInput = document.getElementById('answer');
const checkAnswerBtn = document.getElementById('check-answer');
const newChallengeBtn = document.getElementById('new-challenge');
const feedbackDiv = document.getElementById('feedback');
const difficultySpan = document.getElementById('difficulty');

// Lista de desafíos posibles
const challenges = [
    // Fácil
    { v: 9, r: 45, dificultad: "Fácil" },
    { v: 12, r: 6, dificultad: "Fácil" },
    { v: 5, r: 10, dificultad: "Fácil" },
    // Medio
    { v: 24, r: 8, dificultad: "Medio" },
    { v: 18, r: 3, dificultad: "Medio" },
    { v: 15, r: 5, dificultad: "Medio" },
    // Difícil
    { v: 230, r: 115, dificultad: "Difícil" },
    { v: 120, r: 33, dificultad: "Difícil" },
    { v: 48, r: 2.2, dificultad: "Difícil" }
];

let currentChallenge = null;

// Progreso de insignias y aciertos
let badges = {
    badge1: false, // Ohm Iniciado
    badge2: false, // Experto en V=IR
    badge3: false, // Maestro de Circuitos
    badge4: false  // Leyenda de Ohm
};
let correctCount = 0;
let correctStreak = 0;

/**
 * Genera un nuevo desafío aleatorio y actualiza la interfaz.
 * Esta función puede moverse a un módulo "desafios.js".
 */
function generateChallenge() {
    const idx = Math.floor(Math.random() * challenges.length);
    currentChallenge = challenges[idx];
    challengeQuestion.textContent = `Calcula la corriente en un circuito con ${currentChallenge.v}V y ${currentChallenge.r}Ω de resistencia`;
    difficultySpan.textContent = currentChallenge.dificultad;
    answerInput.value = '';
    feedbackDiv.classList.add('hidden');
    feedbackDiv.textContent = '';
}

/**
 * Carga el progreso de insignias y aciertos desde localStorage.
 * Esta función puede moverse a un módulo "insignias.js".
 */
function loadProgress() {
    const saved = localStorage.getItem('ohm_badges');
    if (saved) {
        const data = JSON.parse(saved);
        badges = data.badges || badges;
        correctCount = data.correctCount || 0;
        correctStreak = data.correctStreak || 0;
    }
    updateBadgesUI();
}

/**
 * Guarda el progreso de insignias y aciertos en localStorage.
 */
function saveProgress() {
    localStorage.setItem('ohm_badges', JSON.stringify({
        badges,
        correctCount,
        correctStreak
    }));
}

/**
 * Actualiza la visualización de las insignias y el resumen de progreso.
 * Si se pasa popBadge, se anima la insignia desbloqueada.
 */
function updateBadgesUI(popBadge) {
    const badge1 = document.getElementById('badge1');
    const badge2 = document.getElementById('badge2');
    const badge3 = document.getElementById('badge3');
    const badge4 = document.getElementById('badge4');
    const badgesProgress = document.getElementById('badges-progress');
    let unlocked = 0;
    if (badge1) {
        badge1.className = `fas fa-bolt ${badges.badge1 ? 'text-yellow-500' : 'text-gray-400'}`;
        if (popBadge === 'badge1') {
            badge1.classList.add('badge-pop');
            setTimeout(() => badge1.classList.remove('badge-pop'), 600);
        }
        if (badges.badge1) unlocked++;
    }
    if (badge2) {
        badge2.className = `fas fa-medal ${badges.badge2 ? 'text-yellow-500' : 'text-gray-400'}`;
        if (popBadge === 'badge2') {
            badge2.classList.add('badge-pop');
            setTimeout(() => badge2.classList.remove('badge-pop'), 600);
        }
        if (badges.badge2) unlocked++;
    }
    if (badge3) {
        badge3.className = `fas fa-brain ${badges.badge3 ? 'text-yellow-500' : 'text-gray-400'}`;
        if (popBadge === 'badge3') {
            badge3.classList.add('badge-pop');
            setTimeout(() => badge3.classList.remove('badge-pop'), 600);
        }
        if (badges.badge3) unlocked++;
    }
    if (badge4) {
        badge4.className = `fas fa-trophy ${badges.badge4 ? 'text-yellow-500' : 'text-gray-400'}`;
        if (popBadge === 'badge4') {
            badge4.classList.add('badge-pop');
            setTimeout(() => badge4.classList.remove('badge-pop'), 600);
        }
        if (badges.badge4) unlocked++;
    }
    // Muestra el resumen de progreso
    if (badgesProgress) {
        badgesProgress.textContent = `Progreso: ${unlocked}/4 (${Math.round((unlocked/4)*100)}%)`;
    }
}

/**
 * Desbloquea insignias y anima la insignia correspondiente.
 */
function unlockBadge(difficulty) {
    let updated = false;
    let popBadge = null;
    if (!badges.badge1) {
        badges.badge1 = true;
        updated = true;
        popBadge = 'badge1';
    }
    if (!badges.badge2 && (correctCount >= 5 || difficulty === "Medio")) {
        badges.badge2 = true;
        updated = true;
        popBadge = 'badge2';
    }
    if (!badges.badge3 && (correctCount >= 10 || difficulty === "Difícil")) {
        badges.badge3 = true;
        updated = true;
        popBadge = 'badge3';
    }
    if (!badges.badge4 && correctStreak >= 5) {
        badges.badge4 = true;
        updated = true;
        popBadge = 'badge4';
    }
    if (updated) updateBadgesUI(popBadge);
    else updateBadgesUI();
    saveProgress();
}

// Botón para reiniciar progreso de insignias
const resetBadgesBtn = document.getElementById('reset-badges-btn');
if (resetBadgesBtn) {
    resetBadgesBtn.addEventListener('click', () => {
        if (confirm('¿Seguro que deseas reiniciar tu progreso de insignias?')) {
            badges = { badge1: false, badge2: false, badge3: false, badge4: false };
            correctCount = 0;
            correctStreak = 0;
            saveProgress();
            updateBadgesUI();
        }
    });
}

/**
 * Verifica la respuesta del usuario en los desafíos y muestra retroalimentación.
 */
function checkAnswer() {
    if (!currentChallenge) return;
    const userValue = parseFloat(answerInput.value);
    const correct = currentChallenge.v / currentChallenge.r;
    if (isNaN(userValue)) {
        feedbackDiv.textContent = "Por favor, ingresa un valor numérico.";
        feedbackDiv.className = "mt-4 p-3 rounded-lg bg-yellow-100 text-yellow-800";
        feedbackDiv.classList.remove('hidden');
        return;
    }
    // Permite un margen de error de 0.02
    if (Math.abs(userValue - correct) < 0.02) {
        feedbackDiv.textContent = `¡Correcto! La respuesta es ${correct.toFixed(2)} A.`;
        feedbackDiv.className = "mt-4 p-3 rounded-lg bg-green-100 text-green-800";
        feedbackDiv.classList.remove('hidden');
        correctCount++;
        correctStreak++;
        unlockBadge(currentChallenge.dificultad);
    } else {
        feedbackDiv.textContent = `Incorrecto. La respuesta correcta es ${correct.toFixed(2)} A.`;
        feedbackDiv.className = "mt-4 p-3 rounded-lg bg-red-100 text-red-800";
        feedbackDiv.classList.remove('hidden');
        correctStreak = 0;
        saveProgress();
    }
}

// Inicialización de eventos y controles
// Si el proyecto crece, puedo agrupar los listeners en módulos separados.
if (checkAnswerBtn && answerInput) {
    checkAnswerBtn.addEventListener('click', checkAnswer);
    answerInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') checkAnswer();
    });
}
if (newChallengeBtn) {
    newChallengeBtn.addEventListener('click', generateChallenge);
}

// Inicializa el primer desafío y carga el progreso al cargar la página
if (challengeQuestion) {
    loadProgress();
    generateChallenge();
}

// Listeners para sliders
voltageSlider.addEventListener('input', updateDisplays);
resistanceSlider.addEventListener('input', updateDisplays);

// Inicializa la visualización del simulador
updateDisplays();

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
    // Cierra el modal al hacer clic fuera del contenido
    badgesInfoModal.addEventListener('click', (e) => {
        if (e.target === badgesInfoModal) {
            badgesInfoModal.classList.add('hidden');
        }
    });
}

