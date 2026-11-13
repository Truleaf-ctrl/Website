import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AppShell from './components/AppShell';
import Home from './pages/Home';

// the home page ships in the main bundle; every other page loads on first visit
const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Careers = lazy(() => import('./pages/Careers'));
const Catalogue = lazy(() => import('./pages/Catalogue'));
const Company = lazy(() => import('./pages/Company'));
const Contact = lazy(() => import('./pages/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const ProductsCoconut = lazy(() => import('./pages/ProductsCoconut'));
const Search = lazy(() => import('./pages/Search'));
const SupplyChain = lazy(() => import('./pages/SupplyChain'));
const PrdTemplate = lazy(() => import('./pages/PrdTemplate'));
const ProjectPrdTemplate = lazy(() => import('./pages/ProjectPrdTemplate'));

// Old static URLs (about.html, blog-post.html?post=…) keep working; anything else unknown goes home.
function Fallback() {
  const { pathname, search, hash } = useLocation();
  const m = pathname.match(/^\/([a-z-]+)\.html$/);
  if (!m) return <Navigate to="/" replace />;
  const to = m[1] === 'index' ? '/' : `/${m[1]}`;
  return <Navigate to={to + search + hash} replace />;
}

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog-post" element={<BlogPost />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/company" element={<Company />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/products-coconut" element={<ProductsCoconut />} />
          <Route path="/search" element={<Search />} />
          <Route path="/ready-to-retail" element={<SupplyChain />} />
          <Route path="/retail-to-business" element={<Navigate to="/ready-to-retail" replace />} />
          <Route path="/supply-chain" element={<Navigate to="/ready-to-retail" replace />} />
        </Route>
        <Route path="/prd-template" element={<PrdTemplate />} />
        <Route path="/project-prd-template" element={<ProjectPrdTemplate />} />
        <Route path="*" element={<Fallback />} />
      </Routes>
    </Suspense>
  );
}
