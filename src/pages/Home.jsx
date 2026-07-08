import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { allProducts, productData } from '../data/productData';
import {
  Smartphone, Laptop, Tv, Headphones, Refrigerator, Gamepad2, Camera, Watch,
  ShoppingCart, Heart, Truck, ShieldCheck, Mail, Zap,
  ChevronLeft, ChevronRight, ArrowRight, ArrowUpRight,
  ShoppingBag, Wallet, CreditCard, Package, Power, Blend
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import SEO from '../components/SEO';

export const formatCurrency = (amount) => '₦' + (amount || 0).toLocaleString('en-NG');

/* ─────────────────────────────────────────────
   PRODUCT CARD  (reference style)
───────────────────────────────────────────── */
export const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const inWishlist = isInWishlist(product.id);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  // Monthly installment estimate (12 months)
  const monthlyInstallment = Math.ceil(product.price / 12);

  return (
    <article className="ref-product-card" tabIndex="0">
      {/* Badges */}
      <div className="ref-product-badges">
        {product.badge === 'hot' && <span className="ref-badge ref-badge-red">Hot Deal</span>}
        {(product.badge === 'new') && <span className="ref-badge ref-badge-gold">New</span>}
        {discount > 0 && <span className="ref-badge ref-badge-red">Save {discount}%</span>}
        {product.bnpl && <span className="ref-badge ref-badge-gold">BNPL</span>}
      </div>

      {/* Wishlist */}
      <button
        className={`ref-wishlist-btn ${inWishlist ? 'active' : ''}`}
        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        onClick={e => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
      >
        <Heart size={16} fill={inWishlist ? '#B30000' : 'none'} color={inWishlist ? '#B30000' : '#999'} />
      </button>

      <Link to={`/product/${product.id}`} style={{ display: 'contents' }}>
        {/* Product Image */}
        <div className="ref-product-img">
          <img
            src={product.imgUrl || product.image || (product.images && product.images[0]) || '/placeholder.jpg'}
            alt={product.name}
            onError={e => { e.target.style.display = 'none'; }}
          />
        </div>

        {/* Product Info */}
        <div className="ref-product-info">
          <div className="ref-product-category">{product.category || product.department || 'Electronics'}</div>
          <h3 className="ref-product-title">{product.name}</h3>

          {/* Star Rating */}
          <div className="ref-product-rating">
            <span className="ref-stars">{'★'.repeat(Math.min(5, Math.floor(Number(product.rating) || 4)))}{'☆'.repeat(Math.max(0, 5 - Math.floor(Number(product.rating) || 4)))}</span>
            <span className="ref-rating-count">({Number(product.reviews) || 0})</span>
          </div>

          {/* Price */}
          <div className="ref-price-section">
            <div className="ref-price-row">
              {product.originalPrice && <span className="ref-old-price">{formatCurrency(product.originalPrice)}</span>}
              <span className="ref-price-full">{formatCurrency(product.price)}</span>
            </div>
            <div className="ref-price-installment">
              Save to Buy Plan: <span>from {formatCurrency(monthlyInstallment)}/mo</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Add to Cart */}
      <button
        className="ref-add-to-cart-btn"
        onClick={e => { e.stopPropagation(); addToCart(product); }}
        aria-label={`Add ${product.name} to cart`}
      >
        <ShoppingCart size={16} /> Add to Cart
      </button>
    </article>
  );
};

/* ─────────────────────────────────────────────
   SCROLLABLE PRODUCT SLIDER
───────────────────────────────────────────── */
const ProductRow = ({ products }) => {
  const scrollRef = useRef(null);
  const scroll = (dir) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === 'left' ? -460 : 460, behavior: 'smooth' });
  };
  return (
    <div className="ref-product-slider">
      <button className="ref-slider-btn ref-slider-left" onClick={() => scroll('left')} aria-label="Scroll left"><ChevronLeft size={18} /></button>
      <div className="ref-product-scroll" ref={scrollRef}>
        {products?.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
      <button className="ref-slider-btn ref-slider-right" onClick={() => scroll('right')} aria-label="Scroll right"><ChevronRight size={18} /></button>
    </div>
  );
};

