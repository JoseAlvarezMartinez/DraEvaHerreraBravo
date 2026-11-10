# Landing — Dra. Eva Maria Herrera Bravo

Sitio estático (HTML + CSS + JavaScript). No necesita instalación ni servidor especial.

## Estructura

```
dra-herrera-landing/
├── index.html        ← la página
├── css/styles.css    ← estilos y animaciones
├── js/main.js        ← menú móvil, pestañas y animaciones al hacer scroll
└── img/
    ├── dra-herrera.jpg
    └── favicon.svg
```

## Antes de publicar: completar en index.html

Buscá los textos entre corchetes y reemplazalos:

- `[DIRECCIÓN DEL CONSULTORIO]`, `[DÍAS Y HORARIOS]`, `[VALOR CONSULTA]`
- `[MATRÍCULA N.º]`
- `[FORMACIÓN: UNIVERSIDAD, ESPECIALIZACIÓN Y AÑOS DE EXPERIENCIA]`
- `549XXXXXXXXXX` → número de WhatsApp con código de país, sin `+` ni espacios (ej.: 5491122334455)
- `[EMAIL]` y `[EMAIL DE CONTACTO]`
- `[USUARIO]` → usuario de Instagram

Recordá actualizar los honorarios de la teleconsulta ($40.000, noviembre 2026) cuando cambien.

## Cómo subirlo

Subí **el contenido de la carpeta** (que `index.html` quede en la raíz del sitio).

- **Netlify:** app.netlify.com → "Add new site" → "Deploy manually" → arrastrá la carpeta.
- **Vercel:** vercel.com → "Add New Project" → subí la carpeta o conectá un repositorio.
- **GitHub Pages:** subí los archivos a un repositorio → Settings → Pages → rama `main`, carpeta raíz.
- **Hosting tradicional (cPanel / FTP):** copiá los archivos dentro de `public_html`.

Para probarlo en tu computadora, abrí `index.html` con doble clic.
