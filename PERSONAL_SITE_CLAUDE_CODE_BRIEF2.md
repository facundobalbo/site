# BRIEF — Sitio Personal: facundobalbo.github.io/site

**Para:** Claude Code  
**Fecha:** Marzo 2026  
**Owner:** Facundo Balbo — facundobalbo.ingcivil@gmail.com  
**Repo actual:** github.com/facundobalbo/site  
**Deploy target:** Vercel → facundobalbo.vercel.app (o dominio custom a futuro)

---

## 1. CONTEXTO Y PROBLEMA

El sitio actual es HTML estático. Tiene menú lateral y varias páginas individuales. Los problemas concretos son:

- Agregar una entrada nueva implica editar HTML manualmente, replicar estructura, formatear referencias a mano.
- El menú lateral es frágil: si cambia el nombre o ubicación de una página, hay que actualizar todos los links a mano.
- No hay separación entre contenido y presentación. Todo está mezclado.
- Crear una entrada nueva toma demasiado tiempo; hace meses que no se publica nada.

**El objetivo es simple:** un sistema donde agregar una nueva entrada sea crear un archivo `.mdx`, escribir, hacer commit y push. Vercel lo despliega solo en 30 segundos. Sin tocar HTML. Sin romper nada.

---

## 2. ARQUITECTURA

### Stack

```
Next.js 14 (App Router)
├── MDX para contenido (via @next/mdx + gray-matter)
├── Tailwind CSS para estilos
├── TypeScript
└── Vercel para deploy automático
```

### Dependencias

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@next/mdx": "^14.0.0",
    "@mdx-js/loader": "^3.0.0",
    "@mdx-js/react": "^3.0.0",
    "gray-matter": "^4.0.3",
    "date-fns": "^2.30.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "rss": "^1.2.2"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "typescript": "^5.0.0"
  }
}
```

---

## 3. ESTRUCTURA DE DIRECTORIOS

```
/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Home
│   │   ├── layout.tsx                # Root layout (nav + footer)
│   │   ├── ingenieria/
│   │   │   ├── page.tsx              # Lista de proyectos
│   │   │   └── [slug]/page.tsx       # Proyecto individual
│   │   ├── escritura/
│   │   │   ├── page.tsx              # Lista de entradas
│   │   │   └── [slug]/page.tsx       # Entrada individual
│   │   ├── musica/
│   │   │   └── page.tsx              # Discografía / EP
│   │   ├── libro/
│   │   │   ├── page.tsx              # Índice del libro
│   │   │   └── [slug]/page.tsx       # Capítulo individual
│   │   └── about/
│   │       └── page.tsx              # Bio + CV + links
│   ├── components/
│   │   ├── Nav.tsx
│   │   ├── Footer.tsx
│   │   ├── StreamCard.tsx
│   │   ├── ContentList.tsx
│   │   ├── MDXRenderer.tsx
│   │   ├── AudioPlayer.tsx
│   │   └── SearchBar.tsx
│   ├── lib/
│   │   ├── content.ts                # Helpers para leer MDX del filesystem
│   │   └── utils.ts
│   └── content/
│       ├── ingenieria/               # .mdx de proyectos de ingeniería
│       ├── escritura/                # .mdx de ensayos y reflexiones
│       ├── musica/                   # .mdx de tracks/EPs
│       └── libro-cuantificados/      # .mdx de capítulos del libro
│           ├── parte-1/
│           └── parte-2/
├── public/
│   ├── cv-facundo-balbo.pdf          # CV descargable
│   └── og-image.png                  # Open Graph
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## 4. ESQUEMA DE FRONTMATTER (por tipo de contenido)

