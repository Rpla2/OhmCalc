// Módulo combinado de desafíos y gestión de insignias para Ley de Ohm
(function() {
    // --- Referencias a elementos del DOM ---
    const challengeQuestion = document.getElementById('challenge-question');
    const answerInput = document.getElementById('answer');
    const checkAnswerBtn = document.getElementById('check-answer');
    const newChallengeBtn = document.getElementById('new-challenge');
    const feedbackDiv = document.getElementById('feedback');
    const difficultySpan = document.getElementById('difficulty');
    const badge1 = document.getElementById('badge1');
    const badge2 = document.getElementById('badge2');
    const badge3 = document.getElementById('badge3');
    const badge4 = document.getElementById('badge4');
    const badgesProgress = document.getElementById('badges-progress');
    const resetBadgesBtn = document.getElementById('reset-badges-btn');

    // Verifica que los elementos existan antes de continuar
    if (!challengeQuestion || !answerInput || !checkAnswerBtn || !newChallengeBtn || !feedbackDiv || !difficultySpan) return;

    // --- Estado de desafíos e insignias ---
    const challenges = [
        // Ley de Ohm (I = V / R)
        { type: "ohm", v: 9, r: 45, dificultad: "Fácil" },
        { type: "ohm", v: 12, r: 6, dificultad: "Fácil" },
        { type: "ohm", v: 5, r: 10, dificultad: "Fácil" },
        { type: "ohm", v: 10, r: 2, dificultad: "Fácil" },
        { type: "ohm", v: 36, r: 12, dificultad: "Fácil" },
        { type: "ohm", v: 24, r: 8, dificultad: "Medio" },
        { type: "ohm", v: 18, r: 3, dificultad: "Medio" },
        { type: "ohm", v: 15, r: 5, dificultad: "Medio" },
        { type: "ohm", v: 60, r: 20, dificultad: "Medio" },
        { type: "ohm", v: 100, r: 25, dificultad: "Medio" },
        { type: "ohm", v: 230, r: 115, dificultad: "Difícil" },
        { type: "ohm", v: 120, r: 33, dificultad: "Difícil" },
        { type: "ohm", v: 48, r: 2.2, dificultad: "Difícil" },
        { type: "ohm", v: 220, r: 11, dificultad: "Difícil" },
        { type: "ohm", v: 330, r: 15, dificultad: "Difícil" }
    ];
    let currentChallenge = null;

    let badges = {
        badge1: false, // Ohm Iniciado
        badge2: false, // Experto en V=IR
        badge3: false, // Maestro de Circuitos
        badge4: false  // Leyenda de Ohm
    };
    let correctCount = 0;
    let correctStreak = 0;

    // --- Funciones de insignias ---
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

    function saveProgress() {
        localStorage.setItem('ohm_badges', JSON.stringify({
            badges,
            correctCount,
            correctStreak
        }));
    }

    function updateBadgesUI(popBadge) {
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
        if (badgesProgress) {
            badgesProgress.textContent = `Progreso: ${unlocked}/4 (${Math.round((unlocked/4)*100)}%)`;
        }
    }

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

    // --- Funciones de desafíos ---
    function generateChallenge() {
        const idx = Math.floor(Math.random() * challenges.length);
        currentChallenge = challenges[idx];
        if (currentChallenge.type === "ohm") {
            challengeQuestion.textContent = `Calcula la corriente en un circuito con ${currentChallenge.v}V y ${currentChallenge.r}Ω de resistencia`;
        }
        difficultySpan.textContent = currentChallenge.dificultad;
        answerInput.value = '';
        feedbackDiv.classList.add('hidden');
        feedbackDiv.textContent = '';
    }

    function checkAnswer() {
        if (!currentChallenge) return;
        const userValue = parseFloat(answerInput.value);
        let correct = null;
        let unidad = '';
        if (currentChallenge.type === "ohm") {
            correct = currentChallenge.v / currentChallenge.r;
            unidad = 'A';
        }
        if (isNaN(userValue)) {
            feedbackDiv.textContent = "Por favor, ingresa un valor numérico.";
            feedbackDiv.className = "mt-4 p-3 rounded-lg bg-yellow-100 text-yellow-800";
            feedbackDiv.classList.remove('hidden');
            return;
        }
        // Permite un margen de error de 0.02
        if (Math.abs(userValue - correct) < 0.02) {
            feedbackDiv.textContent = `¡Correcto! La respuesta es ${correct.toFixed(2)} ${unidad}.`;
            feedbackDiv.className = "mt-4 p-3 rounded-lg bg-green-100 text-green-800";
            feedbackDiv.classList.remove('hidden');
            correctCount++;
            correctStreak++;
            unlockBadge(currentChallenge.dificultad);
        } else {
            feedbackDiv.textContent = `Incorrecto. La respuesta correcta es ${correct.toFixed(2)} ${unidad}.`;
            feedbackDiv.className = "mt-4 p-3 rounded-lg bg-red-100 text-red-800";
            feedbackDiv.classList.remove('hidden');
            correctStreak = 0;
            saveProgress();
        }
    }

    // --- Inicialización y eventos ---
    window.initDesafios = function() {
        loadProgress();
        if (checkAnswerBtn && answerInput) {
            checkAnswerBtn.addEventListener('click', checkAnswer);
            answerInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') checkAnswer();
            });
        }
        if (newChallengeBtn) {
            newChallengeBtn.addEventListener('click', generateChallenge);
        }
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
        generateChallenge();
    };
})();
