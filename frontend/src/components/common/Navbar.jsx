import React, { useState } from 'react';
import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, Shield, LogOut, Package, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import SearchModal from './SearchModal';

const Navbar = () => {
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const currentCategory = location.pathname === '/shop' ? (searchParams.get('category') || 'All') : null;

  const categories = [
    { name: 'New Arrivals', category: 'All', path: '/shop?category=All' },
    { name: 'Shirts', category: 'Shirts', path: '/shop?category=Shirts' },
    { name: 'T-Shirts', category: 'T-Shirts', path: '/shop?category=T-Shirts' },
    { name: 'Jeans', category: 'Jeans', path: '/shop?category=Jeans' },
    { name: 'Jackets', category: 'Jackets', path: '/shop?category=Jackets' },
    { name: 'Accessories', category: 'Accessories', path: '/shop?category=Accessories' },
  ];

  return (
    <>
      <header className="main-header">
        <div className="container-fluid px-lg-5 px-3">
          <div className="d-flex align-items-center justify-content-between">
            {/* Left: Mobile hamburger & Desktop Nav */}
            <div className="d-flex align-items-center">
              <button
                className="icon-btn d-lg-none me-2"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>

              <nav className="d-none d-lg-flex align-items-center gap-1">
                {categories.map((cat) => {
                  const isCatActive = location.pathname === '/shop' && currentCategory === cat.category;
                  return (
                    <Link
                      key={cat.name}
                      to={cat.path}
                      className={`nav-link-retro ${isCatActive ? 'active' : ''}`}
                    >
                      {cat.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Center: Brand Logo */}
            <div className="text-center">
              <Link to="/" className="d-inline-block text-decoration-none">
                <span className="brand-logo">RETRO</span>
                <span className="brand-sublogo">MEN'S CLOTHING</span>
              </Link>
            </div>

            {/* Right: Actions */}
            <div className="d-flex align-items-center gap-1 gap-md-2">
              {/* Search button */}
              <button
                className="icon-btn"
                onClick={() => setIsSearchOpen(true)}
                title="Search Products"
              >
                <Search size={20} />
              </button>

              {/* Wishlist button */}
              <Link to="/wishlist" className="icon-btn" title="Wishlist">
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="badge-counter">{wishlistCount}</span>
                )}
              </Link>

              {/* Account Dropdown */}
              <div className="position-relative">
                <button
                  className="icon-btn"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  title="Account"
                >
                  <User size={20} />
                </button>

                {isUserDropdownOpen && (
                  <div
                    className="position-absolute end-0 mt-2 bg-white shadow-lg py-2 rounded-1 border"
                    style={{
                      width: '220px',
                      zIndex: 1050,
                      borderColor: 'var(--color-border)',
                    }}
                    onMouseLeave={() => setIsUserDropdownOpen(false)}
                  >
                    {isAuthenticated ? (
                      <>
                        <div className="px-3 py-2 border-bottom">
                          <div className="small fw-bold text-truncate">{user?.name}</div>
                          <div className="text-muted small text-truncate">{user?.email}</div>
                          {isAdmin && (
                            <span className="badge bg-dark mt-1 text-uppercase" style={{ fontSize: '9px' }}>
                              Store Admin
                            </span>
                          )}
                        </div>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="dropdown-item py-2 px-3 d-flex align-items-center gap-2 small"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <Shield size={16} /> Admin Dashboard
                          </Link>
                        )}
                        <Link
                          to="/my-orders"
                          className="dropdown-item py-2 px-3 d-flex align-items-center gap-2 small"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <Package size={16} /> My Orders
                        </Link>
                        <div className="dropdown-divider my-1"></div>
                        <button
                          className="dropdown-item py-2 px-3 d-flex align-items-center gap-2 small text-danger"
                          onClick={() => {
                            logout();
                            setIsUserDropdownOpen(false);
                            navigate('/');
                          }}
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="p-3">
                          <p className="small text-muted mb-2">Sign in to track orders & manage your archive.</p>
                          <Link
                            to="/login"
                            className="btn btn-retro-dark btn-sm w-100 mb-2 py-2"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            Sign In
                          </Link>
                          <Link
                            to="/register"
                            className="btn btn-retro-outline btn-sm w-100 py-2"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            Create Account
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Shopping Bag */}
              <Link to="/cart" className="icon-btn" title="Shopping Bag">
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="badge-counter">{itemCount}</span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1080,
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="bg-white h-100 p-4 d-flex flex-direction-column justify-content-between"
            style={{
              width: '85%',
              maxWidth: '340px',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4">
                <div>
                  <span className="brand-logo" style={{ fontSize: '20px' }}>RETRO</span>
                  <span className="brand-sublogo">MEN'S CLOTHING</span>
                </div>
                <button
                  className="btn btn-sm p-1 border-0"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X size={22} />
                </button>
              </div>

              <div className="mb-4">
                <div className="text-muted-retro small fw-bold mb-3 font-editorial">
                  CATEGORIES
                </div>
                <div className="d-flex flex-column gap-2">
                  {categories.map((cat) => {
                    const isCatActive = location.pathname === '/shop' && currentCategory === cat.category;
                    return (
                      <Link
                        key={cat.name}
                        to={cat.path}
                        className={`d-flex justify-content-between align-items-center py-2 text-decoration-none ${
                          isCatActive ? 'text-dark fw-bold' : 'text-dark fw-normal'
                        }`}
                        style={{ fontSize: '15px' }}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span>{cat.name}</span>
                        <ChevronRight size={16} className={isCatActive ? 'text-dark' : 'text-muted'} />
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="border-top pt-3 mb-4">
                <div className="text-muted-retro small fw-bold mb-3 font-editorial">
                  EXPLORE
                </div>
                <div className="d-flex flex-column gap-2">
                  <Link
                    to="/about"
                    className="text-dark text-decoration-none py-1 small"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About Us & Craftsmanship
                  </Link>
                  <Link
                    to="/contact"
                    className="text-dark text-decoration-none py-1 small"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Customer Care & Contact
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="text-danger text-decoration-none py-1 small fw-bold d-flex align-items-center gap-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Shield size={14} /> Admin Portal
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <div className="border-top pt-3">
              {isAuthenticated ? (
                <div className="d-flex flex-column gap-2">
                  <div className="small fw-bold">{user?.name}</div>
                  <Link
                    to="/my-orders"
                    className="btn btn-retro-light btn-sm text-start"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    className="btn btn-sm btn-outline-danger text-start"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="d-grid gap-2">
                  <Link
                    to="/login"
                    className="btn btn-retro-dark btn-sm py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-retro-outline btn-sm py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Navbar;
