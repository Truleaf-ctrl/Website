import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import BlogCard from '../components/BlogCard';
import ShareBar from '../components/ShareBar';
import { InlineImage, portableTextNodes } from '../components/PortableText';
import usePage from '../hooks/usePage';
import useReveal, { revealAll } from '../hooks/useReveal';
import useMotion from '../hooks/useMotion';
import { formatDate, sanityFetch } from '../lib/sanity';
import { SITE_CSS } from '../styles/site';

// Legacy posts (migrated before inline images existed) have a separate secondary image,
// dropped at the midpoint of the text. New-style posts place images inline.
function PostBody({ post }) {
  const nodes = portableTextNodes(post.body);
  const hasInlineImages = Array.isArray(post.body) && post.body.some((block) => block._type === 'image');
  if (hasInlineImages || !post.secondaryImage) return nodes.map((n) => n.node);

  // group blocks into chunks that each end with a paragraph, then split the chunks in half
  const chunks = [];
  let current = [];
  nodes.forEach((n) => {
    current.push(n.node);
    if (n.kind === 'paragraph') {
      chunks.push(current);
      current = [];
    }
  });
  if (current.length) chunks.push(current);
  const midpoint = Math.ceil(chunks.length / 2);
  return [
    ...chunks.slice(0, midpoint).flat(),
    <InlineImage key="secondary-image" src={post.secondaryImage} />,
    ...chunks.slice(midpoint).flat(),
  ];
}

export default function BlogPost() {
  const [params] = useSearchParams();
  const slug = params.get('post');
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    let alive = true;
    sanityFetch(
      `*[_type=="post" && hidden != true] | order(date desc){title, excerpt, category, author, date, readTime, body, "slug": slug.current, "image": image.asset->url, "secondaryImage": secondaryImage.asset->url}`
    )
      .then((result) => alive && setPosts(result || []))
      .catch((err) => console.error('Could not load blog post from Sanity', err));
    return () => {
      alive = false;
    };
  }, []);

  const post = posts && posts.length ? posts.find((p) => p.slug === slug) || posts[0] : null;
  const related = post ? posts.filter((p) => p.slug !== post.slug).slice(0, 3) : [];
  const article = useMemo(
    () => (post ? { author: post.author, date: post.date, category: post.category } : {}),
    [post]
  );

  usePage({
    title: post ? `${post.title} — Trueleaf Blog` : 'Blog — Trueleaf',
    description: post ? post.excerpt || '' : '',
    path: null,
    type: 'article',
    image: post ? post.image || '' : '',
    article,
    css: SITE_CSS,
  });
  useReveal();
  useMotion();

  // once the post is in, show everything at once
  useEffect(() => {
    if (post) revealAll();
  }, [post]);

  return (
    <>
      <header className="about-hero">
        <Nav />

        <nav className="breadcrumb content-wrap reveal" aria-label="Breadcrumb" id="breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb__sep">/</span>
          <Link to="/blog">Blog</Link>
          <span className="breadcrumb__sep">/</span>
          <span className="breadcrumb__current" id="breadcrumbCategory" aria-current="page">
            {post ? post.category || 'Blog' : ''}
          </span>
        </nav>

        <div className="about-hero__content about-hero__content--centered content-wrap reveal">
          <h1 className="about-hero__title" id="postTitle">
            {post ? post.title : 'Loading…'}
          </h1>
          <p className="about-hero__body about-hero__body--centered" id="postExcerpt">
            {post?.excerpt || ''}
          </p>
          <div className="post-meta" id="postMeta">
            <span className="post-meta__item" id="postMetaAuthor">
              {post?.author || ''}
            </span>
            <span className="post-meta__dot" aria-hidden="true">
              &middot;
            </span>
            <span className="post-meta__item" id="postMetaDate">
              {post ? formatDate(post.date) : ''}
            </span>
            <span className="post-meta__dot" aria-hidden="true">
              &middot;
            </span>
            <span className="post-meta__item" id="postMetaReadTime">
              {post?.readTime || ''}
            </span>
          </div>
          {post && <ShareBar title={post.title} variant="hero" />}
        </div>
      </header>

      <div className="blog-banner reveal">
        <img src={post?.image || undefined} alt={post?.title || ''} id="postHeroImage" />
      </div>

      <article className="blog-post">
        <div className="content-wrap blog-post__body reveal" id="postBody">
          {post && <PostBody post={post} />}
        </div>
      </article>

      <section className="blog-related">
        <div className="content-wrap">
          <p className="about-eyebrow">Blogs</p>
          <h2 className="about-heading">Related Articles</h2>
          <div className="blog-grid__inner blog-related__grid reveal-stagger" id="relatedGrid">
            {related.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
