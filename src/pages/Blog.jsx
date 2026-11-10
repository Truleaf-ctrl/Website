import { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import BlogCard from '../components/BlogCard';
import usePage from '../hooks/usePage';
import useReveal from '../hooks/useReveal';
import useMotion from '../hooks/useMotion';
import { sanityFetch } from '../lib/sanity';
import { SITE_CSS } from '../styles/site';

export default function Blog() {
  usePage({
    title: 'Blog | Truleaf',
    description: 'Insights on organic sourcing, food safety, compliance and export logistics from the Truleaf team.',
    path: '/blog',
    css: SITE_CSS,
  });
  useReveal();
  useMotion();

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let alive = true;
    sanityFetch(
      `*[_type=="post" && hidden != true] | order(date desc){title, excerpt, "slug": slug.current, "image": image.asset->url}`
    )
      .then((result) => alive && setPosts(result || []))
      .catch((err) => console.error('Could not load blog posts from Sanity', err));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <header className="about-hero">
        <Nav />

        <div className="about-hero__content content-wrap reveal">
          <h1 className="about-hero__title">Our Blog</h1>
          <p className="about-hero__body">
            We export certified organic fresh and processed produce and ingredients, sourced from origin and delivered
            globally with a focus on quality, compliance, and seamless logistics.
          </p>
        </div>
      </header>

      <div className="blog-banner reveal">
        <img src="/assets/images/blog-banner.webp" alt="Green barley field at dusk" />
      </div>

      <section className="blog-grid">
        <div className="content-wrap blog-grid__inner reveal-stagger" id="blogGridInner">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