### Ingeniería (`/ingenieria/*.mdx`)
```yaml
---
title: "Cierre Perimetral Parque Industrial Norte"
date: "2026-01-15"
tags: ["obra", "maquinaria", "BIM"]
status: "en_curso"          # en_curso | completado | archivado
tools: ["Civil 3D", "Revit", "Google Apps Script"]
summary: "Descripción breve del proyecto para la lista."
cover: "/images/ingenieria/pin-cover.jpg"   # opcional
---
```

### Escritura (`/escritura/*.mdx`)
```yaml
---
title: "El problema de la presencia"
date: "2026-03-10"
tags: ["filosofía", "tecnología", "Byung-Chul Han"]
summary: "Reflexión sobre la presencia en la era de la hiperconectividad."
published: true
---
```

### Música (`/musica/*.mdx`)
```yaml
---
title: "Vox Futura EP"
date: "2026-12-01"
type: "ep"                  # ep | single | album | wip
status: "en_proceso"        # publicado | en_proceso
tracks:
  - title: "Track 1"
    duration: "3:42"
    src: "/audio/vox-futura-01.mp3"   # si es self-hosted
    youtube: ""                        # si está en YouTube
  - title: "Track 2"
    duration: "4:15"
    src: ""
    youtube: "https://youtu.be/xxx"
summary: "EP de producción electrónica. Influencias: trip-hop, ambient, post-rock."
---
```

### Libro (`/libro-cuantificados/**/*.mdx`)
```yaml
---
title: "Capítulo 1: El sujeto cuantificado"
parte: 1
capitulo: 1
published: false            # true = visible como preview, false = solo índice
summary: "Introducción al concepto de cuantificación del yo."
---
```

---

## 5. PÁGINAS Y COMPONENTES — ESPECIFICACIONES DETALLADAS

### 5.1 Home (`/`)

La home es el punto de entrada. Debe comunicar en 5 segundos quién es Facundo y qué hace.

**Estructura:**
- **Hero:** Nombre + título de una línea + tagline breve. No es un carrusel, no hay imagen de perfil grande. Algo directo y con carácter.
- **Streams Grid:** 4-5 cards, una por área de contenido. Cada `StreamCard` muestra ícono, nombre del stream, descripción de 1 línea, cantidad de entradas.
- **Últimas entradas:** Lista flat de las últimas 5-6 entradas de cualquier stream (ordenadas por fecha). Cada ítem: fecha · stream · título.
- **Bio mínima:** 2-3 líneas sobre quién es. Sin sección larga de "Acerca de mí".

**No incluir en home:** formularios de contacto, testimonios, skills en barras de progreso, iconos de tecnologías en grid.

---

### 5.2 Ingeniería (`/ingenieria`)

Lista de proyectos. Puede mezclar proyectos de obra civil, herramientas de software construidas, sistemas de gestión.

**ContentList para ingeniería:**
- Filtros por tag (obra, BIM, software, automatización)
- Cards con: título, fecha, tags, status (badge: "En curso" / "Completado"), summary
- Orden cronológico inverso por defecto

**Proyecto individual (`/ingenieria/[slug]`):**
- Título, fecha, tools usadas como chips, status
- Cuerpo MDX completo (puede incluir imágenes, code blocks, tablas)
- Navegación anterior/siguiente

---

### 5.3 Escritura (`/escritura`)

Ensayos, reflexiones, notas de pensamiento. Influencias: Camus, Bauman, Byung-Chul Han. Tono entre filosófico y personal. Son ~38k palabras escritas esperando casa.

**ContentList para escritura:**
- No tiene filtros complejos, solo lista cronológica
- Cards: fecha · título · summary breve
- Resalta las entradas con tag "destacado" si se quiere

**Entrada individual:**
- Solo título, fecha, cuerpo MDX
- Tipografía de lectura: ancho limitado (~65ch), line-height generoso
- Tiempo estimado de lectura (calcular desde words)
- Sin barra lateral, sin distracciones

---

### 5.4 Música (`/musica`)

Contexto: Facundo es baterista y produce en FL Studio. Tiene un EP en proceso llamado **Vox Futura**. La página es su presencia pública de músico.

