document.addEventListener('DOMContentLoaded', function() {
    // Referencias a los elementos principales de la calculadora
    const calcType = document.getElementById('calc-type');
    const inputsContainer = document.getElementById('inputs-container');
    const calcBtn = document.getElementById('calc-btn');
    const resultDiv = document.getElementById('calc-result');

    // Definición de los prefijos y factores de conversión para cada unidad
    const unitOptions = {
        voltage: [
            { label: 'V', factor: 1 },
            { label: 'mV', factor: 1e-3 },
            { label: 'kV', factor: 1e3 }
        ],
        current: [
            { label: 'A', factor: 1 },
            { label: 'mA', factor: 1e-3 },
            { label: 'μA', factor: 1e-6 }
        ],
        resistance: [
            { label: 'Ω', factor: 1 },
            { label: 'kΩ', factor: 1e3 },
            { label: 'MΩ', factor: 1e6 }
        ]
    };

    /**
     * Genera un elemento <select> para elegir la unidad, usando las opciones dadas.
     * @param {string} id - ID del select.
     * @param {Array} opts - Opciones de unidad.
     * @param {string} extraClass - Clases CSS adicionales.
     * @returns {string} HTML del select.
     */
    function unitSelect(id, opts, extraClass = '') {
        return `<select id="${id}" class="rounded p-1 bg-gray-100 dark:bg-gray-800 border ml-2 ${extraClass}">
            ${opts.map(u => `<option value="${u.factor}">${u.label}</option>`).join('')}
        </select>`;
    }

    /**
     * Renderiza los campos de entrada y el selector de unidad de resultado según el tipo de cálculo.
     */
    function renderInputs() {
        const type = calcType.value;
        let html = '';
        let resultUnitSelector = '';
        // Corriente
        if (type === 'I') {
            html = `
                <div class="flex items-center gap-2">
                    <i class="fas fa-bolt text-indigo-400"></i>
                    <label class="block text-sm font-medium">Voltaje:</label>
                    ${unitSelect('unit-voltage', unitOptions.voltage)}
                </div>
                <input type="number" id="calc-voltage" class="w-full rounded p-2 bg-gray-100 dark:bg-gray-800 mb-2 focus:ring-2 focus:ring-indigo-400 transition" step="any" inputmode="decimal">
                <div class="flex items-center gap-2">
                    <i class="fas fa-wave-square text-amber-500"></i>
                    <label class="block text-sm font-medium">Resistencia:</label>
                    ${unitSelect('unit-resistance', unitOptions.resistance)}
                </div>
                <input type="number" id="calc-resistance" class="w-full rounded p-2 bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-400 transition" step="any" inputmode="decimal">
            `;
            // Selector de unidad para el resultado de corriente
            resultUnitSelector = `
                <div class="flex items-center justify-center gap-2 mt-2">
                    <label class="text-sm">Resultado en:</label>
                    ${unitSelect('result-unit', unitOptions.current, 'font-mono')}
                </div>
            `;
        // Voltaje
        } else if (type === 'V') {
            html = `
                <div class="flex items-center gap-2">
                    <i class="fas fa-charging-station text-amber-500"></i>
                    <label class="block text-sm font-medium">Corriente:</label>
                    ${unitSelect('unit-current', unitOptions.current)}
                </div>
                <input type="number" id="calc-current" class="w-full rounded p-2 bg-gray-100 dark:bg-gray-800 mb-2 focus:ring-2 focus:ring-indigo-400 transition" step="any" inputmode="decimal">
                <div class="flex items-center gap-2">
                    <i class="fas fa-wave-square text-amber-500"></i>
                    <label class="block text-sm font-medium">Resistencia:</label>
                    ${unitSelect('unit-resistance', unitOptions.resistance)}
                </div>
                <input type="number" id="calc-resistance" class="w-full rounded p-2 bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-400 transition" step="any" inputmode="decimal">
            `;
            // Selector de unidad para el resultado de voltaje
            resultUnitSelector = `
                <div class="flex items-center justify-center gap-2 mt-2">
                    <label class="text-sm">Resultado en:</label>
                    ${unitSelect('result-unit', unitOptions.voltage, 'font-mono')}
                </div>
            `;
        // Resistencia
        } else if (type === 'R') {
            html = `
                <div class="flex items-center gap-2">
                    <i class="fas fa-bolt text-indigo-400"></i>
                    <label class="block text-sm font-medium">Voltaje:</label>
                    ${unitSelect('unit-voltage', unitOptions.voltage)}
                </div>
                <input type="number" id="calc-voltage" class="w-full rounded p-2 bg-gray-100 dark:bg-gray-800 mb-2 focus:ring-2 focus:ring-indigo-400 transition" step="any" inputmode="decimal">
                <div class="flex items-center gap-2">
                    <i class="fas fa-charging-station text-amber-500"></i>
                    <label class="block text-sm font-medium">Corriente:</label>
                    ${unitSelect('unit-current', unitOptions.current)}
                </div>
                <input type="number" id="calc-current" class="w-full rounded p-2 bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-400 transition" step="any" inputmode="decimal">
            `;
            // Selector de unidad para el resultado de resistencia
            resultUnitSelector = `
                <div class="flex items-center justify-center gap-2 mt-2">
                    <label class="text-sm">Resultado en:</label>
                    ${unitSelect('result-unit', unitOptions.resistance, 'font-mono')}
                </div>
            `;
        // Potencia
        } else if (type === 'P') {
            html = `
                <div class="flex items-center gap-2">
                    <i class="fas fa-bolt text-indigo-400"></i>
                    <label class="block text-sm font-medium">Voltaje:</label>
                    ${unitSelect('unit-voltage', unitOptions.voltage)}
                </div>
                <input type="number" id="calc-voltage" class="w-full rounded p-2 bg-gray-100 dark:bg-gray-800 mb-2 focus:ring-2 focus:ring-indigo-400 transition" step="any" inputmode="decimal">
                <div class="flex items-center gap-2">
                    <i class="fas fa-charging-station text-amber-500"></i>
                    <label class="block text-sm font-medium">Corriente:</label>
                    ${unitSelect('unit-current', unitOptions.current)}
                </div>
                <input type="number" id="calc-current" class="w-full rounded p-2 bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-400 transition" step="any" inputmode="decimal">
            `;
            // Potencia solo se muestra en W, no hay selector de unidad
            resultUnitSelector = '';
        }
        // Inserta los campos y el selector de unidad de resultado
        inputsContainer.innerHTML = html + resultUnitSelector;
        resultDiv.textContent = '';
        resultDiv.classList.remove('result-pop');
    }

    /**
     * Calcula el resultado según el tipo seleccionado y muestra el valor en la unidad elegida.
     */
    function calcular() {
        const type = calcType.value;
        let resultado = '';
        // Corriente
        if (type === 'I') {
            const v = parseFloat(document.getElementById('calc-voltage').value);
            const r = parseFloat(document.getElementById('calc-resistance').value);
            const vFactor = parseFloat(document.getElementById('unit-voltage').value);
            const rFactor = parseFloat(document.getElementById('unit-resistance').value);
            const resUnit = document.getElementById('result-unit').value;
            if (!isNaN(v) && !isNaN(r) && r !== 0) {
                const i = (v * vFactor) / (r * rFactor);
                const iResult = i / resUnit;
                const unitLabel = document.getElementById('result-unit').selectedOptions[0].textContent;
                resultado = `Corriente: ${iResult.toFixed(3)} ${unitLabel}`;
            } else {
                resultado = 'Por favor, ingresa valores válidos.';
            }
        // Voltaje
        } else if (type === 'V') {
            const i = parseFloat(document.getElementById('calc-current').value);
            const r = parseFloat(document.getElementById('calc-resistance').value);
            const iFactor = parseFloat(document.getElementById('unit-current').value);
            const rFactor = parseFloat(document.getElementById('unit-resistance').value);
            const resUnit = document.getElementById('result-unit').value;
            if (!isNaN(i) && !isNaN(r)) {
                const v = (i * iFactor) * (r * rFactor);
                const vResult = v / resUnit;
                const unitLabel = document.getElementById('result-unit').selectedOptions[0].textContent;
                resultado = `Voltaje: ${vResult.toFixed(3)} ${unitLabel}`;
            } else {
                resultado = 'Por favor, ingresa valores válidos.';
            }
        // Resistencia
        } else if (type === 'R') {
            const v = parseFloat(document.getElementById('calc-voltage').value);
            const i = parseFloat(document.getElementById('calc-current').value);
            const vFactor = parseFloat(document.getElementById('unit-voltage').value);
            const iFactor = parseFloat(document.getElementById('unit-current').value);
            const resUnit = document.getElementById('result-unit').value;
            if (!isNaN(v) && !isNaN(i) && i !== 0) {
                const r = (v * vFactor) / (i * iFactor);
                const rResult = r / resUnit;
                const unitLabel = document.getElementById('result-unit').selectedOptions[0].textContent;
                resultado = `Resistencia: ${rResult.toFixed(3)} ${unitLabel}`;
            } else {
                resultado = 'Por favor, ingresa valores válidos.';
            }
        // Potencia
        } else if (type === 'P') {
            const v = parseFloat(document.getElementById('calc-voltage').value);
            const i = parseFloat(document.getElementById('calc-current').value);
            const vFactor = parseFloat(document.getElementById('unit-voltage').value);
            const iFactor = parseFloat(document.getElementById('unit-current').value);
            if (!isNaN(v) && !isNaN(i)) {
                const p = (v * vFactor) * (i * iFactor);
                resultado = `Potencia: ${p.toFixed(3)} W`;
            } else {
                resultado = 'Por favor, ingresa valores válidos.';
            }
        }
        // Muestra el resultado y aplica animación
        resultDiv.textContent = resultado;
        resultDiv.classList.remove('result-pop');
        // Forzar reflow para reiniciar la animación
        void resultDiv.offsetWidth;
        resultDiv.classList.add('result-pop');
    }

    // Eventos para actualizar la interfaz y calcular
    calcType.addEventListener('change', renderInputs);
    calcBtn.addEventListener('click', calcular);

    // Render inicial
    renderInputs();
});
