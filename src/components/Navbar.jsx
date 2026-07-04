import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, Heart, ShoppingCart, ShieldCheck,
  Menu, X, Smartphone, Laptop, Tv, Gamepad2, Home as HomeIcon, LayoutGrid,
  ChevronDown, User
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../pages/Home';
import { listenToCategories } from '../utils/catalogService';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, cartCount, cartTotal, wishlist } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [departments, setDepartments] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => { setDrawerOpen(false); setSearchOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 100);
  }, [searchOpen]);

  useEffect(() => {
    const unsub = listenToCategories(cats => {
      const tree = {};
      cats.forEach(c => {
        const dept = c.department || c.name;
        if (!tree[dept]) tree[dept] = true;
      });
      setDepartments(Object.keys(tree).slice(0, 5));
    });
    return () => unsub();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const getDeptIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('phone') || n.includes('wearable')) return <Smartphone size={16} />;
    if (n.includes('comput') || n.includes('laptop')) return <Laptop size={16} />;
    if (n.includes('tv') || n.includes('audio')) return <Tv size={16} />;
    if (n.includes('gam')) return <Gamepad2 size={16} />;
    if (n.includes('home') || n.includes('appliance')) return <HomeIcon size={16} />;
    return <LayoutGrid size={16} />;
  };

  return (
    <>
      {/* ── MAIN NAVBAR ── */}
      <header className={`mc2-header ${scrolled ? 'mc2-header--scrolled' : ''} ${isHome && !scrolled ? 'mc2-header--transparent' : ''}`}>
        <div className="mc2-nav-inner">

          {/* Logo */}
          <Link to="/" className="mc2-logo">
            <div className="mc2-logo-mark">
              <span>MC</span>
            </div>
            <div className="mc2-logo-words">
              <span className="mc2-logo-brand">MAC-CHRISTAR</span>
              <span className="mc2-logo-sub">LIMITED</span>
            </div>
          </Link>

          {/* Center Nav — desktop only */}
          <nav className="mc2-nav-links" aria-label="Primary navigation">
            <Link to="/shop" className={`mc2-nav-link ${location.pathname === '/shop' ? 'active' : ''}`}>
              Shop
            </Link>
            <Link to="/shop?sort=featured" className="mc2-nav-link">Deals</Link>
            <div className="mc2-nav-dropdown">
              <button className="mc2-nav-link mc2-nav-dropdown-btn">
                Categories <ChevronDown size={14} />
              </button>
              <div className="mc2-dropdown-panel">
                {departments.map(dept => (
                  <Link
                    key={dept}
                    to={`/shop?dept=${encodeURIComponent(dept)}`}
                    className="mc2-dropdown-item"
                  >
                    <span className="mc2-dropdown-icon">{getDeptIcon(dept)}</span>
                    {dept}
                  </Link>
                ))}
                <Link to="/shop" className="mc2-dropdown-item mc2-dropdown-all">
                  <span className="mc2-dropdown-icon"><LayoutGrid size={16} /></span>
                  Browse All
                </Link>
              </div>
            </div>
          </nav>

          {/* Right Actions */}
          <div className="mc2-nav-actions">
            <ThemeToggle />

            <button
              className="mc2-icon-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {user?.isAdmin && (
              <Link to="/admin" className="mc2-icon-btn" aria-label="Admin">
                <ShieldCheck size={20} />
              </Link>
            )}

            <Link to={user ? "/profile" : "/login"} className="mc2-icon-btn" aria-label="User Account">
              <User size={20} />
            </Link>

            {/* Cart pill */}
            <Link to="/cart" className="mc2-cart-pill" aria-label={`Cart (${cartCount} items)`}>
              <ShoppingCart size={17} />
              <span className="mc2-cart-label">{formatCurrency(cartTotal)}</span>
              {cartCount > 0 && <span className="mc2-cart-badge">{cartCount}</span>}
            </Link>

            {/* Hamburger — mobile only */}
            <button
              className="mc2-hamburger"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              aria-expanded={drawerOpen}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* ── SEARCH OVERLAY ── */}
      {searchOpen && (
        <div className="mc2-search-overlay" onClick={() => setSearchOpen(false)}>
          <div className="mc2-search-modal" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSearch} className="mc2-search-form">
              <Search size={22} className="mc2-search-icon-inner" />
              <input
                ref={searchRef}
                type="search"
                placeholder="Search phones, laptops, TVs, generators…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="mc2-search-input"
              />
              <button type="submit" className="mc2-search-go">Go</button>
            </form>
            <button className="mc2-search-close" onClick={() => setSearchOpen(false)}>
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* ── MOBILE DRAWER ── */}
      <div
        className={`mc2-drawer-backdrop ${drawerOpen ? 'open' : ''}`}
        onClick={() => setDrawerOpen(false)}
      />
      <aside className={`mc2-drawer ${drawerOpen ? 'open' : ''}`} aria-hidden={!drawerOpen}>
        <div className="mc2-drawer-header">
          <Link to="/" className="mc2-logo" onClick={() => setDrawerOpen(false)}>
            <div className="mc2-logo-mark"><span>MC</span></div>
            <div className="mc2-logo-words">
              <span className="mc2-logo-brand">MAC-CHRISTAR</span>
            </div>
          </Link>
          <button className="mc2-icon-btn" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>

        <div className="mc2-drawer-body">
          <p className="mc2-drawer-label">Navigation</p>
          <nav className="mc2-drawer-nav">
            <Link to="/shop" className="mc2-drawer-link" onClick={() => setDrawerOpen(false)}>Shop All</Link>
            <Link to="/shop?sort=featured" className="mc2-drawer-link" onClick={() => setDrawerOpen(false)}>Deals</Link>
            {departments.map(dept => (
              <Link
                key={dept}
                to={`/shop?dept=${encodeURIComponent(dept)}`}
                className="mc2-drawer-link"
                onClick={() => setDrawerOpen(false)}
              >
                <span>{getDeptIcon(dept)}</span> {dept}
              </Link>
            ))}
          </nav>

          <p className="mc2-drawer-label">Your Account</p>
          <nav className="mc2-drawer-nav">
            <Link to="/wishlist" className="mc2-drawer-link" onClick={() => setDrawerOpen(false)}>
              <Heart size={16} /> Saved Items ({wishlist.length})
            </Link>
            <Link to="/cart" className="mc2-drawer-link mc2-drawer-cart" onClick={() => setDrawerOpen(false)}>
              <ShoppingCart size={16} /> Cart · {formatCurrency(cartTotal)} ({cartCount})
            </Link>
            {user?.isAdmin && (
              <Link to="/admin" className="mc2-drawer-link" onClick={() => setDrawerOpen(false)}>
                <ShieldCheck size={16} /> Admin Panel
              </Link>
            )}

            <Link to={user ? "/profile" : "/login"} className="mc2-drawer-link" onClick={() => setDrawerOpen(false)}>
              <User size={16} /> {user ? "My Account" : "Login / Register"}
            </Link>
          </nav>
        </div>
      </aside>
    </>
  );
}
