import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RotateCcw, CheckCircle2 } from 'lucide-react';
import { productAPI } from '../services/api';
import ProductCard from '../components/common/ProductCard';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productAPI.getProducts({ limit: 8 });
        setFeaturedProducts(res.data.products || []);
      } catch (err) {
        console.error('Error fetching homepage products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleQuickAddNotice = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const categories = ['All', 'Jackets', 'Shirts', 'Jeans', 'T-Shirts'];

  const filteredProducts =
    activeCategoryFilter === 'All'
      ? featuredProducts
      : featuredProducts.filter((p) => p.category === activeCategoryFilter);

  return (
    <div>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="position-fixed bottom-0 end-0 m-4 p-3 bg-dark text-white rounded-1 shadow-lg d-flex align-items-center gap-2"
          style={{ zIndex: 1100, border: '1px solid var(--color-border)' }}
        >
          <CheckCircle2 size={18} className="text-success" />
          <span className="small">{toastMessage}</span>
        </div>
      )}

      {/* Hero Section — Matching Figma Reference */}
      <section className="hero-section">
        <div className="container-fluid px-lg-5 px-3 py-4 py-lg-0">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-6 py-5 pe-lg-5">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="badge bg-white text-dark border px-2 py-1 font-editorial" style={{ fontSize: '10px' }}>
                  NEW DROP • ARCHIVE 2026
                </span>
                <span className="text-muted-retro small">AUTUMN / WINTER CAPSULE</span>
              </div>

              <h1 className="display-4 fw-black text-dark mb-3" style={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
                STYLE THAT LASTS: <br />
                <span style={{ color: 'var(--color-text)' }}>RETRO FASHION</span>
              </h1>

              <p className="lead text-muted-retro mb-4" style={{ fontSize: '16px', maxWidth: '500px' }}>
                Thoughtfully crafted vintage silhouettes designed with heavyweight Japanese selvedge denim, combed organic cotton, and timeless workwear craftsmanship.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <Link to="/shop" className="btn btn-retro-dark">
                  SHOP COLLECTION <ArrowRight size={16} />
                </Link>
                <Link to="/shop?category=Jackets" className="btn btn-retro-outline">
                  EXPLORE LOOKBOOK
                </Link>
              </div>

              {/* Quick Trust badges */}
              <div className="row mt-5 pt-3 border-top g-3">
                <div className="col-4">
                  <div className="fw-bold fs-5">100%</div>
                  <div className="text-muted small" style={{ fontSize: '11px' }}>Heavyweight Cotton</div>
                </div>
                <div className="col-4">
                  <div className="fw-bold fs-5">14.5oz</div>
                  <div className="text-muted small" style={{ fontSize: '11px' }}>Japanese Selvedge</div>
                </div>
                <div className="col-4">
                  <div className="fw-bold fs-5">15 Days</div>
                  <div className="text-muted small" style={{ fontSize: '11px' }}>Complimentary Returns</div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 p-0 text-center">
              <div className="position-relative overflow-hidden" style={{ maxHeight: '620px' }}>
                <img
                  src="https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=80"
                  alt="Retro Men's Fashion Editorial"
                  className="hero-editorial-img"
                />
                <div
                  className="position-absolute bottom-0 start-0 m-4 p-3 bg-white d-none d-md-block text-start border shadow-sm"
                  style={{ maxWidth: '280px', borderRadius: '2px' }}
                >
                  <div className="font-editorial text-muted-retro" style={{ fontSize: '9px' }}>
                    LOOKBOOK ITEM 01
                  </div>
                  <div className="fw-bold small text-dark">Vintage Selvedge Trucker Jacket</div>
                  <div className="text-muted small">₹3,499 • Hand-finished in Tokyo</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Strip */}
      <section className="value-strip">
        <div className="container-fluid px-lg-5 px-3">
          <div className="row g-4">
            <div className="col-md-3 col-6">
              <div className="value-item">
                <Truck size={24} className="text-dark flex-shrink-0" />
                <div>
                  <div className="fw-bold small text-dark">Free Express Shipping</div>
                  <div className="text-muted" style={{ fontSize: '12px' }}>On all orders above ₹2,999</div>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="value-item">
                <RotateCcw size={24} className="text-dark flex-shrink-0" />
                <div>
                  <div className="fw-bold small text-dark">15-Day Easy Returns</div>
                  <div className="text-muted" style={{ fontSize: '12px' }}>Doorstep pickup guaranteed</div>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="value-item">
                <ShieldCheck size={24} className="text-dark flex-shrink-0" />
                <div>
                  <div className="fw-bold small text-dark">Authentic Materials</div>
                  <div className="text-muted" style={{ fontSize: '12px' }}>Pure ring-spun & selvedge fabrics</div>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="value-item">
                <Sparkles size={24} className="text-dark flex-shrink-0" />
                <div>
                  <div className="fw-bold small text-dark">Cash on Delivery</div>
                  <div className="text-muted" style={{ fontSize: '12px' }}>Pay safely upon doorstep delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section with Category Tabs */}
      <section className="py-5 my-3">
        <div className="container-fluid px-lg-5 px-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <span className="font-editorial text-muted-retro small">CURATED CATALOG</span>
              <h2 className="fw-bold mb-1" style={{ fontSize: '28px' }}>NEW ARRIVALS</h2>
              <p className="text-muted-retro small mb-0">
                Explore our latest archival pieces engineered for comfort, texture, and durability.
              </p>
            </div>

            {/* Filter pills */}
            <div className="d-flex flex-wrap gap-2 mt-3 mt-md-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-pill ${activeCategoryFilter === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategoryFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-dark" role="status"></div>
            </div>
          ) : (
            <div className="row g-3 g-lg-4">
              {filteredProducts.map((product) => (
                <div key={product._id} className="col-6 col-md-4 col-lg-3">
                  <ProductCard
                    product={product}
                    onQuickAddNotice={handleQuickAddNotice}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-5">
            <Link to="/shop" className="btn btn-retro-outline px-5 py-3">
              VIEW COMPLETE CATALOG ({featuredProducts.length}+ ITEMS)
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Campaign Banner — "THE ARCHIVAL EDIT" */}
      <section className="py-5" style={{ backgroundColor: '#EDE8DF', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container-fluid px-lg-5 px-3">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <div className="position-relative overflow-hidden" style={{ maxHeight: '520px' }}>
                <img
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80"
                  alt="Archival Menswear Tailoring"
                  className="w-100 object-fit-cover"
                  style={{ height: '480px' }}
                />
              </div>
            </div>
            <div className="col-lg-6 ps-lg-5">
              <span className="font-editorial text-muted-retro small">LIMITED CAPSULE DROP</span>
              <h2 className="display-6 fw-bold mb-3">
                THE HERITAGE WORKWEAR & DENIM EDIT
              </h2>
              <p className="lead text-muted-retro mb-4" style={{ fontSize: '15px' }}>
                Inspired by 1950s work jackets, utility overshirts, and custom chain-stitched details. Each garment undergoes a proprietary garment wash technique to achieve soft drape without losing structural integrity.
              </p>
              <ul className="list-unstyled mb-4 text-muted small d-flex flex-column gap-2">
                <li className="d-flex align-items-center gap-2">
                  <CheckCircle2 size={16} className="text-dark" />
                  Triple-needle felled seam construction for indestructible endurance
                </li>
                <li className="d-flex align-items-center gap-2">
                  <CheckCircle2 size={16} className="text-dark" />
                  Antiqued brass hardware and genuine corozo nut button accents
                </li>
                <li className="d-flex align-items-center gap-2">
                  <CheckCircle2 size={16} className="text-dark" />
                  Individually numbered archival care tags
                </li>
              </ul>
              <Link to="/shop?category=Jackets" className="btn btn-retro-dark">
                DISCOVER THE JACKET EDIT <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category Grid */}
      <section className="py-5 my-4">
        <div className="container-fluid px-lg-5 px-3">
          <div className="text-center mb-5">
            <span className="font-editorial text-muted-retro small">SHOP BY SILHOUETTE</span>
            <h2 className="fw-bold">CURATED DEPARTMENTS</h2>
          </div>

          <div className="row g-3 g-md-4">
            {[
              {
                title: 'VINTAGE OVERSHIRTS',
                category: 'Shirts',
                image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
                count: '32 Styles',
              },
              {
                title: 'HEAVYWEIGHT TEES',
                category: 'T-Shirts',
                image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
                count: '24 Styles',
              },
              {
                title: 'RAW & WASHED DENIM',
                category: 'Jeans',
                image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
                count: '18 Styles',
              },
              {
                title: 'OUTERWEAR & BOMBERS',
                category: 'Jackets',
                image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
                count: '15 Styles',
              },
            ].map((cat) => (
              <div key={cat.title} className="col-6 col-md-3">
                <Link
                  to={`/shop?category=${cat.category}`}
                  className="d-block text-decoration-none group position-relative overflow-hidden"
                  style={{ border: '1px solid var(--color-border)', borderRadius: '2px' }}
                >
                  <div style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-100 h-100 object-fit-cover"
                      style={{ transition: 'transform 0.5s ease' }}
                    />
                  </div>
                  <div className="p-3 bg-white">
                    <div className="fw-bold small text-dark font-editorial">{cat.title}</div>
                    <div className="text-muted small" style={{ fontSize: '11px' }}>{cat.count}</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
