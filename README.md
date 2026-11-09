Script para resolver  un juego tipo ahorcado, toma todas las palabras de un diccionario en ingles y  va eliminando las incorrectas segun los parametros que vas introduciendo

Funcionando en Python 3.10.5
Requiere 
  colorama

## App web / celular (carpeta `app/`)

Versión web del solver, instalable en el celular (PWA) y que funciona sin conexión.

- Filtros: letras en su lugar (`_ a _ _ e`), letras que no están, letras que sí están, letra que no va en cierta posición (`e3 a1`, la primera es 1), largo exacto y largo máximo.
- Sugiere las próximas letras a probar según las palabras que quedan y ordena los resultados para probar primero las que más descartan.
- Tocá una palabra para copiarla.

Para probarla en local: `cd app && python3 -m http.server 8000` y abrir `http://localhost:8000`.
Para publicarla: activar GitHub Pages sobre la carpeta `/app` (o copiar su contenido a la raíz de la rama publicada). Desde el navegador del celular, "Agregar a pantalla de inicio".

`app/words.txt` es `english.txt` limpio (solo a-z, sin duplicados).