**Estructura:**
- Lista de lanzamientos/proyectos musicales (MDX)
- Para cada EP/album: título, año, tipo, status, tracklist
- `AudioPlayer` si hay audio self-hosted; si no, embed de YouTube/SoundCloud
- Notas de producción (opcional, como texto del MDX)

**AudioPlayer component:**
- Minimal. Solo: ▶ / ⏸, scrubber, tiempo, título del track, botón siguiente.
- Si el audio viene de YouTube/SoundCloud, embede el player nativo en un contenedor estilizado.
- Si es self-hosted (`.mp3` en `/public/audio/`), player HTML5 customizado.

---

### 5.5 Libro (`/libro`)

"Cuantificados" — libro de no-ficción/ensayo en proceso. ~38k palabras escritas.

**Índice (`/libro`):**
- Tabla de contenidos por partes y capítulos
- Cada capítulo muestra: número, título, si está disponible como preview o no
- Descripción/synopsis del libro en la parte superior

**Capítulo (`/libro/[slug]`):**
- Solo los capítulos con `published: true` en frontmatter son accesibles
- Los capítulos no publicados aparecen en el índice como "Próximamente" pero su ruta devuelve 404 o redirect al índice
- Misma tipografía de lectura que Escritura

---

### 5.6 About (`/about`)

**Contenido:**
- Bio de 2-3 párrafos. Quién es, qué hace, desde dónde escribe.
- **CV descargable:** botón que descarga `/public/cv-facundo-balbo.pdf`
- **Links externos:**
  - GitHub: github.com/facundobalbo
  - LinkedIn: linkedin.com/in/facundobalbo
  - Email: facundobalbo.ingcivil@gmail.com
  - METCON: grupometcon.com
- Stack actual (no barras de progreso, solo texto o chips flat)
- Foto opcional (si se quiere agregar después, placeholder por ahora)

---

## 6. COMPONENTES — CONTRATOS DE INTERFAZ

```typescript
// StreamCard.tsx
interface StreamCardProps {
  slug: string;          // ruta, ej: "ingenieria"
  icon: string;          // nombre del ícono (lucide o SVG custom)
  title: string;
  description: string;
  entryCount: number;
  color: "blue" | "green" | "amber" | "purple" | "red";
  href: string;
}

// ContentList.tsx
interface ContentListProps {
  items: ContentItem[];
  showStream?: boolean;   // si es en home, mostrar de qué stream es
  limit?: number;
}

interface ContentItem {
  slug: string;
  title: string;
  date: string;
  stream: "ingenieria" | "escritura" | "musica" | "libro";
  tags?: string[];
  summary?: string;
}

// AudioPlayer.tsx
interface Track {
  title: string;
  duration?: string;
  src?: string;          // self-hosted
  youtube?: string;      // youtube URL
  soundcloud?: string;
}
interface AudioPlayerProps {
  tracks: Track[];
  albumTitle: string;
}

// SearchBar.tsx
interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}
```

---

## 7. lib/content.ts — HELPERS REQUERIDOS

```typescript
// Leer todos los archivos MDX de un stream
export async function getContentByStream(
  stream: "ingenieria" | "escritura" | "musica" | "libro-cuantificados"
): Promise<ContentItem[]>

// Leer un MDX por stream + slug
export async function getContentBySlug(
  stream: string,
  slug: string
): Promise<{ frontmatter: any; content: string }>

// Leer las últimas N entradas de todos los streams
export async function getLatestContent(limit: number): Promise<ContentItem[]>

// Generar RSS feed
export async function generateRSSFeed(): Promise<string>
```

---

## 8. DISEÑO Y ESTÉTICA — DIRECCIÓN ESPECÍFICA

### Concepto visual

**Nombre de la dirección: "Paneles Verticales"**

