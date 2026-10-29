import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const {
    cartItems,
    subtotal,
    shippingCharge,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    total,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '60vh' }}>
        <div className="p-5 bg-white border rounded-1 d-inline-block shadow-sm my-5" style={{ maxWidth: '480px' }}>
          <ShoppingBag size={52} className="text-muted mb-3" />
          <h2 className="fw-bold mb-2 font-editorial" style={{ fontSize: '20px' }}>
            YOUR SHOPPING BAG IS EMPTY
          </h2>
          <p className="text-muted small mb-4">
            Your archival bag awaits. Discover our latest vintage selvedge drops, heavyweight tees, and outerwear.
          </p>
          <Link to="/shop" className="btn btn-retro-dark py-3 px-4 w-100">
            EXPLORE THE COLLECTION <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="container-fluid px-lg-5 px-3 py-4">
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
          <h1 className="display-6 fw-bold text-dark mb-1">SHOPPING BAG</h1>
          <span className="text-muted small">
            {cartItems.reduce((acc, i) => acc + i.quantity, 0)} items in your cart
          </span>
        </div>
        <button
          className="btn btn-link text-muted small text-decoration-none"
          onClick={clearCart}
        >
          Clear Entire Bag
        </button>
      </div>

      {/* Free shipping progress bar */}
      <div className="p-3 bg-white border rounded-1 mb-4">
        <div className="d-flex align-items-center justify-content-between mb-2 small">
          <span className="d-flex align-items-center gap-2 fw-semibold">
            <Truck size={16} className="text-dark" />
            {amountNeededForFreeShipping > 0
              ? `Add ₹${amountNeededForFreeShipping.toLocaleString('en-IN')} more to unlock Complimentary Delivery`
              : 'You have unlocked Complimentary Express Delivery!'}
          </span>
          <span className="fw-bold text-dark">{freeShippingProgress}%</span>
        </div>
        <div className="progress" style={{ height: '6px' }}>
          <div
            className="progress-bar bg-dark"
            role="progressbar"
            style={{ width: `${freeShippingProgress}%` }}
          ></div>
        </div>
      </div>

      <div className="row g-4 g-lg-5">
        {/* Cart items list */}
        <div className="col-lg-8">
          <div className="bg-white border rounded-1 p-3 p-md-4">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light small font-editorial">
                  <tr>
                    <th scope="col" style={{ width: '45%' }}>ITEM</th>
                    <th scope="col" className="text-center">PRICE</th>
                    <th scope="col" className="text-center">QTY</th>
                    <th scope="col" className="text-end">SUBTOTAL</th>
                    <th scope="col" style={{ width: '5%' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, idx) => (
                    <tr key={`${item.product}-${item.size}-${item.color}-${idx}`} className="border-bottom">
                      <td>
                        <div className="d-flex align-items-center gap-3 py-2">
                          <Link to={`/product/${item.slug || item.product}`}>
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{ width: '70px', height: '90px', objectFit: 'cover' }}
                              className="border"
                            />
                          </Link>
                          <div>
                            <Link
                              to={`/product/${item.slug || item.product}`}
                              className="fw-bold text-dark text-decoration-none small d-block mb-1"
                            >
                              {item.name}
                            </Link>
                            <div className="text-muted small" style={{ fontSize: '12px' }}>
                              Size: <strong>{item.size}</strong> &nbsp;|&nbsp; Color: <strong>{item.color}</strong>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center small fw-semibold">
                        ₹{item.price.toLocaleString('en-IN')}
                      </td>
                      <td className="text-center">
                        <div className="d-inline-flex align-items-center border bg-white rounded-1">
                          <button
                            className="btn btn-sm p-1 px-2 border-0"
                            onClick={() => updateQuantity(item.product, item.size, item.color, item.quantity - 1)}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2 small fw-bold">{item.quantity}</span>
                          <button
                            className="btn btn-sm p-1 px-2 border-0"
                            onClick={() => updateQuantity(item.product, item.size, item.color, item.quantity + 1)}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </td>
                      <td className="text-end fw-bold small">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm text-muted p-1 border-0"
                          onClick={() => removeFromCart(item.product, item.size, item.color)}
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center pt-4">
              <Link to="/shop" className="btn btn-retro-outline btn-sm">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Order Summary sidebar */}
        <div className="col-lg-4">
          <div className="bg-white border rounded-1 p-4 sticky-top" style={{ top: '90px' }}>
            <h3 className="h5 fw-bold font-editorial mb-3 pb-2 border-bottom">
              ORDER SUMMARY
            </h3>

            <div className="d-flex justify-content-between py-2 text-muted small">
              <span>Bag Subtotal</span>
              <span className="fw-semibold text-dark">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="d-flex justify-content-between py-2 text-muted small">
              <span>Estimated Shipping</span>
              <span className="fw-semibold text-dark">
                {shippingCharge === 0 ? (
                  <span className="text-success">COMPLIMENTARY</span>
                ) : (
                  `₹${shippingCharge}`
                )}
              </span>
            </div>

            <div className="d-flex justify-content-between py-2 text-muted small">
              <span>Payment Mode</span>
              <span className="fw-semibold text-dark">Cash on Delivery (COD)</span>
            </div>

            <div className="d-flex justify-content-between py-3 border-top border-bottom my-3">
              <span className="fw-bold">Total Amount</span>
              <span className="fs-5 fw-bold text-dark">₹{total.toLocaleString('en-IN')}</span>
            </div>

            <button
              className="btn btn-retro-dark w-100 py-3 mb-3 fs-6"
              onClick={() => navigate('/checkout')}
            >
              PROCEED TO CHECKOUT <ArrowRight size={16} />
            </button>

            <div className="text-center text-muted small d-flex flex-column gap-2 pt-2">
              <div className="d-flex align-items-center justify-content-center gap-1">
                <ShieldCheck size={16} className="text-success" />
                <span>Safe & Encrypted Checkout</span>
              </div>
              <span>Pay with cash or UPI upon delivery at your doorstep.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
