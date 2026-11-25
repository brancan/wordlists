# Wordlist ES — asistente de Wordle en español

Aplicación web estática que ayuda a resolver Wordle en español (5 letras, 5 intentos): cargás las respuestas de color de cada jugada, filtra el diccionario y sugiere la palabra que más reduce el espacio de soluciones. Todo corre en el navegador: no hay backend, dependencias ni conexión a internet.

## Inicio rápido

1. Abrí `index.html` con doble clic en un navegador moderno.
2. Escribí un intento de 5 letras (se acepta `ñ`) y clickeá cada casilla para ciclar gris → amarillo → verde.
3. Pulsá **Aplicar intento** y después **Sugerir mejor jugada**.

Alternativa con servidor local, desde la raíz del repositorio:

```bash
python -m http.server 8000
# http://localhost:8000/
```

El estado se guarda solo en memoria: al recargar la página, el tablero se reinicia.

## Interfaz

| Pestaña | Qué hace |
| --- | --- |
| **Solver** | Tablero interactivo, filtrado por intento, sugerencia y lista de candidatas (hasta 120). |
| **Filtro manual** | Consulta el diccionario por longitud, letras presentes/ausentes, patrón posicional (`_a__e`) y pares `letra:pos` con posiciones desde 0 (hasta 500 resultados). |
| **Cómo funciona** | Explicación del algoritmo dentro de la propia app. |

## Cómo funciona

- **Patrón de colores:** simula la respuesta de Wordle para cada candidata. Marca primero todos los verdes y descuenta sus repeticiones; recién después asigna amarillos con lo que sobra.
- **Entropía ponderada:** puntúa cada jugada con la entropía de Shannon en bits de los patrones resultantes, ponderada por la frecuencia de uso de las palabras. Una jugada de ~6 bits divide el espacio por 64.
- **Apertura:** `careo` (6,20 bits) está precalculada para no recorrer las 4.718 candidatas en cada reinicio.
- La sugerencia distingue entre *sondeo* (reduce el espacio) y *candidata* (podría ser la solución).

## Archivos

| Archivo | Rol |
| --- | --- |
| `index.html` | Punto de entrada: HTML, estilos y toda la lógica en JavaScript vanilla. |
| `words.js` | 85.838 palabras españolas sin tildes, `ñ` incluida. De ellas, 4.718 tienen 5 letras y son candidatas válidas. |
| `freq.js` | 4.932 palabras con frecuencia de uso. Las demás reciben peso 1. |
| `hel2.py` | Herramienta heredada de la versión original: filtrador de diccionario por consola. |
| `english.txt` | Diccionario inglés (354.297 entradas) usado solo por `hel2.py`. |

## Versión anterior (legado)

`hel2.py` no es usado por la app web. Es un script interactivo en español que filtra `english.txt` por longitud, letras presentes/ausentes, patrón posicional y posiciones prohibidas. Requiere Python 3 y `colorama`:

```bash
python -m pip install colorama
python hel2.py
```
