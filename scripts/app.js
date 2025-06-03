// Actualiza los campos de entrada según el cálculo seleccionado (Modo 1)
function updateForm() {
    const calculationType = document.getElementById('calculationType');
    const inputFields = document.getElementById('inputFields');

    if (!calculationType || !inputFields) {
        console.error("Elementos no encontrados: 'calculationType' o 'inputFields'");
        return;
    }

    inputFields.innerHTML = '';

    // Opciones de unidad para cada magnitud
    const unitOptions = {
        voltage: `
            <select id="voltageUnit">
                <option value="V">V</option>
                <option value="mV">mV</option>
                <option value="kV">kV</option>
            </select>
        `,
        current: `
            <select id="currentUnit">
                <option value="A">A</option>
                <option value="mA">mA</option>
                <option value="uA">μA</option>
            </select>
        `,
        resistance: `
            <select id="resistanceUnit">
                <option value="ohm">Ω</option>
                <option value="kohm">kΩ</option>
                <option value="mohm">MΩ</option>
            </select>
        `
    };

    switch (calculationType.value) {
        case 'voltage':
            inputFields.innerHTML = `
                <label for="current">Corriente (I):</label>
                <div style="display:flex;gap:8px;">
                    <input type="number" id="current" placeholder="Ingrese corriente" required>
                    ${unitOptions.current}
                </div>
                <label for="resistance">Resistencia (R):</label>
                <div style="display:flex;gap:8px;">
                    <input type="number" id="resistance" placeholder="Ingrese resistencia" required>
                    ${unitOptions.resistance}
                </div>
            `;
            break;
        case 'current':
            inputFields.innerHTML = `
                <label for="voltage">Voltaje (V):</label>
                <div style="display:flex;gap:8px;">
                    <input type="number" id="voltage" placeholder="Ingrese voltaje" required>
                    ${unitOptions.voltage}
                </div>
                <label for="resistance">Resistencia (R):</label>
                <div style="display:flex;gap:8px;">
                    <input type="number" id="resistance" placeholder="Ingrese resistencia" required>
                    ${unitOptions.resistance}
                </div>
            `;
            break;
        case 'resistance':
            inputFields.innerHTML = `
                <label for="voltage">Voltaje (V):</label>
                <div style="display:flex;gap:8px;">
                    <input type="number" id="voltage" placeholder="Ingrese voltaje" required>
                    ${unitOptions.voltage}
                </div>
                <label for="current">Corriente (I):</label>
                <div style="display:flex;gap:8px;">
                    <input type="number" id="current" placeholder="Ingrese corriente" required>
                    ${unitOptions.current}
                </div>
            `;
            break;
        case 'power':
            inputFields.innerHTML = `
                <label for="voltage">Voltaje (V):</label>
                <div style="display:flex;gap:8px;">
                    <input type="number" id="voltage" placeholder="Ingrese voltaje" required>
                    ${unitOptions.voltage}
                </div>
                <label for="current">Corriente (I):</label>
                <div style="display:flex;gap:8px;">
                    <input type="number" id="current" placeholder="Ingrese corriente" required>
                    ${unitOptions.current}
                </div>
            `;
            break;
        default:
            console.error("Tipo de cálculo no válido");
    }

    // Esperar a que los inputs se agreguen al DOM antes de calcular
    setTimeout(calculate, 100);
}

