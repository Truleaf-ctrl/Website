import { urlForImageRef } from '../lib/sanity';

// Renders Sanity Portable Text: paragraphs, headings, blockquotes, bold/italic/
// underline/code, links, bullet/numbered lists and inline images.
const BLOCK_TAGS = { h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', blockquote: 'blockquote' };

function Spans({ children, markDefs }) {
  return (children || []).map((span, i) => {
    let node = span.text || '';
    (span.marks || []).forEach((mark) => {
      if (mark === 'strong') node = <strong>{node}</strong>;
      else if (mark === 'em') node = <em>{node}</em>;
      else if (mark === 'code') node = <code>{node}</code>;
      else if (mark === 'underline') node = <u>{node}</u>;
      else {
        const linkDef = (markDefs || []).find((def) => def._key === mark && def._type === 'link');
        if (linkDef) {
          node = (
            <a href={linkDef.href || '#'} target="_blank" rel="noopener">
              {node}
            </a>
          );
        }
      }
    });
    return <span key={span._key || i}>{node}</span>;
  });
}

export function InlineImage({ src, alt = '' }) {
  return (
    <div className="blog-post__image">
      <img loading="lazy" decoding="async" src={src} alt={alt} />
    </div>
  );
}

// Groups list items into <ul>/<ol> and returns one React node per top-level block.
const isBoldLine = (b) =>
  b &&
  b._type === 'block' &&
  !b.listItem &&
  (b.style || 'normal') === 'normal' &&
  (b.children || []).some((c) => (c.text || '').trim()) &&
  (b.children || []).every((c) => !(c.text || '').trim() || (c.marks || []).includes('strong'));

// A closing call-to-action ("Looking for ...?" in bold, followed by a line or two) is set apart as a breaker.
function findCtaStart(blocks) {
  for (let i = blocks.length - 2; i >= Math.max(1, blocks.length - 4); i -= 1) {
    if (isBoldLine(blocks[i]) && blocks.slice(i + 1).every((b) => b._type === 'block' && !b.listItem)) return i;
  }
  return -1;
}

export function portableTextNodes(blocks, { cta = true } = {}) {
  if (!Array.isArray(blocks)) return [];
  const ctaStart = cta ? findCtaStart(blocks) : -1;
  if (ctaStart > 0) {
    return [
      ...portableTextNodes(blocks.slice(0, ctaStart), { cta: false }),
      {
        kind: 'cta',
        node: (
          <aside key="post-cta" className="blog-post__cta">
            {portableTextNodes(blocks.slice(ctaStart), { cta: false }).map((n) => n.node)}
          </aside>
        ),
      },
    ];
  }
  const nodes = [];
  let list = null; // { type, items: [] }

  const closeList = () => {
    if (!list) return;
    const Tag = list.type === 'bullet' ? 'ul' : 'ol';
    nodes.push({ kind: 'list', node: <Tag key={`list-${nodes.length}`}>{list.items}</Tag> });
    list = null;
  };

  blocks.forEach((block, i) => {
    const key = block._key || i;
    if (block._type === 'image') {
      closeList();
      const url = urlForImageRef(block.asset && block.asset._ref);
      if (url) nodes.push({ kind: 'image', node: <InlineImage key={key} src={url} alt={block.alt || ''} /> });
      return;
    }
    if (block._type !== 'block') return;

    if (block.listItem) {
      const type = block.listItem === 'number' ? 'number' : 'bullet';
      if (!list || list.type !== type) {
        closeList();
        list = { type, items: [] };
      }
      list.items.push(
        <li key={key}>
          <Spans children={block.children} markDefs={block.markDefs} />
        </li>
      );
      return;
    }

    closeList();
    const Tag = BLOCK_TAGS[block.style] || 'p';
    nodes.push({
      kind: Tag === 'p' ? 'paragraph' : 'block',
      node: (
        <Tag key={key}>
          <Spans children={block.children} markDefs={block.markDefs} />
        </Tag>
      ),
    });
  });

  closeList();
  return nodes;
}

export default function PortableText({ value }) {
  return <>{portableTextNodes(value).map((n) => n.node)}</>;
}
