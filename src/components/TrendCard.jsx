import { Link } from 'react-router-dom';

// Shared trend-card tile (styles: trend-card.css). Used by the home page's Trending Products.
// `onClick` lets a card open the product overlay instead of navigating.
export default function TrendCard({ name, category, imageUrl, href, onClick }) {
  const handleClick = onClick
    ? (e) => {
        e.preventDefault();
        onClick();
      }
    : undefined;

  return (
    <Link to={href || '/catalogue'} className="trend-card" onClick={handleClick}>
      <div className="trend-card__image">
        <img loading="lazy" decoding="async" src={imageUrl || ''} alt={name || ''} />
      </div>
      <div className="trend-card__body">
        <div className="trend-card__text">
          <span className="trend-card__eyebrow">{category || ''}</span>
          <h3>{name || ''}</h3>
        </div>
        <img src="/assets/icons/arrow-diagonal.svg" alt="" className="trend-card__icon" />
      </div>
    </Link>
  );
}
