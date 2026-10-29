import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';

const CheckoutPage = () => {
  const { cartItems, subtotal, shippingCharge, total, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h3>Your Shopping Bag is Empty</h3>
        <p className="text-muted">You cannot proceed to checkout without any garments.</p>
        <Link to="/shop" className="btn btn-retro-dark">
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.email || !formData.street || !formData.city || !formData.state || !formData.postalCode) {
      setErrorMessage('Please fill in all shipping address and contact fields.');
      return;
    }

    if (!isAuthenticated) {
      setErrorMessage('Please sign in or create an account to complete your checkout.');
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          image: item.image,
          price: item.price,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        })),
        shippingAddress: formData,
        paymentMethod: 'Cash on Delivery (COD)',
      };

      const res = await orderAPI.createOrder(orderPayload);
      clearCart();
      navigate(`/order-success/${res.data.order._id}`);
    } catch (err) {
      console.error('Checkout error', err);
      const msg = err.response?.data?.message || 'Failed to place order. Please verify your details.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid px-lg-5 px-3 py-4">
      <div className="mb-4">
        <Link to="/cart" className="text-muted small text-decoration-none d-inline-flex align-items-center gap-1">
          <ArrowLeft size={14} /> Back to Bag
        </Link>
        <h1 className="display-6 fw-bold text-dark mt-2">SECURE CHECKOUT</h1>
        <p className="text-muted small">
          Complete your delivery details. Cash on Delivery is enabled for all locations across India.
        </p>
      </div>

      {errorMessage && (
        <div className="alert alert-danger d-flex align-items-center gap-2 small mb-4" role="alert">
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-4 g-lg-5">
          {/* Left: Customer & Address Information */}
          <div className="col-lg-7">
            {/* Contact info card */}
            <div className="bg-white border rounded-1 p-4 mb-4">
              <h2 className="h5 fw-bold font-editorial mb-3 pb-2 border-bottom">
                1. CONTACT INFORMATION
              </h2>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">FULL NAME *</label>
                  <input
                    type="text"
                    name="fullName"
                    className="retro-input"
                    placeholder="e.g. Aarav Sharma"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">PHONE NUMBER *</label>
                  <input
                    type="tel"
                    name="phone"
                    className="retro-input"
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    name="email"
                    className="retro-input"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address card */}
            <div className="bg-white border rounded-1 p-4 mb-4">
              <h2 className="h5 fw-bold font-editorial mb-3 pb-2 border-bottom">
                2. SHIPPING ADDRESS (PAN INDIA)
              </h2>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label small fw-semibold">STREET ADDRESS & APARTMENT / SUITE *</label>
                  <input
                    type="text"
                    name="street"
                    className="retro-input"
                    placeholder="Flat 402, Heritage Residency, 12th Main"
                    value={formData.street}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">CITY *</label>
                  <input
                    type="text"
                    name="city"
                    className="retro-input"
                    placeholder="Bengaluru"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">STATE *</label>
                  <input
                    type="text"
                    name="state"
                    className="retro-input"
                    placeholder="Karnataka"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">PIN CODE *</label>
                  <input
                    type="text"
                    name="postalCode"
                    className="retro-input"
                    placeholder="560038"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method card */}
            <div className="bg-white border rounded-1 p-4">
              <h2 className="h5 fw-bold font-editorial mb-3 pb-2 border-bottom">
                3. PAYMENT METHOD
              </h2>
              <div className="border p-3 rounded-1 bg-light d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <input
                    type="radio"
                    id="codRadio"
                    checked
                    readOnly
                    className="form-check-input"
                  />
                  <div>
                    <label htmlFor="codRadio" className="fw-bold small d-block mb-0 cursor-pointer">
                      Cash on Delivery (COD)
                    </label>
                    <span className="text-muted" style={{ fontSize: '12px' }}>
                      Pay in cash or scan QR using UPI upon physical doorstep delivery.
                    </span>
                  </div>
                </div>
                <span className="badge bg-dark">AVAILABLE</span>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="col-lg-5">
            <div className="bg-white border rounded-1 p-4 sticky-top" style={{ top: '90px' }}>
              <h3 className="h5 fw-bold font-editorial mb-3 pb-2 border-bottom">
                ORDER REVIEW ({cartItems.length} ITEMS)
              </h3>

              <div className="d-flex flex-column gap-3 mb-4 max-vh-50 overflow-y-auto">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="d-flex align-items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '54px', height: '68px', objectFit: 'cover' }}
                      className="border flex-shrink-0"
                    />
                    <div className="flex-grow-1">
                      <div className="fw-bold small text-dark text-truncate" style={{ maxWidth: '200px' }}>
                        {item.name}
                      </div>
                      <div className="text-muted small" style={{ fontSize: '11px' }}>
                        Size: {item.size} • Qty: {item.quantity}
                      </div>
                    </div>
                    <div className="fw-bold small text-end">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-top pt-3">
                <div className="d-flex justify-content-between py-1 text-muted small">
                  <span>Bag Subtotal</span>
                  <span className="fw-semibold text-dark">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="d-flex justify-content-between py-1 text-muted small">
                  <span>Shipping Cost</span>
                  <span className="fw-semibold text-dark">
                    {shippingCharge === 0 ? (
                      <span className="text-success">COMPLIMENTARY</span>
                    ) : (
                      `₹${shippingCharge}`
                    )}
                  </span>
                </div>
                <div className="d-flex justify-content-between py-3 border-top border-bottom my-3">
                  <span className="fw-bold">Total Payable</span>
                  <span className="fs-5 fw-bold text-dark">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-retro-dark w-100 py-3 mb-3 fs-6"
                disabled={loading}
              >
                {loading ? (
                  <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                ) : null}
                {loading ? 'CONFIRMING ORDER...' : 'PLACE ORDER (CASH ON DELIVERY)'}
              </button>

              <div className="text-center text-muted small">
                <div className="d-flex align-items-center justify-content-center gap-1 mb-1">
                  <ShieldCheck size={16} className="text-success" />
                  <span>Guaranteed Safe & Verified Delivery</span>
                </div>
                <span>By placing an order, you agree to RETRO Store Terms & Policies.</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
