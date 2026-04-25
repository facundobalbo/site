# Aplicación de cambios — sitio facubalbo.vercel.app

Cuatro archivos generados acá. Pasos para aplicarlos en orden.

---

## 1. Reemplazar archivos existentes

Sobreescribir estos tres con los archivos generados:

```
index.html       → reemplaza /index.html
main.js          → reemplaza /js/main.js
trabajo.html     → archivo NUEVO, va en la raíz
```

## 2. Patchear styles.css

Abrí `/css/styles.css`:

**a) Eliminá** este bloque (líneas ~180-188):

```css
.sidebar-logo-role {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
  display: block;
  margin-top: 4px;
}
```

Ya no se usa porque saqué el `"my site"`.

**b) Modificá** el bloque `footer` (línea ~397). El footer ahora tiene dos elementos: copyright a la izquierda, hora a la derecha. Los estilos actuales con `display: flex; justify-content: space-between` ya soportan eso, así que no hace falta tocar.

**c) Agregá** al FINAL del archivo todo el contenido de `styles-patch.css` (los nuevos estilos de home, reloj y `.footer-meta`).

## 3. Borrar archivos viejos

```bash
rm sobre-mi.html
rm ingenieria.html
rm codigo.html
rm apuntes.html
```

`sobre-mi.html` se elimina porque rompe la premisa de "no biografía".  
`ingenieria.html` y `codigo.html` se fusionaron en `trabajo.html`.  
`apuntes.html` queda redundante: el home ya es el feed.

## 4. Correcciones manuales en otras páginas

En `escritura.html`, `musica.html`, `biblioteca.html`, `cuantificados.html`:

**a) Footer** — buscar y reemplazar:

```html
<!-- VIEJO -->
<footer>
  <span>© 2026 Facundo Balbo — CONSTRUIDO PARA PERDURAR</span>
</footer>

<!-- NUEVO -->
<footer>
  <span>© 2026 — Facundo Balbo</span>
  <span class="footer-meta" id="footer-status"></span>
</footer>
```

**b) Favicon** — buscar y reemplazar en el `<head>` de TODAS las páginas:

```html
<!-- VIEJO -->
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🪐</text></svg>" />

<!-- NUEVO -->
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.85em' x='15' font-size='90' font-family='Georgia' font-style='italic' fill='%23c8956c'>F</text></svg>" />
```

**c) `cuantificados.html`** — corregir `<title>`:

```html
<!-- VIEJO -->
<title>Proyectos — Facundo Balbo</title>

<!-- NUEVO -->
<title>Cuantificados — Facundo Balbo</title>
```

**d) `escritura.html`** — buscar el header y suavizar copy:

```html
<!-- Reemplazar el contenido del .section-header por: -->
<span class="eyebrow">ESCRITURA</span>
<h1 class="section-title">Notas y ensayos en progreso.</h1>
<p>Lo que voy escribiendo, en bruto. Algunas cosas terminan en algún lado, otras se quedan acá.</p>
```

**e) `musica.html`** y **`biblioteca.html`** — chequear que el header no tenga frases auto-elogiosas tipo "construido para perdurar". Si las tiene, suavizar a un descriptor neutral.

## 5. CSS embebido en otras páginas

Ya separado del scope de esta tanda. Para una segunda iteración: mover los `<style>` blocks de `musica.html`, `escritura.html`, `cuantificados.html` al `styles.css`. No bloquea el deploy actual.

---

## Checklist final

- [ ] `index.html` reemplazado
- [ ] `js/main.js` reemplazado
- [ ] `trabajo.html` agregado
- [ ] `css/styles.css` patcheado (eliminar `.sidebar-logo-role`, agregar patch al final)
- [ ] `sobre-mi.html`, `ingenieria.html`, `codigo.html`, `apuntes.html` eliminados
- [ ] Footer y favicon corregidos en `escritura.html`, `musica.html`, `biblioteca.html`, `cuantificados.html`
- [ ] `<title>` de `cuantificados.html` corregido
- [ ] Probar local antes de pushear: que el reloj actualice, que el feed de apuntes cargue, que el sidebar tenga los 5 ítems en español, que ningún link rote a 404 (los enlaces internos `ingenieria.html` y `codigo.html` quedaron rotos, hay que reemplazarlos por `trabajo.html` donde aparezcan).

## Búsquedas útiles antes de pushear

```bash
# Encontrar links rotos a páginas eliminadas
grep -rn 'sobre-mi.html\|ingenieria.html\|codigo.html\|apuntes.html' .

# Encontrar el copy viejo que pueda haber quedado
grep -rn 'CONSTRUIDO PARA PERDURAR\|Soy Facu\|Mi Twitter Personal\|MY BOOKS\|my site' .

# Encontrar emojis residuales en el copy
grep -rn '😜\|😛\|🪐' . --include="*.html"
```

---

## Lo que no hice y por qué

**Feed unificado real (apuntes + lanzamientos + escritos + obra).** Esto requiere consolidar varias APIs y estructuras de datos. Hoy el home muestra solo apuntes. Es coherente, funciona, y es la forma más simple de validar la dirección. Si querés que lo expanda a feed mixto en una segunda iteración, lo armamos juntos definiendo el formato de cada tipo de entrada.

**Mover CSS embebido al `styles.css` global.** Funcional pero no urgente. Va en la próxima.

**Agregar `og:image`.** Falta una imagen tipo 1200×630 px para previews en WhatsApp/redes. Cuando la tengas, la subís a Cloudinary y agregás `<meta property="og:image" content="..." />` en cada `<head>`.