// Función para convertir valores a la unidad base
function convertToBase(value, unit, type) {
    if (isNaN(value)) return NaN;
    switch (type) {
        case 'voltage':
            if (unit === 'V') return value;
            if (unit === 'mV') return value / 1000;
            if (unit === 'kV') return value * 1000;
            break;
        case 'current':
            if (unit === 'A') return value;
            if (unit === 'mA') return value / 1000;
            if (unit === 'uA') return value / 1_000_000;
            break;
        case 'resistance':
            if (unit === 'ohm') return value;
            if (unit === 'kohm') return value * 1000;
            if (unit === 'mohm') return value * 1_000_000;
            break;
    }
    return value;
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
            case 'voltage': {
                const currentV = parseFloat(document.getElementById('current')?.value);
                const currentUnit = document.getElementById('currentUnit')?.value || 'A';
                const resistanceV = parseFloat(document.getElementById('resistance')?.value);
                const resistanceUnit = document.getElementById('resistanceUnit')?.value || 'ohm';
                const currentBase = convertToBase(currentV, currentUnit, 'current');
                const resistanceBase = convertToBase(resistanceV, resistanceUnit, 'resistance');
                if (isNaN(currentBase) || isNaN(resistanceBase)) throw new Error("Datos inválidos");
                const voltage = currentBase * resistanceBase;
                result = `Voltaje (V) = ${voltage.toFixed(2)} V`;
                if (batteryResult) batteryResult.textContent = `${voltage.toFixed(2)} V (I = ${currentBase.toFixed(2)} A, R = ${resistanceBase.toFixed(2)} Ω)`;
                if (svgV) svgV.textContent = `V = ${voltage.toFixed(2)} V`;
                if (svgI) svgI.textContent = `I = ${currentBase.toFixed(2)} A`;
                if (svgR) svgR.textContent = `R = ${resistanceBase.toFixed(2)} Ω`;
                if (svgP) svgP.textContent = `P = ${(voltage * currentBase).toFixed(2)} W`;
                break;
            }
            case 'current': {
                const voltageI = parseFloat(document.getElementById('voltage')?.value);
                const voltageUnit = document.getElementById('voltageUnit')?.value || 'V';
                const resistanceI = parseFloat(document.getElementById('resistance')?.value);
                const resistanceUnit = document.getElementById('resistanceUnit')?.value || 'ohm';
                const voltageBase = convertToBase(voltageI, voltageUnit, 'voltage');
                const resistanceBase = convertToBase(resistanceI, resistanceUnit, 'resistance');
                if (isNaN(voltageBase) || isNaN(resistanceBase)) throw new Error("Datos inválidos");
                const current = voltageBase / resistanceBase;
                result = `Corriente (I) = ${current.toFixed(2)} A`;
                if (positiveCableResult) positiveCableResult.textContent = `${current.toFixed(2)} A (V = ${voltageBase.toFixed(2)} V, R = ${resistanceBase.toFixed(2)} Ω)`;
                if (svgV) svgV.textContent = `V = ${voltageBase.toFixed(2)} V`;
                if (svgI) svgI.textContent = `I = ${current.toFixed(2)} A`;
                if (svgR) svgR.textContent = `R = ${resistanceBase.toFixed(2)} Ω`;
                if (svgP) svgP.textContent = `P = ${(voltageBase * current).toFixed(2)} W`;
                break;
            }
            case 'resistance': {
                const voltageR = parseFloat(document.getElementById('voltage')?.value);
                const voltageUnit = document.getElementById('voltageUnit')?.value || 'V';
                const currentR = parseFloat(document.getElementById('current')?.value);
                const currentUnit = document.getElementById('currentUnit')?.value || 'A';
                const voltageBase = convertToBase(voltageR, voltageUnit, 'voltage');
                const currentBase = convertToBase(currentR, currentUnit, 'current');
                if (isNaN(voltageBase) || isNaN(currentBase)) throw new Error("Datos inválidos");
                const resistance = voltageBase / currentBase;
                result = `Resistencia (R) = ${resistance.toFixed(2)} Ω`;
                if (bulbResult) bulbResult.textContent = `${resistance.toFixed(2)} Ω (V = ${voltageBase.toFixed(2)} V, I = ${currentBase.toFixed(2)} A)`;
                if (svgV) svgV.textContent = `V = ${voltageBase.toFixed(2)} V`;
                if (svgI) svgI.textContent = `I = ${currentBase.toFixed(2)} A`;
                if (svgR) svgR.textContent = `R = ${resistance.toFixed(2)} Ω`;
                if (svgP) svgP.textContent = `P = ${(voltageBase * currentBase).toFixed(2)} W`;
                break;
            }
            case 'power': {
                const voltageP = parseFloat(document.getElementById('voltage')?.value);
                const voltageUnit = document.getElementById('voltageUnit')?.value || 'V';
                const currentP = parseFloat(document.getElementById('current')?.value);
                const currentUnit = document.getElementById('currentUnit')?.value || 'A';
                const voltageBase = convertToBase(voltageP, voltageUnit, 'voltage');
                const currentBase = convertToBase(currentP, currentUnit, 'current');
                if (isNaN(voltageBase) || isNaN(currentBase)) throw new Error("Datos inválidos");
                const power = voltageBase * currentBase;
                result = `Potencia (P) = ${power.toFixed(2)} W`;
                if (batteryResult) batteryResult.textContent = `${power.toFixed(2)} W (V = ${voltageBase.toFixed(2)} V, I = ${currentBase.toFixed(2)} A)`;
                if (svgV) svgV.textContent = `V = ${voltageBase.toFixed(2)} V`;
                if (svgI) svgI.textContent = `I = ${currentBase.toFixed(2)} A`;
                if (svgR) svgR.textContent = "R = ?";
                if (svgP) svgP.textContent = `P = ${power.toFixed(2)} W`;
                break;
            }
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
