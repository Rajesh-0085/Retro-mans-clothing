import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/common/ProductCard';

const WishlistPage = () => {
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  return (
    <div className="container-fluid px-lg-5 px-3 py-4" style={{ minHeight: '70vh' }}>
      <div className="mb-3">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-retro-light btn-sm d-inline-flex align-items-center gap-1 py-1 px-3"
          title="Back to previous page"
        >
          <ArrowLeft size={15} /> Back
        </button>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <div>
          <h1 className="display-6 fw-bold text-dark mb-1">SAVED ARCHIVE PIECES</h1>
          <p className="text-muted small mb-0">
            {wishlist.length} item{wishlist.length === 1 ? '' : 's'} bookmarked in your personal wishlist.
          </p>
        </div>
        <Link to="/shop" className="btn btn-retro-outline btn-sm">
          Browse Catalog
        </Link>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-5 bg-white border p-5 rounded-1">
          <Heart size={48} className="text-muted mb-3" />
          <h3 className="fw-bold mb-2">Your Wishlist is Empty</h3>
          <p className="text-muted small mb-4">
            Click the heart icon on any product card or details page to bookmark items for later.
          </p>
          <Link to="/shop" className="btn btn-retro-dark">
            EXPLORE COLLECTION <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="row g-3 g-md-4">
          {wishlist.map((product) => (
            <div key={product._id} className="col-6 col-md-4 col-lg-3">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