La home no es una lista de secciones: son cuatro paneles que conviven en pantalla simultáneamente. Cada panel es un stream (Ingeniería, Escritura, Música, Libro). Al entrar, uno está abierto y los otros tres aparecen colapsados como columnas angostas con el nombre rotado verticalmente. Al hacer click en un panel cerrado, se expande con una transición fluida (`cubic-bezier(.4,0,.2,1)`) mientras los demás se contraen. La sensación es de explorar un archivo de cajones, no de scrollear una página.

No hay stats de "X años de experiencia". No se menciona la ciudad. No se usan separadores horizontales de doble guión. El protagonismo es el contenido: los streams, las entradas, el trabajo.

---

### Tipografía

Tres familias, tres roles. No mezclar más.

```css
/* Display: titulares hero, nombres de streams, títulos de entradas */
font-family: 'Fraunces', serif;
/* Pesos: 300 normal, 600 énfasis. El italic tiene personalidad propia — usar en taglines y títulos de escritura */

/* Monospace: fechas, etiquetas de stream, metadata, número de índice */
font-family: 'IBM Plex Mono', monospace;
/* Pesos: 400 data, 500 énfasis */

/* Body: nav links, descripciones, UI general */
font-family: 'DM Sans', sans-serif;
/* Pesos: 300 cuerpo largo, 400 normal, 500 énfasis UI */
```

Google Fonts import:
```
Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300;1,9..144,600
IBM+Plex+Mono:wght@400;500
DM+Sans:wght@300;400;500
```

**Jerarquía tipográfica:**
- Navbar logo `FB`: `IBM Plex Mono`, 12px, `letter-spacing: 0.08em`, uppercase
- Nombre en hero: `Fraunces`, 30-34px, weight 300. Nombre + apellido italic en la misma línea: `Facundo Balbo`
- Tagline hero: `Fraunces italic`, 13-14px, weight 300, color `--ink-dim`, alineado a la derecha
- Número de índice del panel (`01`, `02`...): `Fraunces`, 36px, weight 300, color `--line`
- Label de stream en panel cerrado: `IBM Plex Mono`, 10px, uppercase, `letter-spacing: 0.1em`, `writing-mode: vertical-rl`, color `--ink-dim`
- Título del stream cuando está abierto: `Fraunces`, 28px, weight 600
- Subtítulo/categoría: `IBM Plex Mono`, 9px, uppercase, `letter-spacing: 0.1em`, color `--ink-muted`
- Descripción del stream: `DM Sans`, 13px, weight 400, color `--ink-dim`, line-height 1.65
- Fecha en lista de entradas: `IBM Plex Mono`, 10px, color `--ink-muted`
- Título de entrada: `Fraunces`, 14px, weight 300. Los de escritura/libro van en italic

---

### Paleta de color

```css
:root {
  --bg-page:    #0C0E12;
  --bg-surface: #141720;
  --bg-hover:   #1C2028;

  --ink:        #E8EBF0;
  --ink-dim:    #8892A0;
  --ink-muted:  #4A5060;

  --line:       rgba(255,255,255,0.07);
  --line-hover: rgba(255,255,255,0.12);
}
```

El acento visual no es un color brillante. El acento son los números `Fraunces` y el contraste entre `--ink` y `--ink-muted`. No agregar teal, ámbar ni ningún color de UI brillante.

---

### Layout — estructura de la home

```
+--[nav: 100%]-------------------------------------------+
|  FB (mono)          links                               |
+--[hero: 100%]------------------------------------------+
|  Facundo Balbo (Fraunces)   Tagline italic (derecha)   |
+--[panels: 100%, height 420-480px]---------------------+
|  [Panel 01]  | [Panel 02] | [Panel 03] | [Panel 04]   |
|  ABIERTO     | cerrado    | cerrado    | cerrado       |
|  flex: 1     | flex: 52px | flex: 52px | flex: 52px   |
+--[footer minimal: 100%]--------------------------------+
|  FB · 2026          Ingeniería · Código · Escritura · Música  |
+--------------------------------------------------------+
```

