import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { X, ChevronRight, ArrowLeft, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import { productAPI } from '../services/api';
import ProductCard from '../components/common/ProductCard';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filters state from URL or defaults
  const activeCategory = searchParams.get('category') || 'All';
  const activeKeyword = searchParams.get('search') || '';
  const activeSort = searchParams.get('sort') || 'newest';
  const activeSize = searchParams.get('size') || 'All';
  const activeMaxPrice = searchParams.get('maxPrice') || '10000';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (activeCategory !== 'All') params.category = activeCategory;
        if (activeKeyword) params.keyword = activeKeyword;
        if (activeSort) params.sort = activeSort;
        if (activeSize !== 'All') params.size = activeSize;
        if (activeMaxPrice) params.maxPrice = activeMaxPrice;

        const res = await productAPI.getProducts(params);
        setProducts(res.data.products || []);
        setTotalCount(res.data.total || 0);
      } catch (err) {
        console.error('Error fetching shop products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, activeKeyword, activeSort, activeSize, activeMaxPrice]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const handleQuickAddNotice = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const categories = ['All', 'Jackets', 'Shirts', 'T-Shirts', 'Jeans', 'Accessories'];
  const sizes = ['All', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="container-fluid px-lg-5 px-3 py-4">
      {/* Toast Notice */}
      {toastMessage && (
        <div
          className="position-fixed bottom-0 end-0 m-4 p-3 bg-dark text-white rounded-1 shadow-lg d-flex align-items-center gap-2"
          style={{ zIndex: 1100, border: '1px solid var(--color-border)' }}
        >
          <CheckCircle2 size={18} className="text-success" />
          <span className="small">{toastMessage}</span>
        </div>
      )}

      {/* Back button & Breadcrumb */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-retro-light btn-sm d-inline-flex align-items-center gap-1 py-1 px-3"
          title="Back to previous page"
        >
          <ArrowLeft size={15} /> Back
        </button>
        <nav className="breadcrumb-retro mb-0 ms-2">
          <Link to="/">Home</Link>
          <ChevronRight size={13} />
          <Link to="/shop">Shop</Link>
          {activeCategory !== 'All' && (
            <>
              <ChevronRight size={13} />
              <span className="text-dark fw-bold">{activeCategory}</span>
            </>
          )}
        </nav>
      </div>

      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 pb-3 border-bottom">
        <div>
          <h1 className="display-6 fw-bold text-dark mb-1">
            {activeCategory === 'All' ? 'ALL ARCHIVAL MENSWEAR' : activeCategory.toUpperCase()}
          </h1>
          <p className="text-muted small mb-0">
            {activeKeyword
              ? `Showing results for "${activeKeyword}"`
              : 'Vintage workwear, tailoring, and selvedge craftsmanship crafted for everyday durability.'}
          </p>
        </div>

        {/* Sort and Mobile Filter Trigger */}
        <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">
          <button
            className="btn btn-retro-light btn-sm d-lg-none d-flex align-items-center gap-2"
            onClick={() => setIsMobileFilterOpen(true)}
          >
            <SlidersHorizontal size={14} /> Filters
          </button>

          <div className="d-flex align-items-center gap-2">
            <span className="small text-muted text-nowrap" style={{ fontSize: '12px' }}>
              SORT BY:
            </span>
            <select
              className="form-select form-select-sm bg-white border"
              value={activeSort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              style={{ minWidth: '160px', fontSize: '13px', borderRadius: '2px' }}
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Desktop Filter Sidebar */}
        <div className="col-lg-3 d-none d-lg-block">
          <div className="p-3 bg-white border rounded-1 sticky-top" style={{ top: '90px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <span className="fw-bold small font-editorial">FILTERS</span>
              {(activeCategory !== 'All' || activeSize !== 'All' || activeKeyword || activeMaxPrice !== '10000') && (
                <button
                  className="btn btn-link btn-sm text-muted p-0 text-decoration-none small"
                  onClick={clearAllFilters}
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="mb-4">
              <div className="small fw-bold text-muted mb-2 font-editorial" style={{ fontSize: '11px' }}>
                CATEGORIES
              </div>
              <div className="d-flex flex-column gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`btn btn-sm text-start py-1 px-2 border-0 ${
                      activeCategory === cat ? 'bg-dark text-white fw-bold' : 'text-dark'
                    }`}
                    style={{ borderRadius: '2px', fontSize: '13px' }}
                    onClick={() => updateFilter('category', cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="mb-4 border-top pt-3">
              <div className="small fw-bold text-muted mb-2 font-editorial" style={{ fontSize: '11px' }}>
                SIZE
              </div>
              <div className="d-flex flex-wrap gap-1">
                {sizes.map((s) => (
                  <button
                    key={s}
                    className={`btn btn-sm ${
                      activeSize === s ? 'btn-dark' : 'btn-outline-secondary'
                    }`}
                    style={{ minWidth: '38px', borderRadius: '2px', fontSize: '12px' }}
                    onClick={() => updateFilter('size', s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="border-top pt-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small fw-bold text-muted font-editorial" style={{ fontSize: '11px' }}>
                  MAX PRICE
                </span>
                <span className="small fw-bold">₹{Number(activeMaxPrice).toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                className="form-range"
                min="1000"
                max="10000"
                step="500"
                value={activeMaxPrice}
                onChange={(e) => updateFilter('maxPrice', e.target.value)}
              />
              <div className="d-flex justify-content-between text-muted" style={{ fontSize: '11px' }}>
                <span>₹1,000</span>
                <span>₹10,000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted small">
              Showing <strong>{products.length}</strong> of <strong>{totalCount}</strong> pieces
            </span>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-dark" role="status"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-5 bg-white border p-5">
              <h4 className="fw-bold mb-2">No Products Match Your Filter</h4>
              <p className="text-muted small mb-4">
                Try loosening your filters or searching for another keyword.
              </p>
              <button className="btn btn-retro-dark" onClick={clearAllFilters}>
                RESET ALL FILTERS
              </button>
            </div>
          ) : (
            <div className="row g-3 g-md-4">
              {products.map((product) => (
                <div key={product._id} className="col-6 col-md-4">
                  <ProductCard
                    product={product}
                    onQuickAddNotice={handleQuickAddNotice}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Offcanvas */}
      {isMobileFilterOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-lg-none"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1090 }}
          onClick={() => setIsMobileFilterOpen(false)}
        >
          <div
            className="bg-white h-100 p-4 ms-auto"
            style={{ width: '85%', maxWidth: '340px', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4">
              <span className="fw-bold font-editorial">FILTERS</span>
              <button
                className="btn btn-sm p-1 border-0"
                onClick={() => setIsMobileFilterOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Category */}
            <div className="mb-4">
              <div className="small fw-bold text-muted mb-2 font-editorial">CATEGORIES</div>
              <div className="d-flex flex-column gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`btn btn-sm text-start py-2 px-3 border-0 ${
                      activeCategory === cat ? 'bg-dark text-white fw-bold' : 'text-dark'
                    }`}
                    onClick={() => {
                      updateFilter('category', cat);
                      setIsMobileFilterOpen(false);
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Size */}
            <div className="mb-4 border-top pt-3">
              <div className="small fw-bold text-muted mb-2 font-editorial">SIZE</div>
              <div className="d-flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    className={`btn btn-sm ${
                      activeSize === s ? 'btn-dark' : 'btn-outline-secondary'
                    }`}
                    style={{ minWidth: '42px' }}
                    onClick={() => {
                      updateFilter('size', s);
                      setIsMobileFilterOpen(false);
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Price */}
            <div className="border-top pt-3 mb-4">
              <div className="d-flex justify-content-between mb-2">
                <span className="small fw-bold text-muted font-editorial">MAX PRICE</span>
                <span className="small fw-bold">₹{Number(activeMaxPrice).toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                className="form-range"
                min="1000"
                max="10000"
                step="500"
                value={activeMaxPrice}
                onChange={(e) => updateFilter('maxPrice', e.target.value)}
              />
            </div>

            <div className="d-grid gap-2">
              <button
                className="btn btn-retro-dark py-2"
                onClick={() => setIsMobileFilterOpen(false)}
              >
                APPLY FILTERS
              </button>
              <button
                className="btn btn-outline-secondary py-2 btn-sm"
                onClick={() => {
                  clearAllFilters();
                  setIsMobileFilterOpen(false);
                }}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
