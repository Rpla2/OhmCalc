// Dark mode toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    
    // Save preference to localStorage
    if (html.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

// Check for saved theme preference
if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
} else {
    html.classList.remove('dark');
}

// Ohm's Law Calculator
const voltageSlider = document.getElementById('voltage');
const resistanceSlider = document.getElementById('resistance');
const voltageValue = document.getElementById('voltage-value');
const resistanceValue = document.getElementById('resistance-value');
const currentCalculated = document.getElementById('current-calculated');
const voltageDisplay = document.getElementById('voltage-display');
const currentDisplay = document.getElementById('current-display');
const resistanceDisplay = document.getElementById('resistance-display');
const calculateBtn = document.getElementById('calculate');
const bulb = document.getElementById('bulb');
const electrons = document.getElementById('electrons');
let ohmChart = null;

// Update displays
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
    
    // Update bulb brightness
    const brightness = Math.min(voltage / 12, 1);
    bulb.style.opacity = 0.5 + (brightness * 0.5);
    
    // Adjust electron animation speed based on current
    const electronElements = document.querySelectorAll('.electron');
    const speed = current * 2;
    electronElements.forEach(el => {
        el.style.animationDuration = `${2 / (speed || 0.1)}s`;
    });
    
    // Update chart
    updateChart(voltage, resistance, current);
}

// Initialize chart
function initChart() {
    const ctx = document.getElementById('ohmsChart').getContext('2d');
    
    ohmChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Relación V-I',
                borderColor: 'rgb(99, 102, 241)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgb(99, 102, 241)',
                fill: true,
                tension: 0.4,
                data: []
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Voltaje (V)'
                    },
                    min: 0,
                    max: 12
                },
                y: {
                    title: {
                        display: true,
                        text: 'Corriente (A)'
                    },
                    min: 0
                }
            }
        }
    });
}

// Update chart data
function updateChart(voltage, resistance, current) {
    if (!ohmChart) return;
    
    // Generate points based on current resistance
    const points = [];
    const maxV = 12;
    const steps = 10;
    
    for (let i = 0; i <= steps; i++) {
        const v = (maxV / steps) * i;
        points.push({
            x: v,
            y: resistance > 0 ? v / resistance : 0
        });
    }
    
    ohmChart.data.datasets[0].data = points;
    ohmChart.options.scales.y.max = resistance > 0 ? maxV / resistance : 5;
    ohmChart.update();
    
    // Add current point indicator
    const ctx = ohmChart.ctx;
    const xAxis = ohmChart.scales.x;
    const yAxis = ohmChart.scales.y;
    
    const x = xAxis.getPixelForValue(voltage);
    const y = yAxis.getPixelForValue(current);
    
    // Draw a circle at the current point
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgb(239, 68, 68)';
    ctx.fill();
    ctx.restore();
}

// Event listeners
voltageSlider.addEventListener('input', updateDisplays);
resistanceSlider.addEventListener('input', updateDisplays);
calculateBtn.addEventListener('click', updateDisplays);

// Initialize
initChart();
updateDisplays();

// ...Resto del código JS para el sistema de desafíos, igual que en el HTML original...