**Lógica de los paneles:**

```css
/* Panel cerrado */
.panel {
  flex: 0 0 52px;
  overflow: hidden;
  transition: flex 0.5s cubic-bezier(.4,0,.2,1);
  cursor: pointer;
  border-right: 0.5px solid var(--line);
}

/* Panel abierto */
.panel.open {
  flex: 1 1 auto;
  cursor: default;
}
```

Dentro de cada panel hay **dos capas**:
1. `.panel-narrow` — visible solo cuando cerrado: número grande + label vertical. `opacity: 1` cuando cerrado, `opacity: 0; pointer-events: none` cuando abierto. `transition: opacity 0.2s`.
2. `.panel-content` — visible solo cuando abierto: subtítulo, título, descripción, lista de entradas. `opacity: 0` cuando cerrado, `opacity: 1` cuando abierto con `transition: opacity 0.3s 0.15s` (delay de 0.15s para que aparezca después de que el panel terminó de abrirse).

**Al cargar la página:** el panel de Ingeniería está abierto por defecto (`class="panel open"`).

**Hint de interacción:** en cada panel cerrado, al hacer hover, aparece la palabra `abrir` en `IBM Plex Mono` 9px con `writing-mode: vertical-rl`, posicionada en la parte inferior del panel, color `--ink-muted`. Desaparece cuando el panel no tiene hover.

**Click handler (JS vanilla):**
```javascript
document.querySelector('.panels').addEventListener('click', e => {
  const panel = e.target.closest('.panel');
  if (!panel || panel.classList.contains('open')) return;
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('open'));
  panel.classList.add('open');
});
```

---

### Contenido de cada panel cuando está abierto

**Panel Ingeniería:**
- Subtítulo: `STREAM 01`
- Título: Ingeniería
- Descripción: "Dirección de obra civil, sistemas de gestión y automatización de procesos de construcción."
- Lista de entradas (3-4): fecha · título en Fraunces 14px

**Panel Escritura:**
- Subtítulo: `STREAM 02`
- Título: Escritura
- Descripción: "Ensayos entre filosofía y técnica. Influencias: Camus, Bauman, Byung-Chul Han."
- Lista de entradas: fecha · título en Fraunces italic 14px

**Panel Música:**
- Subtítulo: `STREAM 03`
- Título: Música
- Descripción: "Baterista y productor en FL Studio. Trip-hop, ambient, post-rock."
- Entrada: `2026 · Vox Futura EP · en proceso`

**Panel Libro:**
- Subtítulo: `EN PROCESO`
- Título: Cuantificados
- Descripción: "El sujeto medido en la era de los datos. Ensayo de largo aliento."
- Lista de partes/capítulos disponibles como preview

---

### Páginas interiores (rutas `/ingenieria`, `/escritura`, etc.)

Las páginas interiores no usan el layout de paneles. Vuelven a un layout editorial clásico: navbar + contenido centrado.

**Lista de contenido** (ej: `/escritura`):
```
[fecha mono]  [título Fraunces, peso 300 para escritura / italic para ensayos]
```
Una fila por entrada, separadas por `border-bottom: 0.5px solid var(--line)`. Sin cards.

**Entrada individual** (ej: `/escritura/[slug]`):
```css
.reading-body {
  font-family: 'DM Sans', sans-serif;
  font-weight: 300;
  font-size: 17px;
  line-height: 1.85;
  max-width: 65ch;
  color: var(--ink-dim);
}
/* Dropcap: primera letra en Fraunces grande */
.reading-body p:first-of-type::first-letter {
  font-family: 'Fraunces', serif;
  font-size: 4.5em;
  font-weight: 600;
  float: left;
  line-height: 0.8;
  margin-right: 0.1em;
  margin-top: 0.1em;
  color: var(--ink);
}
```

