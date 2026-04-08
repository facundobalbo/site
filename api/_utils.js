/* -------------------------------------------------------
   Shared utilities for Notion API calls.
   Files starting with _ are not treated as Vercel routes.
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

function getTitleProp(props) {
  const preferred = ['Título', 'Title', 'Name', 'Nombre', 'Libro'];
  for (const name of preferred) {
    if (props[name]?.type === 'title') return props[name].title;
  }
  for (const key of Object.keys(props)) {
    if (props[key]?.type === 'title') return props[key].title;
  }
  return [];
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

module.exports = { headers, plainText, getTitleProp, getBlocks, queryNotion };
