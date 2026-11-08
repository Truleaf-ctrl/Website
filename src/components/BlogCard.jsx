import { Link } from 'react-router-dom';
import { postHref } from '../lib/search';

export default function BlogCard({ post }) {
  return (
    <Link className="blog-card" to={postHref(post)}>
      <div className="blog-card__image">
        <img src={post.image || ''} alt="" />
      </div>
      <div className="blog-card__body">
        <h3>{post.title}</h3>
        <p>{post.excerpt || ''}</p>
        <span className="blog-card__link">Read More</span>
      </div>
    </Link>
  );
}
