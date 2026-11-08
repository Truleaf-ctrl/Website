import { Link } from 'react-router-dom';

// Shared trend-card tile (styles: trend-card.css). Used by the home page's Trending Products.
export default function TrendCard({ name, category, imageUrl, href }) {
  return (
    <Link to={href || '/catalogue'} className="trend-card">
      <div className="trend-card__image">
        <img src={imageUrl || ''} alt={name || ''} />
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