/* ─────────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────────── */
export default function Home() {
  const { showToast } = useApp();
  const navigate = useNavigate();
  const [data, setData] = useState({ flashSale: [], newArrivals: [], featured: [], all: [] });
  const [heroSlides, setHeroSlides] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [email, setEmail] = useState('');
  const timerRef = useRef(null);

  /* ── FETCH DATA ── */
  useEffect(() => {
    // Firebase is disabled; using default heroSlides
  }, []);

  useEffect(() => {
    import('../utils/productService').then(({ getProducts }) => getProducts()).then(dbProducts => {
      if (dbProducts?.length) setData({
        flashSale: dbProducts.slice(0, 8),
        newArrivals: dbProducts.slice(0, 8),
        featured: dbProducts.slice(0, 4),
        all: dbProducts
      });
    }).catch(() => {});
  }, []);

  /* ── HERO AUTO-ADVANCE ── */
  const goToSlide = useCallback((idx) => {
    if (isTransitioning || !heroSlides.length) return;
    setIsTransitioning(true);
    setActiveSlide(idx);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning, heroSlides.length]);

  useEffect(() => {
    if (!heroSlides.length) return;
    timerRef.current = setInterval(() => goToSlide((activeSlide + 1) % heroSlides.length), 7000);
    return () => clearInterval(timerRef.current);
  }, [heroSlides.length, activeSlide, goToSlide]);

  const slide = heroSlides[activeSlide] || {};

  /* ── STATIC DATA ── */
  const sidebarCategories = [
    { icon: <Tv size={18} />, label: 'Televisions & Audio', q: 'tv' },
    { icon: <Smartphone size={18} />, label: 'Phones & Tablets', q: 'smartphone' },
    { icon: <Laptop size={18} />, label: 'Laptops & Computers', q: 'laptop' },
    { icon: <Refrigerator size={18} />, label: 'Refrigerators & Freezers', q: 'fridge' },
    { icon: <Zap size={18} />, label: 'Generators & Power', q: 'generator' },
    { icon: <Headphones size={18} />, label: 'Audio & Headphones', q: 'headphone' },
    { icon: <Gamepad2 size={18} />, label: 'Gaming Consoles', q: 'gaming' },
    { icon: <Camera size={18} />, label: 'Cameras', q: 'camera' },
  ];

  const brands = ['SAMSUNG', 'APPLE', 'LG', 'HP', 'SONY', 'HISENSE', 'NEXUS', 'ITEL'];

  const processSteps = [
    { icon: <ShoppingBag size={36} />, title: '1. Select Product', desc: 'Browse our full catalog and choose your desired electronics.' },
    { icon: <Wallet size={36} />, title: '2. Choose Payment Plan', desc: 'Select Daily, Weekly, Monthly installments or instant BNPL via Klump.' },
    { icon: <CreditCard size={36} />, title: '3. Make Payments', desc: 'Track your progress directly from your personal dashboard.' },
    { icon: <Truck size={36} />, title: '4. Fast Delivery', desc: 'Get your item immediately (BNPL) or on full completion (installments).' },
  ];

  const categoryCards = [
    { label: 'Smart TVs', q: 'tv', image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=1000&auto=format&fit=crop', accent: '#4cc9f0' },
    { label: 'Generator', q: 'generator', image: 'https://images.unsplash.com/photo-1509391366360-128a3f858eb5?q=80&w=1000&auto=format&fit=crop', accent: '#ffb703' },
    { label: 'Fridge & Freezer', q: 'fridge', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1000&auto=format&fit=crop', accent: '#a8dadc' },
    { label: 'Air Conditioners', q: 'air conditioner', image: 'https://images.unsplash.com/photo-1616422285623-14fb795e59c1?q=80&w=1000&auto=format&fit=crop', accent: '#00bbf9' },
    { label: 'Audio Bars', q: 'audio', image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1000&auto=format&fit=crop', accent: '#f15bb5' },
    { label: 'Microwave Ovens', q: 'microwave', image: 'https://images.unsplash.com/photo-1585659722983-39cb8eca8da3?q=80&w=1000&auto=format&fit=crop', accent: '#fee440' },
    { label: 'Small Home Appliances', q: 'small appliance', image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=1000&auto=format&fit=crop', accent: '#9b5de5' },
    { label: 'Power Solutions', q: 'power', image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1000&auto=format&fit=crop', accent: '#fb5607' },
    { label: 'Home Appliances', q: 'appliance', image: 'https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?q=80&w=1000&auto=format&fit=crop', accent: '#3a86ff' },
  ];

  return (
    <main id="main" className="ref-main">
      <SEO
        title="Mac-Christar Limited — Premium Electronics Nigeria"
        description="Buy the latest phones, laptops, TVs and home appliances at Mac-Christar Limited. Flexible installment plans, Buy Now Pay Later, fast nationwide delivery."
        url="/"
      />

      {/* ══════════════════════════════════════════
          SHOP BY CATEGORY GRID (MOVED TO TOP)
      ══════════════════════════════════════════ */}
      <div className="ref-container ref-section">
        <h2 className="ref-section-title">Shop by Category</h2>
        <div className="ref-cat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {categoryCards.map(cat => (
            <Link
              key={cat.q}
              to={`/shop?q=${cat.q}`}
              className="ref-cat-card"
              style={{ backgroundImage: `url(${cat.image})` }}
              aria-label={`Browse ${cat.label}`}
            >
              <div className="ref-cat-card-overlay"></div>
              <div className="ref-cat-card-content">
                <h3>{cat.label}</h3>
                <span className="ref-cat-card-arrow" style={{ color: cat.accent, background: 'rgba(0,0,0,0.5)' }}>
                  <ArrowUpRight size={20} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          ALL PRODUCTS
      ══════════════════════════════════════════ */}
      {data.all.length > 0 && (
        <div className="ref-container ref-section" style={{ paddingTop: 0 }}>
          <div className="ref-section-header">
            <h2 className="ref-section-title">All Products</h2>
          </div>
          <ProductRow products={data.all} />
        </div>
      )}

      <section className="mc2-hero" aria-label="Hero">
        {/* Animated background blobs */}
        <div className="mc2-hero-blob mc2-hero-blob-1" aria-hidden="true" />
        <div className="mc2-hero-blob mc2-hero-blob-2" aria-hidden="true" />
        <div className="mc2-hero-blob mc2-hero-blob-3" aria-hidden="true" />
        <div className="mc2-hero-grid-overlay" aria-hidden="true" />

        <div className="mc2-hero-inner">
          {/* LEFT — Text Content */}
          <div className="mc2-hero-content">
            <div className="mc2-hero-eyebrow">
              <span className="mc2-hero-star">★</span>
              <span>NIGERIA'S #1 TECH STORE</span>
            </div>

            <h1 className="mc2-hero-headline">
              Premium<br />
              Electronics.<br />
              <span className="mc2-hero-headline-accent">Yours, Instantly.</span>
            </h1>

            <p className="mc2-hero-subtext">
              Flexible installments. BNPL via Klump.<br className="mc2-hero-br" />
              Fast nationwide delivery.
            </p>

            <div className="mc2-hero-ctas">
              <Link to="/shop" className="mc2-hero-btn-primary">
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link to="/shop?sort=featured" className="mc2-hero-btn-ghost">
                View Deals
              </Link>
            </div>

            <div className="mc2-hero-trust">
              <div className="mc2-trust-chip">
                <ShieldCheck size={14} />
                <span>12K+ Orders</span>
              </div>
              <div className="mc2-trust-chip">
                <Package size={14} />
                <span>100% Genuine</span>
              </div>
              <div className="mc2-trust-chip">
                <Zap size={14} />
                <span>BNPL Available</span>
              </div>
            </div>
          </div>

          {/* RIGHT — Product Visual */}
          <div className="mc2-hero-visual">
            <div className="mc2-hero-glow-ring" aria-hidden="true" />
            <div className="mc2-hero-glow-ring mc2-hero-glow-ring-2" aria-hidden="true" />
            <div className="mc2-hero-img-wrap">
              <img
                src={slide.image || 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?q=80&w=880&auto=format&fit=crop'}
                alt="Premium Tech"
                className="mc2-hero-product-img"
              />
            </div>
            {/* Secondary floating product */}
            <div className="mc2-hero-secondary-img">
              <img
                src="https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=400&auto=format&fit=crop"
                alt="Featured Product"
              />
            </div>

            {/* Floating info cards */}
            <div className="mc2-hero-card mc2-hero-card-1">
              <Zap size={16} className="mc2-hero-card-icon" />
              <div>
                <div className="mc2-hero-card-title">Flash Sale</div>
                <div className="mc2-hero-card-sub">Up to 40% off</div>
              </div>
            </div>
            <div className="mc2-hero-card mc2-hero-card-2">
              <Truck size={16} className="mc2-hero-card-icon" />
              <div>
                <div className="mc2-hero-card-title">Free Delivery</div>
                <div className="mc2-hero-card-sub">Orders over ₦50k</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mc2-hero-scroll-indicator" aria-hidden="true">
          <div className="mc2-scroll-dot" />
        </div>
      </section>



      {/* ══════════════════════════════════════════
          FEATURED BRANDS BAR
      ══════════════════════════════════════════ */}
      <div className="ref-container">
        <div className="ref-brands-bar" aria-label="Featured brands">
          {brands.map(b => (
            <Link key={b} to={`/shop?brand=${b.toLowerCase()}`} className="ref-brand-logo">{b}</Link>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          HOW INSTALLMENTS WORK
      ══════════════════════════════════════════ */}
      <div className="ref-container">
        <section className="ref-process-section" aria-label="How it works">
          <h2 className="ref-section-title ref-section-title-center">How Flexible Purchasing Works</h2>
          <div className="ref-process-grid">
            {processSteps.map(step => (
              <div key={step.title} className="ref-process-step">
                <div className="ref-process-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ══════════════════════════════════════════
          FLASH SALES
      ══════════════════════════════════════════ */}
      {data.flashSale.length > 0 && (
        <div className="ref-container ref-section" style={{ paddingTop: 0 }}>
          <div className="ref-section-header">
            <h2 className="ref-section-title">⚡ Flash Sales & Trending</h2>
            <Link to="/shop?sort=featured" className="ref-see-all">View All <ArrowRight size={14} /></Link>
          </div>
          <ProductRow products={data.flashSale} />
        </div>
      )}

      {/* ══════════════════════════════════════════
          MID-PAGE PROMO BANNER
      ══════════════════════════════════════════ */}
      <div className="ref-container">
        <div className="ref-promo-banner">
          <div className="ref-promo-text">
            <h2>Furnish Your Home, Stress-Free.</h2>
            <p>Enjoy up to 20% off on all Home Appliances this month. Lock in your price today with a flexible installment plan and beat inflation.</p>
          </div>
          <Link to="/shop?q=appliance" className="ref-btn ref-btn-gold">
            View Appliance Offers <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          NEW ARRIVALS
      ══════════════════════════════════════════ */}
      {data.newArrivals.length > 0 && (
        <div className="ref-container ref-section" style={{ paddingTop: 0 }}>
          <div className="ref-section-header">
            <h2 className="ref-section-title">New Arrivals</h2>
            <Link to="/shop" className="ref-see-all">View All <ArrowRight size={14} /></Link>
          </div>
          <ProductRow products={data.newArrivals} />
        </div>
      )}

      {/* ══════════════════════════════════════════
          TRUST STRIP
      ══════════════════════════════════════════ */}
      <div className="ref-container">
        <div className="ref-trust-strip">
          {[
            { icon: <ShoppingCart size={28} />, label: 'Buy Now, Pay Later', sub: 'Klump BNPL integration' },
            { icon: <ShieldCheck size={28} />, label: '100% Genuine Products', sub: 'Verified & certified' },
            { icon: <Truck size={28} />, label: 'Nationwide Delivery', sub: 'Fast & reliable shipping' },
            { icon: <CreditCard size={28} />, label: 'Secure Payments', sub: 'SSL encrypted checkout' },
          ].map(item => (
            <div key={item.label} className="ref-trust-item">
              <div className="ref-trust-icon">{item.icon}</div>
              <div>
                <div className="ref-trust-label">{item.label}</div>
                <div className="ref-trust-sub">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          NEWSLETTER
      ══════════════════════════════════════════ */}
      <div className="ref-container ref-section">
        <section className="ref-newsletter-section" aria-label="Newsletter">
          <div className="ref-newsletter-inner">
            <div>
              <h2 className="ref-newsletter-title">Get <span>Exclusive Deals</span> First</h2>
              <p className="ref-newsletter-sub">Subscribe and be the first to know about flash sales, new arrivals and installment offers.</p>
            </div>
            <form
              className="ref-newsletter-form"
              onSubmit={e => { e.preventDefault(); showToast('Subscribed! 🎉'); setEmail(''); }}
            >
              <input
                type="email"
                className="ref-newsletter-input"
                placeholder="Enter your email address..."
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="ref-newsletter-btn">Subscribe</button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ── GET PRODUCT ICON ─────────────────────── */
const getProductIcon = (category) => {
  if (!category) return <Smartphone size={48} strokeWidth={1} color="#9A8E7A" />;
  const c = category.toLowerCase();
  if (c.includes('phone') || c.includes('tablet')) return <Smartphone size={48} strokeWidth={1} color="#9A8E7A" />;
  if (c.includes('laptop') || c.includes('computer')) return <Laptop size={48} strokeWidth={1} color="#9A8E7A" />;
  if (c.includes('tv') || c.includes('television')) return <Tv size={48} strokeWidth={1} color="#9A8E7A" />;
  if (c.includes('headphone') || c.includes('audio')) return <Headphones size={48} strokeWidth={1} color="#9A8E7A" />;
  if (c.includes('fridge') || c.includes('home')) return <Refrigerator size={48} strokeWidth={1} color="#9A8E7A" />;
  if (c.includes('gaming')) return <Gamepad2 size={48} strokeWidth={1} color="#9A8E7A" />;
  if (c.includes('camera')) return <Camera size={48} strokeWidth={1} color="#9A8E7A" />;
  if (c.includes('watch')) return <Watch size={48} strokeWidth={1} color="#9A8E7A" />;
  return <Smartphone size={48} strokeWidth={1} color="#9A8E7A" />;
};
export { getProductIcon };
