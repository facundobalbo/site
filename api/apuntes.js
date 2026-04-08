/* -------------------------------------------------------
   /api/apuntes.js
   Proxy para la base de datos Apuntes de Notion.
   Devuelve entradas ordenadas por fecha de creación descendente.
   ------------------------------------------------------- */

const NOTION_VERSION = '2022-06-28';

function headers() {
  return {
    Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json',
  };
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

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const dbId = process.env.NOTION_APUNTES_DB;
    if (!dbId) throw new Error('NOTION_APUNTES_DB no configurado');

    const data = await queryNotion(dbId, {
      sorts: [{ timestamp: 'created_time', direction: 'descending' }],
      page_size: 100,
    });

    const apuntes = await Promise.all(
      data.results.map(async (page) => {
        const p = page.properties;
        const blocks = await getBlocks(page.id);

        return {
          id: page.id,
          etiqueta: p['Etiqueta']?.select?.name || '',
          fecha: plainText(p['Fecha']?.rich_text || []),
          contenido: blocksToText(blocks),
        };
      })
    );

    return res.status(200).json({ apuntes });
  } catch (err) {
    console.error('[/api/apuntes]', err.message);
    return res.status(500).json({ error: 'No se pudieron cargar los apuntes' });
  }
};
