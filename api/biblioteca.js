/* /api/biblioteca.js — Proxy para la base de datos Biblioteca de Notion. */

const { plainText, getTitleProp, getBlocks, queryNotion } = require('./_utils');

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

function blocksToText(blocks) {
  return blocks
    .filter((b) => b.type === 'paragraph')
    .map((b) => plainText(b.paragraph?.rich_text))
    .filter(Boolean)
    .join('\n\n');
}

async function fetchCover(titulo, autor) {
  // 1) Open Library
  try {
    const q = encodeURIComponent((titulo + ' ' + (autor || '')).trim());
    const res = await fetch(
      `https://openlibrary.org/search.json?q=${q}&limit=1&fields=cover_i`,
      { headers: { 'User-Agent': 'FacundoBalboSite/1.0' } }
    );
    if (res.ok) {
      const data = await res.json();
      const coverId = data.docs?.[0]?.cover_i;
      if (coverId) return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
    }
  } catch { /* continúa al fallback */ }

  // 2) Google Books como fallback
  try {
    const q = encodeURIComponent(`intitle:${titulo}${autor ? ` inauthor:${autor}` : ''}`);
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=1&fields=items(volumeInfo/imageLinks)`);
    if (res.ok) {
      const data = await res.json();
      const thumb = data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;
      if (thumb) return thumb.replace('http://', 'https://').replace('zoom=1', 'zoom=2');
    }
  } catch { /* sin portada */ }

  return null;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const dbId = process.env.NOTION_BIBLIOTECA_DB;
    if (!dbId) throw new Error('NOTION_BIBLIOTECA_DB no configurado');

    const data = await queryNotion(dbId, { page_size: 100 });

    const libros = await Promise.all(
      data.results.map(async (page) => {
        const p = page.properties;
        const blocks = await getBlocks(page.id);
        const titulo = plainText(getTitleProp(p));
        const autor = plainText(p['Autor']?.rich_text || []);
        const rating = extractRating(p);
        const portada = await fetchCover(titulo, autor);

        return {
          id: page.id,
          titulo,
          autor,
          puntuacion: rating.display,
          ratingNum: rating.num,
          etiqueta: p['Etiqueta']?.select?.name || '',
          leido: p['Leido']?.checkbox ?? false,
          actual: p['Actual']?.checkbox ?? false,
          resena: blocksToText(blocks),
          portada,
        };
      })
    );

    return res.status(200).json({ libros });
  } catch (err) {
    console.error('[/api/biblioteca]', err.message);
    return res.status(500).json({ error: 'No se pudo cargar la biblioteca' });
  }
};
