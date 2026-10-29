import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/common/ProductCard';

const ProductDetailPage = () => {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setSizeError(false);
      setSelectedSize('');
      try {
        const res = await productAPI.getProductById(idOrSlug);
        setProduct(res.data.product);
        setRelatedProducts(res.data.relatedProducts || []);
        if (res.data.product?.colors?.length > 0) {
          setSelectedColor(res.data.product.colors[0]);
        }
      } catch (err) {
        console.error('Error fetching product detail', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-dark" role="status"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h2>Product Not Found</h2>
        <p className="text-muted">The requested menswear item does not exist or has been removed.</p>
        <Link to="/shop" className="btn btn-retro-dark">
          Back to Shop
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product._id);
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }

    setSizeError(false);
    const res = addToCart(product, selectedSize, selectedColor, quantity);
    setToastMessage(res.message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }

    addToCart(product, selectedSize, selectedColor, quantity);
    navigate('/checkout');
  };

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

      {/* Back button & Breadcrumbs */}
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
          <ChevronRight size={13} />
          <Link to={`/shop?category=${product.category}`}>{product.category}</Link>
          <ChevronRight size={13} />
          <span className="text-dark fw-bold text-truncate">{product.name}</span>
        </nav>
      </div>

      {/* Main PDP Grid */}
      <div className="row g-4 g-lg-5 mb-5">
        {/* Left: Gallery */}
        <div className="col-lg-7">
          <div className="row g-2">
            {/* Thumbnails list on desktop */}
            <div className="col-2 d-none d-md-flex flex-column gap-2">
              {(product.images || []).map((img, idx) => (
                <div
                  key={idx}
                  className={`border overflow-hidden cursor-pointer ${
                    selectedImageIndex === idx ? 'border-dark border-2' : 'border-secondary'
                  }`}
                  style={{ aspectRatio: '3/4', cursor: 'pointer' }}
                  onClick={() => setSelectedImageIndex(idx)}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
              ))}
            </div>

            {/* Main Image with Prev/Next slider arrows */}
            <div className="col-12 col-md-10">
              <div
                className="position-relative overflow-hidden bg-light border"
                style={{ aspectRatio: '3/4' }}
              >
                <img
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-100 h-100 object-fit-cover"
                />

                {/* Slider Arrow: Previous */}
                {product.images?.length > 1 && (
                  <button
                    type="button"
                    className="position-absolute start-0 top-50 translate-middle-y ms-2 btn btn-light rounded-circle shadow d-flex align-items-center justify-content-center p-0"
                    style={{ width: '42px', height: '42px', zIndex: 10, opacity: 0.92, border: '1px solid var(--color-border)' }}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
                    }}
                    title="Previous image"
                  >
                    <ChevronLeft size={24} className="text-dark" />
                  </button>
                )}

                {/* Slider Arrow: Next */}
                {product.images?.length > 1 && (
                  <button
                    type="button"
                    className="position-absolute end-0 top-50 translate-middle-y me-2 btn btn-light rounded-circle shadow d-flex align-items-center justify-content-center p-0"
                    style={{ width: '42px', height: '42px', zIndex: 10, opacity: 0.92, border: '1px solid var(--color-border)' }}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
                    }}
                    title="Next image"
                  >
                    <ChevronRight size={24} className="text-dark" />
                  </button>
                )}

                {/* Photo indicator count */}
                {product.images?.length > 1 && (
                  <span
                    className="position-absolute bottom-0 start-50 translate-middle-x mb-3 badge bg-dark text-white px-2 py-1 shadow-sm opacity-75"
                    style={{ fontSize: '11px', zIndex: 9 }}
                  >
                    {selectedImageIndex + 1} / {product.images.length}
                  </span>
                )}

                {discountPercent && (
                  <span className="badge-discount fs-6 px-3 py-2">
                    -{discountPercent}% OFF
                  </span>
                )}

                <button
                  className={`btn-wishlist ${isFavorited ? 'active' : ''}`}
                  style={{ top: '16px', right: '16px', width: '42px', height: '42px' }}
                  onClick={() => toggleWishlist(product)}
                >
                  <Heart size={20} fill={isFavorited ? '#B71C1C' : 'none'} />
                </button>
              </div>

              {/* Mobile Thumbnails horizontal */}
              <div className="d-flex d-md-none gap-2 mt-2 overflow-x-auto pb-1">
                {(product.images || []).map((img, idx) => (
                  <div
                    key={idx}
                    className={`border overflow-hidden flex-shrink-0 ${
                      selectedImageIndex === idx ? 'border-dark border-2' : ''
                    }`}
                    style={{ width: '64px', height: '80px', cursor: 'pointer' }}
                    onClick={() => setSelectedImageIndex(idx)}
                  >
                    <img src={img} alt="thumb" className="w-100 h-100 object-fit-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="col-lg-5">
          <div className="ps-lg-2">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="product-category-meta">{product.category}</span>
              <div className="d-flex align-items-center gap-1 small">
                <Star size={14} fill="#171717" color="#171717" />
                <span className="fw-bold">{product.rating || '4.8'}</span>
                <span className="text-muted">({product.numReviews || 36} reviews)</span>
              </div>
            </div>

            <h1 className="h2 fw-bold text-dark mb-3">{product.name}</h1>

            {/* Price section */}
            <div className="d-flex align-items-baseline gap-3 mb-4 pb-3 border-bottom">
              <span className="fs-3 fw-bold text-dark">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-muted text-decoration-line-through fs-5">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="badge bg-danger-subtle text-danger fw-semibold px-2 py-1">
                    Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                  </span>
                </>
              )}
            </div>

            {/* Size Selector */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small fw-bold font-editorial">
                  SELECT SIZE <span className="text-danger">*</span>
                </span>
                <button
                  type="button"
                  className="btn btn-link p-0 text-muted small text-decoration-underline"
                  onClick={() => setShowSizeGuide(true)}
                >
                  Size Guide & Measurements
                </button>
              </div>

              <div className="d-flex flex-wrap gap-2">
                {(product.sizes || ['S', 'M', 'L', 'XL', 'XXL']).map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`size-pill ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedSize(size);
                      setSizeError(false);
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {sizeError && (
                <div className="d-flex align-items-center gap-1 text-danger small mt-2">
                  <AlertCircle size={15} />
                  <span>Please choose your size before continuing.</span>
                </div>
              )}
            </div>

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-4">
                <div className="small fw-bold font-editorial mb-2">
                  COLOR: <span className="fw-normal text-muted">{selectedColor}</span>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`color-pill ${selectedColor === color ? 'active' : ''}`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Stock */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small fw-bold font-editorial">QUANTITY</span>
                <span className="small text-muted">
                  Stock: <strong>{product.stock} units</strong> remaining
                </span>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center border bg-white rounded-1">
                  <button
                    className="btn btn-sm p-2 border-0"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-3 fw-bold small">{quantity}</span>
                  <button
                    className="btn btn-sm p-2 border-0"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-grid gap-2 mb-4">
              <button
                type="button"
                className="btn btn-retro-dark py-3 fs-6"
                onClick={handleAddToCart}
              >
                ADD TO SHOPPING BAG
              </button>
              <button
                type="button"
                className="btn btn-retro-outline py-3 fs-6"
                onClick={handleBuyNow}
              >
                BUY NOW WITH COD
              </button>
            </div>

            {/* Trust highlights */}
            <div className="p-3 bg-white border rounded-1 mb-4">
              <div className="d-flex align-items-center gap-3 mb-2">
                <Truck size={18} className="text-dark" />
                <span className="small">Complimentary delivery across India on orders &gt; ₹2,999</span>
              </div>
              <div className="d-flex align-items-center gap-3 mb-2">
                <RotateCcw size={18} className="text-dark" />
                <span className="small">15-day complimentary exchange & returns</span>
              </div>
              <div className="d-flex align-items-center gap-3">
                <ShieldCheck size={18} className="text-dark" />
                <span className="small">100% Guaranteed authentic archival craftsmanship</span>
              </div>
            </div>

            {/* Accordion Description & Details */}
            <div className="accordion accordion-flush border-top" id="productAccordion">
              <div className="accordion-item bg-transparent">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button bg-transparent fw-bold small font-editorial px-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#descCollapse"
                  >
                    PRODUCT OVERVIEW & FABRICATION
                  </button>
                </h2>
                <div id="descCollapse" className="accordion-collapse collapse show">
                  <div className="accordion-body px-0 text-muted small">
                    {product.description}
                  </div>
                </div>
              </div>

              <div className="accordion-item bg-transparent">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed bg-transparent fw-bold small font-editorial px-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#fitCollapse"
                  >
                    FIT, CUT & SIZING NOTES
                  </button>
                </h2>
                <div id="fitCollapse" className="accordion-collapse collapse">
                  <div className="accordion-body px-0 text-muted small">
                    Model is 6'1" / 185 cm, chest 38 inches, wearing size L. Relaxed vintage drape through the body with natural drop shoulder styling. We suggest selecting your normal size for an authentic casual fit, or sizing down for a fitted tailored silhouette.
                  </div>
                </div>
              </div>

              <div className="accordion-item bg-transparent">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed bg-transparent fw-bold small font-editorial px-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#shipCollapse"
                  >
                    SHIPPING, COD & RETURNS
                  </button>
                </h2>
                <div id="shipCollapse" className="accordion-collapse collapse">
                  <div className="accordion-body px-0 text-muted small">
                    Dispatched within 24 hours. Estimated delivery 2-4 business days via express air cargo. Cash on delivery available across all Indian PIN codes.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-5 border-top">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <span className="font-editorial text-muted-retro small">COMPLETE THE LOOK</span>
              <h3 className="fw-bold">YOU MAY ALSO LIKE</h3>
            </div>
            <Link to="/shop" className="btn btn-retro-outline btn-sm">
              View All
            </Link>
          </div>

          <div className="row g-3 g-md-4">
            {relatedProducts.map((rel) => (
              <div key={rel._id} className="col-6 col-md-3">
                <ProductCard product={rel} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1100 }}
          onClick={() => setShowSizeGuide(false)}
        >
          <div
            className="bg-white p-4 rounded-1 border shadow-lg"
            style={{ maxWidth: '520px', width: '90%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <span className="fw-bold font-editorial">MENSWEAR SIZE GUIDE (INCHES)</span>
              <button
                className="btn btn-sm border-0 p-1"
                onClick={() => setShowSizeGuide(false)}
              >
                ✕
              </button>
            </div>
            <div className="table-responsive mb-3">
              <table className="table table-bordered text-center small">
                <thead className="table-light">
                  <tr>
                    <th>Size</th>
                    <th>Chest</th>
                    <th>Shoulder</th>
                    <th>Length</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="fw-bold">S</td>
                    <td>38"</td>
                    <td>17.5"</td>
                    <td>27"</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">M</td>
                    <td>40"</td>
                    <td>18.0"</td>
                    <td>28"</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">L</td>
                    <td>42"</td>
                    <td>18.5"</td>
                    <td>29"</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">XL</td>
                    <td>44"</td>
                    <td>19.2"</td>
                    <td>30"</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">XXL</td>
                    <td>46"</td>
                    <td>20.0"</td>
                    <td>31"</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-muted small mb-0">
              Measurements taken with garment laid flat. For loose relaxed vintage fit, order your usual size.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
