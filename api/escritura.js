/* -------------------------------------------------------
   /api/escritura.js
   Proxy para la base de datos de Escritura en Notion.
   Devuelve escritos con Estado "Finalizado" o "En progreso".
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
  const preferred = ['Título', 'Title', 'Name', 'Nombre'];
  for (const name of preferred) {
    if (props[name]?.type === 'title') return props[name].title;
  }
  for (const key of Object.keys(props)) {
    if (props[key]?.type === 'title') return props[key].title;
  }
  return [];
}

function plainText(richText) {
  if (!Array.isArray(richText)) return '';
  return richText.map((rt) => rt.plain_text || '').join('');
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

function getCover(page) {
  if (!page.cover) return null;
  if (page.cover.type === 'external') return page.cover.external?.url || null;
  if (page.cover.type === 'file') return page.cover.file?.url || null;
  return null;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const dbId = process.env.NOTION_ENTRADAS_DB;
    if (!dbId) throw new Error('NOTION_ENTRADAS_DB no configurado');

    // Sin filtro servidor para mayor compatibilidad — el frontend filtra por Estado
    const data = await queryNotion(dbId, { page_size: 100 });

    const escritos = await Promise.all(
      data.results.map(async (page) => {
        const p = page.properties;
        const blocks = await getBlocks(page.id);

        const tituloRaw = getTitleProp(p);

        // Buscar el select de estado por nombre o por valor conocido
        const estadoProp = p['Estado'] || p['State'] || p['Status'] || null;
        const estado = estadoProp?.select?.name || estadoProp?.status?.name || '';

        return {
          id: page.id,
          titulo: plainText(tituloRaw),
          estado,
          cover: getCover(page),
          contenido: blocksToText(blocks),
        };
      })
    );

    return res.status(200).json({ escritos });
  } catch (err) {
    console.error('[/api/escritura]', err.message);
    return res.status(500).json({ error: 'No se pudieron cargar los escritos' });
  }
};