**Player de música** (si hay tracks con audio):
- Una línea por track: `▶` · duración · título en Fraunces
- Scrubber: 1px de alto, sin thumb visible hasta hover
- Tiempo en `IBM Plex Mono`

---

### Animaciones

```css
/* Transición principal de paneles */
.panel {
  transition: flex 0.5s cubic-bezier(.4,0,.2,1);
}

/* Contenido del panel abierto aparece con delay */
.panel-content {
  opacity: 0;
  transition: opacity 0.3s 0.15s;
}
.panel.open .panel-content { opacity: 1; }

/* Contenido del panel cerrado desaparece rápido */
.panel-narrow {
  opacity: 1;
  transition: opacity 0.2s;
}
.panel.open .panel-narrow { opacity: 0; pointer-events: none; }

/* Page load */
@keyframes pageReveal {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: none; }
}
main { animation: pageReveal 0.3s ease; }

/* Hover en entry rows */
.entry-row { transition: background 0.15s ease; }
```

Sin scroll animations, sin parallax, sin typing effects.

---

### Mobile (≤ 768px)

En mobile los paneles no tienen sentido como columnas verticales. En viewport < 768px:
- Los 4 paneles se convierten en **acordeón vertical**: cada panel ocupa el ancho completo y se expande/colapsa verticalmente al hacer tap.
- El label deja de estar rotado y se muestra horizontal.
- La lógica JS es la misma pero la dirección de expansión cambia (height en lugar de flex-width).
- Navbar: hamburger a la derecha. Al abrir: overlay fullscreen con links en Fraunces grande.

---

### Lo que NO hacer

- Sin stats de "X años de experiencia", "X empresas", "X proyectos"
- Sin mención de la ciudad en la UI
- Sin separadores `--` ni `---` como elementos decorativos en textos
- Sin gradientes de ningún tipo
- Sin glassmorphism salvo `backdrop-filter: blur(12px)` en la navbar
- Sin barras de progreso de habilidades
- Sin grid de logos de tecnologías
- Sin foto grande en hero con texto superpuesto
- Sin testimonios
- Sin emojis en la UI
- Sin `border-radius` mayor a 8px
- Sin color de acento brillante (teal, ámbar, etc.)

---

## 9. NAVEGACIÓN

### Desktop
Navbar fija arriba. Fondo `var(--bg-page)` con `backdrop-filter: blur(12px)` y `border-bottom: 0.5px solid var(--line)`. Izquierda: `FB` en `IBM Plex Mono`, 12px, uppercase, link a home. Derecha: links en `DM Sans` 12px, color `--ink-dim`, hover `--ink`.

Los paneles de la home NO son la navegación, son el contenido. Los links de la navbar llevan a las páginas interiores de cada stream directamente.

### Mobile (≤ 768px)
Hamburger a la derecha de la navbar. Al abrir: overlay fullscreen `var(--bg-page)`, links en `Fraunces` 32px weight 300, apilados verticalmente con `border-bottom: 0.5px solid var(--line)` entre cada uno.

### Links generados dinámicamente
Routes: `/ingenieria`, `/escritura`, `/musica`, `/libro`, `/about`. Ningún link hardcodeado a un archivo HTML específico.

---

## 10. SEO Y META

Cada página debe tener:

```typescript
// En cada layout/page.tsx
export const metadata = {
  title: "Facundo Balbo — Ingeniería, Escritura, Música",
  description: "...",
  openGraph: {
    title: "...",
    description: "...",
    image: "/og-image.png",
  },
};
```

Robots.txt: permitir todo.
Sitemap: generar automáticamente via `next-sitemap` o el mecanismo nativo de Next 14.

---

## 11. RSS FEED

Generar `/feed.xml` con todas las entradas publicadas (escritura + ingeniería + libro capítulos públicos), ordenadas por fecha. Usar el package `rss` o el mecanismo nativo de Next.

