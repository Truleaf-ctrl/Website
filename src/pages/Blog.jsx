import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Pagination, { scrollToList, usePageParam } from '../components/Pagination';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import BlogCard from '../components/BlogCard';
import usePage from '../hooks/usePage';
import useReveal from '../hooks/useReveal';
import useMotion from '../hooks/useMotion';
import { sanityFetch } from '../lib/sanity';
import { SITE_CSS } from '../styles/site';

// 9 = three full rows of the three-column grid
const BLOG_PAGE_SIZE = 9;

export default function Blog() {
  usePage({
    title: 'Blog | Truleaf',
    description: 'Insights on organic sourcing, food safety, compliance and export logistics from the Truleaf team.',
    path: '/blog',
    css: SITE_CSS,
  });
  useMotion();

  const [posts, setPosts] = useState([]);
  const [searchParams] = useSearchParams();
  const { page, totalPages, start, end } = usePageParam(searchParams, posts.length, BLOG_PAGE_SIZE);
  // re-scan on page change so the new cards fade in
  useReveal([page, posts.length]);
  const toTop = () => scrollToList('blogGrid');

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

      <main id="main">

      <div className="blog-banner">
        <img src="/webimg/blog-banner.webp" alt="" />
      </div>

      <section className="blog-grid" id="blogGrid">
        <div key={page} className="content-wrap blog-grid__inner reveal-stagger" id="blogGridInner">
          {posts.slice(start, end).map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
        <div className="content-wrap">
          <Pagination page={page} totalPages={totalPages} onNavigate={toTop} label="Blog pages" />
        </div>
      </section>

      </main>


      <Footer />
    </>
  );
}
