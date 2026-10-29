import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Package, Truck, ArrowRight, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { orderAPI } from '../services/api';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Launch celebratory confetti
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
    });

    const fetchOrder = async () => {
      try {
        const res = await orderAPI.getOrderById(id);
        setOrder(res.data.order);
      } catch (err) {
        console.error('Error fetching order receipt', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-dark" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ maxWidth: '820px' }}>
      <div className="mb-3">
        <button
          onClick={() => navigate('/shop')}
          className="btn btn-retro-light btn-sm d-inline-flex align-items-center gap-1 py-1 px-3"
          title="Back to Catalog"
        >
          <ArrowLeft size={15} /> Back to Catalog
        </button>
      </div>

      <div className="text-center mb-5">
        <div
          className="d-inline-flex align-items-center justify-content-center bg-success text-white rounded-circle mb-3"
          style={{ width: '70px', height: '70px' }}
        >
          <CheckCircle2 size={40} />
        </div>
        <span className="font-editorial text-muted-retro small d-block">
          ORDER CONFIRMATION
        </span>
        <h1 className="display-6 fw-bold text-dark mb-2">THANK YOU FOR YOUR ORDER</h1>
        <p className="text-muted small">
          Order reference: <strong className="text-dark">#{order?._id || id}</strong>
        </p>
        <p className="text-muted small">
          A confirmation dispatch email and SMS receipt have been sent to{' '}
          <strong>{order?.shippingAddress?.email || 'your email'}</strong>.
        </p>
      </div>

      <div className="bg-white border rounded-1 p-4 mb-4 shadow-sm">
        <div className="row g-4 border-bottom pb-4 mb-4">
          <div className="col-md-4">
            <span className="text-muted small font-editorial d-block">ESTIMATED DELIVERY</span>
            <strong className="text-dark d-flex align-items-center gap-1 mt-1">
              <Truck size={16} /> 2–4 Business Days
            </strong>
          </div>
          <div className="col-md-4">
            <span className="text-muted small font-editorial d-block">PAYMENT METHOD</span>
            <strong className="text-dark d-block mt-1">
              {order?.paymentMethod || 'Cash on Delivery (COD)'}
            </strong>
          </div>
          <div className="col-md-4">
            <span className="text-muted small font-editorial d-block">ORDER STATUS</span>
            <span className="badge badge-status-pending mt-1">
              {order?.orderStatus || 'Pending'}
            </span>
          </div>
        </div>

        {/* Order items */}
        <h3 className="h6 fw-bold font-editorial mb-3">ITEMS IN YOUR PACKAGE</h3>
        <div className="d-flex flex-column gap-3 mb-4">
          {order?.orderItems?.map((item, idx) => (
            <div key={idx} className="d-flex align-items-center justify-content-between p-2 border-bottom">
              <div className="d-flex align-items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '56px', height: '70px', objectFit: 'cover' }}
                  className="border"
                />
                <div>
                  <div className="fw-bold small text-dark">{item.name}</div>
                  <div className="text-muted small">
                    Size: <strong>{item.size}</strong> • Color: <strong>{item.color}</strong> • Qty: <strong>{item.quantity}</strong>
                  </div>
                </div>
              </div>
              <div className="fw-bold small">
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>

        {/* Totals & Delivery Address */}
        <div className="row g-4 pt-2">
          <div className="col-md-6">
            <h4 className="h6 fw-bold font-editorial mb-2">DELIVERY DESTINATION</h4>
            <div className="text-muted small">
              <div className="fw-semibold text-dark">{order?.shippingAddress?.fullName}</div>
              <div>{order?.shippingAddress?.street}</div>
              <div>
                {order?.shippingAddress?.city}, {order?.shippingAddress?.state} - {order?.shippingAddress?.postalCode}
              </div>
              <div>Phone: {order?.shippingAddress?.phone}</div>
            </div>
          </div>
          <div className="col-md-6 text-md-end">
            <h4 className="h6 fw-bold font-editorial mb-2">SUMMARY</h4>
            <div className="text-muted small">
              <div>Subtotal: ₹{order?.subtotal?.toLocaleString('en-IN')}</div>
              <div>
                Shipping:{' '}
                {order?.shippingCharge === 0 ? (
                  <span className="text-success fw-bold">FREE</span>
                ) : (
                  `₹${order?.shippingCharge}`
                )}
              </div>
              <div className="fs-5 fw-bold text-dark mt-2">
                Total: ₹{order?.total?.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex flex-wrap justify-content-center gap-3">
        <Link to="/my-orders" className="btn btn-retro-dark">
          <Package size={16} /> VIEW ORDER HISTORY
        </Link>
        <Link to="/shop" className="btn btn-retro-outline">
          CONTINUE BROWSING <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
