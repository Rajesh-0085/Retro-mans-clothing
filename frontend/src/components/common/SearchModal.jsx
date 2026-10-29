import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { productAPI } from '../../services/api';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleClose = () => {
    setSearchTerm('');
    setResults([]);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchTerm.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await productAPI.getProducts({ keyword: searchTerm.trim(), limit: 5 });
        setResults(res.data.products || []);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-start justify-content-center"
      style={{
        backgroundColor: 'rgba(23, 23, 23, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1060,
        paddingTop: '80px',
      }}
      onClick={handleClose}
    >
      <div
        className="bg-white p-4 shadow-lg w-100"
        style={{
          maxWidth: '680px',
          borderRadius: '4px',
          border: '1px solid var(--color-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="font-editorial text-muted-retro" style={{ fontSize: '11px' }}>
            SEARCH THE ARCHIVE
          </span>
          <button className="btn btn-sm p-1 border-0" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="position-relative mb-3">
          <Search
            size={18}
            className="position-absolute text-muted"
            style={{ left: '14px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            ref={inputRef}
            type="text"
            className="retro-input ps-5 pe-5 py-3"
            placeholder="Search jacket, selvedge denim, oxford shirt..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="position-absolute border-0 bg-transparent"
              style={{ right: '14px', top: '50%', transform: 'translateY(-50%)' }}
              onClick={() => setSearchTerm('')}
            >
              <X size={16} className="text-muted" />
            </button>
          )}
        </form>

        {loading && (
          <div className="text-center py-4 text-muted small">
            Searching products...
          </div>
        )}

        {!loading && results.length > 0 && (
          <div>
            <div className="text-muted-retro small mb-2 fw-semibold">
              RESULTS ({results.length})
            </div>
            <div className="list-group list-group-flush mb-3">
              {results.map((product) => (
                <div
                  key={product._id}
                  className="list-group-item list-group-item-action d-flex align-items-center gap-3 py-2 px-1 border-bottom"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    navigate(`/product/${product.slug || product._id}`);
                    onClose();
                  }}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    style={{ width: '48px', height: '60px', objectFit: 'cover' }}
                  />
                  <div className="flex-grow-1">
                    <div className="small fw-semibold text-dark">{product.name}</div>
                    <div className="text-muted small">{product.category}</div>
                  </div>
                  <div className="fw-bold small">₹{product.price.toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>
            <button
              className="btn btn-retro-dark w-100 btn-sm py-2"
              onClick={handleSubmit}
            >
              View All Results <ArrowRight size={14} className="ms-1" />
            </button>
          </div>
        )}

        {!loading && searchTerm.trim() && results.length === 0 && (
          <div className="text-center py-4 text-muted small">
            No menswear items found matching "{searchTerm}". Try searching for "denim", "shirt", or "jacket".
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
