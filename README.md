# facundobalbo.site

Sitio personal. Next.js 14 + MDX + Tailwind. Deploy en Vercel.

---

## Agregar contenido en 3 pasos

### Nueva entrada de escritura

```bash
# 1. Crear el archivo
touch src/content/escritura/nombre-del-articulo.mdx

# 2. Escribir frontmatter + contenido
```

```yaml
---
title: "Título del artículo"
date: "2026-03-22"
tags: ["filosofía", "tecnología"]
summary: "Descripción breve para la lista."
published: true
---

Cuerpo del artículo en markdown...
```

```bash
# 3. Commit y push → Vercel despliega en ~30 segundos
git add . && git commit -m "escritura: agrega 'Título del artículo'"
git push
```

### Nuevo proyecto de ingeniería

```bash
touch src/content/ingenieria/nombre-del-proyecto.mdx
```

```yaml
---
title: "Nombre del proyecto"
date: "2026-01-01"
tags: ["obra", "BIM"]
status: "en_curso"           # en_curso | completado | archivado
tools: ["Civil 3D", "Revit"]
summary: "Descripción breve."
---
```

### Publicar un capítulo del libro

En el MDX del capítulo, cambiar:

```yaml
published: false   →   published: true
```

Commit y push. El capítulo aparece en `/libro/[slug]` automáticamente.

---

## Estructura de directorios

```
src/
├── app/                    # Rutas Next.js App Router
│   ├── page.tsx            # Home (paneles verticales)
│   ├── ingenieria/
│   ├── escritura/
│   ├── musica/
│   ├── libro/
│   └── about/
├── components/             # Componentes reutilizables
├── content/                # Todo el contenido en MDX
│   ├── ingenieria/
│   ├── escritura/
│   ├── musica/
│   └── libro-cuantificados/
└── lib/
    ├── content.ts          # Helpers para leer MDX
    └── utils.ts            # formatDate, readingTime, slugify
```

---

## Dev local

```bash
npm install
npm run dev     # http://localhost:3000
```

## Deploy

Push a `main` → Vercel detecta el push y despliega automáticamente.

---

## Contacto

facundobalbo.ingcivil@gmail.com