---

## 12. WORKFLOW DE CONTENIDO (para el owner)

### Agregar una entrada de escritura

```bash
# 1. Crear archivo
touch src/content/escritura/nombre-del-articulo.mdx

# 2. Pegar frontmatter + contenido
# 3. Commit + push
git add . && git commit -m "escritura: agrega 'Nombre del artículo'"
git push

# Vercel detecta el push → rebuild automático → live en ~30 segundos
```

### Agregar un proyecto de ingeniería

```bash
touch src/content/ingenieria/nombre-del-proyecto.mdx
# Llenar frontmatter con title, date, tags, tools, status, summary
# Commit + push → live
```

### Publicar un capítulo del libro

```bash
# En el MDX del capítulo:
# published: true   (cambia de false a true)
# Commit + push → aparece automáticamente en /libro/[slug]
```

---

## 13. SETUP INICIAL

```bash
# Clonar repo existente y migrar (o crear nuevo)
npx create-next-app@14 site --typescript --tailwind --app --src-dir

cd site

# Instalar dependencias adicionales
npm install @next/mdx @mdx-js/loader @mdx-js/react gray-matter date-fns rss
npm install -D @types/rss

# Configurar next.config.mjs para MDX
# (ver sección de configuración abajo)
```

### next.config.mjs

```javascript
import createMDX from '@next/mdx';

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
};

export default withMDX(nextConfig);
```

---

## 14. CONTENIDO SEED (para verificar que el sistema funciona)

Claude Code debe crear **al menos 2 entradas de ejemplo por stream** para probar el sistema:

- `src/content/ingenieria/cierre-perimetral-parque-industrial.mdx` — Proyecto real de Facundo (Parque Industrial Norte, San Luis, enero-agosto 2026, maquinaria pesada, Google Apps Script + dashboard).
- `src/content/ingenieria/construnex-saas-apu.mdx` — ConstruNex (Next.js 14 + Supabase, app de presupuestación APU para construcción).
- `src/content/escritura/placeholder-entrada-1.mdx` — Texto de ejemplo.
- `src/content/escritura/placeholder-entrada-2.mdx` — Texto de ejemplo.
- `src/content/musica/vox-futura-ep.mdx` — EP en proceso, 0 tracks publicados, status "en_proceso".
- `src/content/libro-cuantificados/parte-1/capitulo-1.mdx` — Capítulo 1, `published: false`.
- `src/content/libro-cuantificados/parte-1/capitulo-2.mdx` — Capítulo 2, `published: true` (preview).

---

## 15. ENTREGABLES ESPERADOS DE CLAUDE CODE

1. **Scaffold completo** del proyecto con la estructura de directorios definida en la sección 3.
2. **Todos los componentes** de la sección 6, funcionando.
3. **Todas las rutas** de la sección 5, con sus layouts y páginas.
4. **lib/content.ts** con todos los helpers de la sección 7.
5. **Contenido seed** de la sección 14.
6. **Diseño aplicado**: paleta, tipografía, motion según sección 8.
7. **README.md** del repo explicando: qué es, cómo agregar contenido en 3 pasos, cómo hacer deploy.
8. El proyecto debe correr con `npm run dev` sin errores en local.
9. Debe estar listo para deploy en Vercel (sin configuración adicional).

---

## 16. PRIORIDAD DE IMPLEMENTACIÓN

Si algo se va a dejar para después por complejidad, este es el orden de prioridad:

1. **Imprescindible:** Home · Escritura · About · Nav funcional · MDX pipeline
2. **Alta:** Ingeniería · sistema de tags/filtros
3. **Media:** Libro (índice + capítulos)
4. **Puede ser Fase 2:** Música con AudioPlayer complejo · SearchBar · RSS feed · OG images dinámicas

---

*— Brief preparado en base a conversación con Facundo, Marzo 2026*
