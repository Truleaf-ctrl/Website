import { Link } from 'react-router-dom';
import Highlight from './Highlight';
import { PRODUCT_LISTING_URL } from '../lib/sanity';

// Shared category-card row (styles: category-card.css). Used by the home page's
// Featured Categories, the catalogue and the search results page.
// Cards link to the product listing page by default; `arrow={false}` only hides
// the arrow. `onClick` lets a card open the product overlay instead of navigating.
export default function CategoryCard({ name, description, imageUrl, href, terms, arrow = true, onClick }) {
  const handleClick = onClick
    ? (e) => {
        e.preventDefault();
        onClick();
      }
    : undefined;

  return (
    <Link to={href || PRODUCT_LISTING_URL} className="category-card" onClick={handleClick}>
      <div className="category-card__image">{imageUrl ? <img src={imageUrl} alt="" /> : null}</div>
      <div className="category-card__info">
        <h3>
          <Highlight text={name} terms={terms} />
        </h3>
        <p>
          <Highlight text={description} terms={terms} />
        </p>
      </div>
      {arrow && (
        <span className="category-card__arrow" aria-hidden="true">
          <img src="/assets/icons/arrow-diagonal.svg" alt="" />
        </span>
      )}
    </Link>
  );
}
