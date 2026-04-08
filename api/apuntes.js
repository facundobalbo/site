/* /api/apuntes.js — Proxy para la base de datos Apuntes de Notion. */

const { plainText, getBlocks, queryNotion } = require('./_utils');

function blocksToText(blocks) {
  return blocks
    .filter((b) => b.type === 'paragraph')
    .map((b) => plainText(b.paragraph?.rich_text))
    .filter(Boolean)
    .join('\n\n');
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
