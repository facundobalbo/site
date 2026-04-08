/* -------------------------------------------------------
   /api/biblioteca.js
   Proxy para la base de datos Biblioteca de Notion.
   Solo devuelve páginas donde Actual === false (libros ya leídos).
   ------------------------------------------------------- */

const NOTION_VERSION = '2022-06-28';

function headers() {
  return {
    Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json',
  };
}

function getTitleProp(props) {
  const preferred = ['Título', 'Title', 'Name', 'Nombre', 'Libro'];
  for (const name of preferred) {
    if (props[name]?.type === 'title') return props[name].title;
  }
  // Fallback: cualquier propiedad de tipo title
  for (const key of Object.keys(props)) {
    if (props[key]?.type === 'title') return props[key].title;
  }
  return [];
}

function plainText(richText) {
  if (!Array.isArray(richText)) return '';
  return richText.map((rt) => rt.plain_text || '').join('');
}

function extractRating(props) {
  if (props.Puntuacion?.type === 'number' && props.Puntuacion.number != null) {
    const n = props.Puntuacion.number;
    if (n <= 5) return { display: '★'.repeat(n) + '☆'.repeat(5 - n), num: n };
    return { display: `${n} / 10`, num: n };
  }
  if (props.Puntuacion?.type === 'select' && props.Puntuacion.select?.name) {
    const name = props.Puntuacion.select.name;
    const num = (name.match(/★/g) || []).length;
    return { display: name, num };
  }
  return { display: '', num: 0 };
}

async function getBlocks(pageId) {
  const res = await fetch(
    `https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`,
    { headers: headers() }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}

function blocksToText(blocks) {
  return blocks
    .filter((b) => b.type === 'paragraph')
    .map((b) => plainText(b.paragraph?.rich_text))
    .filter(Boolean)
    .join('\n\n');
}

async function queryNotion(dbId, body) {
  const res = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Notion error ${res.status}: ${err}`);
  }
  return res.json();
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const dbId = process.env.NOTION_BIBLIOTECA_DB;
    if (!dbId) throw new Error('NOTION_BIBLIOTECA_DB no configurado');

    // Traer todos — el filtro leídos/pendientes lo hace el frontend
    const data = await queryNotion(dbId, { page_size: 100 });

    const libros = await Promise.all(
      data.results.map(async (page) => {
        const p = page.properties;
        const blocks = await getBlocks(page.id);

        const tituloRaw = getTitleProp(p);
        const rating = extractRating(p);

        return {
          id: page.id,
          titulo: plainText(tituloRaw),
          autor: plainText(p['Autor']?.rich_text || []),
          puntuacion: rating.display,
          ratingNum: rating.num,
          etiqueta: p['Etiqueta']?.select?.name || '',
          actual: p['Actual']?.checkbox ?? false,
          resena: blocksToText(blocks),
        };
      })
    );

    return res.status(200).json({ libros });
  } catch (err) {
    console.error('[/api/biblioteca]', err.message);
    return res.status(500).json({ error: 'No se pudo cargar la biblioteca' });
  }
};
