import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product, onQuickAddNotice }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return null;

  const imagesList = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80'];

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const isFavorited = isInWishlist(product._id);

  const handleQuickAdd = (e, size) => {
    e.preventDefault();
    e.stopPropagation();
    const result = addToCart(product, size, product.colors?.[0] || 'Standard', 1);
    if (onQuickAddNotice) {
      onQuickAddNotice(result.message);
    }
  };

  const handlePrevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="product-card">
      <div className="product-image-wrapper position-relative">
        <Link to={`/product/${product.slug || product._id}`} className="d-block w-100 h-100">
          <img
            src={imagesList[currentImageIndex] || imagesList[0]}
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
        </Link>

        {/* Card Slider Arrows */}
        {imagesList.length > 1 && (
          <>
            <button
              type="button"
              className="position-absolute start-0 top-50 translate-middle-y ms-1 btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center p-0"
              style={{ width: '28px', height: '28px', zIndex: 3, opacity: 0.85 }}
              onClick={handlePrevImage}
              title="Previous image"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              className="position-absolute end-0 top-50 translate-middle-y me-1 btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center p-0"
              style={{ width: '28px', height: '28px', zIndex: 3, opacity: 0.85 }}
              onClick={handleNextImage}
              title="Next image"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {discountPercent && (
          <span className="badge-discount">-{discountPercent}%</span>
        )}

        <button
          className={`btn-wishlist ${isFavorited ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={15} fill={isFavorited ? '#B71C1C' : 'none'} />
        </button>

        {/* Quick Size selection bar */}
        <div className="quick-size-bar">
          <span className="small text-muted me-1 align-self-center" style={{ fontSize: '10px' }}>
            QUICK ADD:
          </span>
          {(product.sizes || ['S', 'M', 'L', 'XL']).map((size) => (
            <button
              key={size}
              className="quick-size-btn"
              onClick={(e) => handleQuickAdd(e, size)}
              title={`Add size ${size} to bag`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="product-info">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span className="product-category-meta">{product.category}</span>
          {product.rating && (
            <span className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '11px' }}>
              <Star size={11} fill="#171717" color="#171717" />
              <span>{product.rating}</span>
            </span>
          )}
        </div>

        <Link to={`/product/${product.slug || product._id}`} className="text-decoration-none">
          <h3 className="product-title">{product.name}</h3>
        </Link>

        <div className="price-row">
          <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
          {product.originalPrice > product.price && (
            <span className="product-original-price">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
