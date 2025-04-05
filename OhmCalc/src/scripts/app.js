// Actualiza los campos de entrada según el cálculo seleccionado (Modo 1)
function updateForm() {
    const calculationType = document.getElementById('calculationType').value;
    const inputFields = document.getElementById('inputFields');
    inputFields.innerHTML = '';

    switch (calculationType) {
        case 'voltage':
            inputFields.innerHTML = `
                <label for="current">Corriente (I):</label>
                <input type="number" id="current" placeholder="Ingrese corriente">
                <label for="resistance">Resistencia (R):</label>
                <input type="number" id="resistance" placeholder="Ingrese resistencia">
            `;
            break;
        case 'current':
            inputFields.innerHTML = `
                <label for="voltage">Voltaje (V):</label>
                <input type="number" id="voltage" placeholder="Ingrese voltaje">
                <label for="resistance">Resistencia (R):</label>
                <input type="number" id="resistance" placeholder="Ingrese resistencia">
            `;
            break;
        case 'resistance':
            inputFields.innerHTML = `
                <label for="voltage">Voltaje (V):</label>
                <input type="number" id="voltage" placeholder="Ingrese voltaje">
                <label for="current">Corriente (I):</label>
                <input type="number" id="current" placeholder="Ingrese corriente">
            `;
            break;
        case 'power':
            inputFields.innerHTML = `
                <label for="voltage">Voltaje (V):</label>
                <input type="number" id="voltage" placeholder="Ingrese voltaje">
                <label for="current">Corriente (I):</label>
                <input type="number" id="current" placeholder="Ingrese corriente">
            `;
            break;
    }
}

// Calcula el resultado según el cálculo seleccionado (Modo 1)
function calculate() {
    const calculationType = document.getElementById('calculationType').value;
    const resultDiv = document.getElementById('result');
    let result;

    switch (calculationType) {
        case 'voltage':
            const currentV = parseFloat(document.getElementById('current').value);
            const resistanceV = parseFloat(document.getElementById('resistance').value);
            result = `Voltaje (V) = ${currentV * resistanceV} V`;
            break;
        case 'current':
            const voltageI = parseFloat(document.getElementById('voltage').value);
            const resistanceI = parseFloat(document.getElementById('resistance').value);
            result = `Corriente (I) = ${voltageI / resistanceI} A`;
            break;
        case 'resistance':
            const voltageR = parseFloat(document.getElementById('voltage').value);
            const currentR = parseFloat(document.getElementById('current').value);
            result = `Resistencia (R) = ${voltageR / currentR} Ω`;
            break;
        case 'power':
            const voltageP = parseFloat(document.getElementById('voltage').value);
            const currentP = parseFloat(document.getElementById('current').value);
            result = `Potencia (P) = ${voltageP * currentP} W`;
            break;
    }

    resultDiv.innerHTML = result;
}

// Calcula todas las operaciones posibles según los valores ingresados (Modo 2)
function calculateAll() {
    const voltage = parseFloat(document.getElementById('voltageAll').value);
    const current = parseFloat(document.getElementById('currentAll').value);
    const resistance = parseFloat(document.getElementById('resistanceAll').value);
    const power = parseFloat(document.getElementById('powerAll').value);

    const resultDiv = document.getElementById('result');
    let results = [];

    // Calcular potencia
    if (!isNaN(current) && !isNaN(voltage)) results.push(`P = ${current * voltage} W`);
    if (!isNaN(voltage) && !isNaN(resistance)) results.push(`P = ${Math.pow(voltage, 2) / resistance} W`);
    if (!isNaN(current) && !isNaN(resistance)) results.push(`P = ${Math.pow(current, 2) * resistance} W`);

    // Calcular voltaje
    if (!isNaN(current) && !isNaN(resistance)) results.push(`V = ${current * resistance} V`);
    if (!isNaN(power) && !isNaN(current)) results.push(`V = ${power / current} V`);
    if (!isNaN(power) && !isNaN(resistance)) results.push(`V = ${Math.sqrt(power * resistance)} V`);

    // Calcular corriente
    if (!isNaN(voltage) && !isNaN(resistance)) results.push(`I = ${voltage / resistance} A`);
    if (!isNaN(power) && !isNaN(voltage)) results.push(`I = ${power / voltage} A`);
    if (!isNaN(power) && !isNaN(resistance)) results.push(`I = ${Math.sqrt(power / resistance)} A`);

    // Calcular resistencia
    if (!isNaN(voltage) && !isNaN(current)) results.push(`R = ${voltage / current} Ω`);
    if (!isNaN(voltage) && !isNaN(power)) results.push(`R = ${Math.pow(voltage, 2) / power} Ω`);
    if (!isNaN(power) && !isNaN(current)) results.push(`R = ${power / Math.pow(current, 2)} Ω`);

    // Mostrar resultados
    resultDiv.innerHTML = results.length > 0 ? results.join('<br>') : 'Por favor, ingrese al menos 2 valores válidos.';
}

// Muestra el formulario correspondiente según el modo seleccionado
function showMode(mode) {
    const mode1Form = document.getElementById('ohmCalcForm');
    const mode2Form = document.getElementById('allCalcForm');

    mode1Form.style.display = 'none';
    mode2Form.style.display = 'none';

    if (mode === 'mode1') {
        mode1Form.style.display = 'block';
    } else if (mode === 'mode2') {
        mode2Form.style.display = 'block';
    }

    document.getElementById('result').innerHTML = '';
}