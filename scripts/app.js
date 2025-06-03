// Actualiza los campos de entrada según el cálculo seleccionado (Modo 1)
function updateForm() {
    const calculationType = document.getElementById('calculationType');
    const inputFields = document.getElementById('inputFields');

    if (!calculationType || !inputFields) {
        console.error("Elementos no encontrados: 'calculationType' o 'inputFields'");
        return;
    }

    inputFields.innerHTML = '';

    switch (calculationType.value) {
        case 'voltage':
            inputFields.innerHTML = `
                <label for="current">Corriente (I):</label>
                <input type="number" id="current" placeholder="Ingrese corriente" required>
                <label for="resistance">Resistencia (R):</label>
                <input type="number" id="resistance" placeholder="Ingrese resistencia" required>
            `;
            break;
        case 'current':
            inputFields.innerHTML = `
                <label for="voltage">Voltaje (V):</label>
                <input type="number" id="voltage" placeholder="Ingrese voltaje" required>
                <label for="resistance">Resistencia (R):</label>
                <input type="number" id="resistance" placeholder="Ingrese resistencia" required>
            `;
            break;
        case 'resistance':
            inputFields.innerHTML = `
                <label for="voltage">Voltaje (V):</label>
                <input type="number" id="voltage" placeholder="Ingrese voltaje" required>
                <label for="current">Corriente (I):</label>
                <input type="number" id="current" placeholder="Ingrese corriente" required>
            `;
            break;
        case 'power':
            inputFields.innerHTML = `
                <label for="voltage">Voltaje (V):</label>
                <input type="number" id="voltage" placeholder="Ingrese voltaje" required>
                <label for="current">Corriente (I):</label>
                <input type="number" id="current" placeholder="Ingrese corriente" required>
            `;
            break;
        default:
            console.error("Tipo de cálculo no válido");
    }

    // Esperar a que los inputs se agreguen al DOM antes de calcular
    setTimeout(calculate, 100);
}

// Calcula el resultado según el cálculo seleccionado (Modo 1)
function calculate() {
    const calculationType = document.getElementById('calculationType');
    const resultDiv = document.getElementById('resultSpecific');
    const batteryResult = document.getElementById('batteryResult');
    const positiveCableResult = document.getElementById('positiveCableResult');
    const bulbResult = document.getElementById('bulbResult');

    // SVG labels
    const svgV = document.getElementById("svg-voltage");
    const svgI = document.getElementById("svg-current");
    const svgR = document.getElementById("svg-resistance");
    const svgP = document.getElementById("svg-power");

    if (!calculationType || !resultDiv) {
        console.error("Elementos no encontrados: 'calculationType' o 'resultSpecific'");
        return;
    }

    // Limpiar resultados previos
    resultDiv.innerHTML = "";
    if (batteryResult) batteryResult.textContent = "";
    if (positiveCableResult) positiveCableResult.textContent = "";
    if (bulbResult) bulbResult.textContent = "";
    if (svgV) svgV.textContent = "V = ?";
    if (svgI) svgI.textContent = "I = ?";
    if (svgR) svgR.textContent = "R = ?";
    if (svgP) svgP.textContent = "P = ?";

    let result;

    try {
        switch (calculationType.value) {
            case 'voltage':
                const currentV = parseFloat(document.getElementById('current')?.value);
                const resistanceV = parseFloat(document.getElementById('resistance')?.value);
                if (isNaN(currentV) || isNaN(resistanceV)) throw new Error("Datos inválidos");
                const voltage = currentV * resistanceV;
                result = `Voltaje (V) = ${voltage} V`;
                if (batteryResult) batteryResult.textContent = `${voltage} V (I = ${currentV} A, R = ${resistanceV} Ω)`;
                if (svgV) svgV.textContent = `V = ${voltage} V`;
                if (svgI) svgI.textContent = `I = ${currentV} A`;
                if (svgR) svgR.textContent = `R = ${resistanceV} Ω`;
                if (svgP) svgP.textContent = `P = ${voltage * currentV} W`;
                break;
            case 'current':
                const voltageI = parseFloat(document.getElementById('voltage')?.value);
                const resistanceI = parseFloat(document.getElementById('resistance')?.value);
                if (isNaN(voltageI) || isNaN(resistanceI)) throw new Error("Datos inválidos");
                const current = voltageI / resistanceI;
                result = `Corriente (I) = ${current} A`;
                if (positiveCableResult) positiveCableResult.textContent = `${current} A (V = ${voltageI} V, R = ${resistanceI} Ω)`;
                if (svgV) svgV.textContent = `V = ${voltageI} V`;
                if (svgI) svgI.textContent = `I = ${current} A`;
                if (svgR) svgR.textContent = `R = ${resistanceI} Ω`;
                if (svgP) svgP.textContent = `P = ${voltageI * current} W`;
                break;
            case 'resistance':
                const voltageR = parseFloat(document.getElementById('voltage')?.value);
                const currentR = parseFloat(document.getElementById('current')?.value);
                if (isNaN(voltageR) || isNaN(currentR)) throw new Error("Datos inválidos");
                const resistance = voltageR / currentR;
                result = `Resistencia (R) = ${resistance} Ω`;
                if (bulbResult) bulbResult.textContent = `${resistance} Ω (V = ${voltageR} V, I = ${currentR} A)`;
                if (svgV) svgV.textContent = `V = ${voltageR} V`;
                if (svgI) svgI.textContent = `I = ${currentR} A`;
                if (svgR) svgR.textContent = `R = ${resistance} Ω`;
                if (svgP) svgP.textContent = `P = ${voltageR * currentR} W`;
                break;
            case 'power':
                const voltageP = parseFloat(document.getElementById('voltage')?.value);
                const currentP = parseFloat(document.getElementById('current')?.value);
                if (isNaN(voltageP) || isNaN(currentP)) throw new Error("Datos inválidos");
                const power = voltageP * currentP;
                result = `Potencia (P) = ${power} W`;
                if (batteryResult) batteryResult.textContent = `${power} W (V = ${voltageP} V, I = ${currentP} A)`;
                if (svgV) svgV.textContent = `V = ${voltageP} V`;
                if (svgI) svgI.textContent = `I = ${currentP} A`;
                if (svgR) svgR.textContent = "R = ?";
                if (svgP) svgP.textContent = `P = ${power} W`;
                break;
            default:
                result = "Tipo de cálculo no válido";
        }
    } catch (error) {
        console.error("Error al calcular:", error);
        result = "Error en los datos ingresados.";
    }

    resultDiv.innerHTML = result || "Por favor, complete los campos necesarios.";
}

// Inicializa la página
function initializePage() {
    updateForm();
}
