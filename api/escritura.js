/* /api/escritura.js — Proxy para la base de datos de Escritura en Notion. */

const { plainText, getTitleProp, getBlocks, queryNotion } = require('./_utils');

function getCover(page) {
  if (!page.cover) return null;
  if (page.cover.type === 'external') return page.cover.external?.url || null;
  if (page.cover.type === 'file') return page.cover.file?.url || null;
  return null;
}

function blocksToHtml(blocks) {
  return blocks
    .map((b) => {
      if (b.type === 'paragraph') {
        const text = plainText(b.paragraph?.rich_text);
        return text ? `<p>${text.replace(/\n/g, '<br>')}</p>` : null;
      }
      if (b.type === 'image') {
        const url = b.image?.type === 'external'
          ? b.image.external?.url
          : b.image?.file?.url;
        const caption = plainText(b.image?.caption);
        if (!url) return null;
        return `<figure class="essay-figure"><img class="essay-content-image" src="${url}" alt="${caption || ''}" loading="lazy" />${caption ? `<figcaption class="essay-caption">${caption}</figcaption>` : ''}</figure>`;
      }
      return null;
    })
    .filter(Boolean)
    .join('');
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const dbId = process.env.NOTION_ENTRADAS_DB;
    if (!dbId) throw new Error('NOTION_ENTRADAS_DB no configurado');

    const data = await queryNotion(dbId, { page_size: 100 });

    const escritos = await Promise.all(
      data.results.map(async (page) => {
        const p = page.properties;
        const blocks = await getBlocks(page.id);
        const estadoProp = p['Estado'] || p['State'] || p['Status'] || null;
        return {
          id: page.id,
          titulo: plainText(getTitleProp(p)),
          estado: estadoProp?.select?.name || estadoProp?.status?.name || '',
          cover: getCover(page),
          contenido: blocksToHtml(blocks),
        };
      })
    );

    return res.status(200).json({ escritos });
  } catch (err) {
    console.error('[/api/escritura]', err.message);
    return res.status(500).json({ error: 'No se pudieron cargar los escritos' });
  }
};
