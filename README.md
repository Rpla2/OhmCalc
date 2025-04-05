# OhmCalc - Calculadora de la Ley de Ohm

OhmCalc es una aplicación web interactiva que permite calcular **Voltaje (V)**, **Corriente (I)**, **Resistencia (R)** o **Potencia (P)** utilizando las fórmulas de la Ley de Ohm y Potencia Eléctrica.

## Características

- **Modo 1:** Selección dinámica de qué calcular (Voltaje, Corriente, Resistencia o Potencia).
- **Modo 2:** Ingreso de al menos 2 valores para calcular todas las operaciones posibles.
- Generación automática de campos de entrada según la selección del usuario.
- Cálculos basados en las fórmulas de la Ley de Ohm y Potencia Eléctrica.
- Interfaz moderna y fácil de usar.

## Fórmulas Utilizadas

### Potencia (P = Watts)
- `P = I × V`
- `P = V² / R`
- `P = I² × R`

### Voltaje (V = Volts)
- `V = I × R`
- `V = P / I`
- `V = √(P × R)`

### Corriente (I = Amperes)
- `I = V / R`
- `I = P / V`
- `I = √(P / R)`

### Resistencia (R = Ohms)
- `R = V / I`
- `R = V² / P`
- `R = P / I²`

## Estructura del Proyecto
```
OhmCalc
├── src
│   ├── index.html       # Archivo principal de la aplicación
│   ├── images
│   │   └── formulas.png # Imagen de las fórmulas utilizadas
│   ├── styles
│   │   └── style.css    # Estilos de la aplicación
│   └── scripts
│       └── app.js       # Lógica de la calculadora
└── README.md            # Documentación del proyecto
```

## Cómo Usar

1. Clona este repositorio en tu máquina local:
   ```bash
   git clone https://github.com/Rpla2/OhmCalc.git
   ```

2. Abre el archivo `index.html` en tu navegador.

3. Selecciona el **modo de cálculo**:
   - **Modo 1:** Selecciona qué deseas calcular (Voltaje, Corriente, Resistencia o Potencia) y proporciona los valores requeridos.
   - **Modo 2:** Ingresa al menos 2 valores (Voltaje, Corriente, Resistencia o Potencia) para calcular todas las operaciones posibles.

4. Haz clic en el botón **Calcular** para obtener los resultados.

5. Si deseas realizar otro cálculo, utiliza el botón **Restablecer** para limpiar los campos.

## Tecnologías Utilizadas

- **HTML5:** Estructura de la aplicación.
- **CSS3:** Estilización de la interfaz.
- **JavaScript:** Lógica para cálculos dinámicos.

## Captura de Pantalla

![OhmCalc](src/images/formulas.png)

OhmCalc es una herramienta educativa diseñada para facilitar el aprendizaje y la resolución de problemas eléctricos básicos.
