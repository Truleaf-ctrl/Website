// Wraps every search term found in `text` with <mark>.
export default function Highlight({ text, terms }) {
  const value = text || '';
  if (!terms || !terms.length) return value;
  const pattern = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  return value.split(pattern).map((part, i) => (i % 2 === 1 ? <mark key={i}>{part}</mark> : part));
}
