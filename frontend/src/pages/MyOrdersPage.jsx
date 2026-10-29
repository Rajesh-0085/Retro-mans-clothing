import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, CheckCircle2, RefreshCw, ArrowRight, ArrowLeft } from 'lucide-react';
import { orderAPI } from '../services/api';

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await orderAPI.getMyOrders();
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Error fetching my orders', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    orderAPI.getMyOrders().then((res) => {
      if (active) {
        setOrders(res.data.orders || []);
        setLoading(false);
      }
    }).catch((err) => {
      console.error('Error fetching my orders', err);
      if (active) setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    setCancelLoading(orderId);
    try {
      await orderAPI.cancelOrder(orderId);
      setActionNotice('Order cancelled successfully.');
      await fetchOrders();
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setCancelLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="badge badge-status-pending">PENDING</span>;
      case 'Processing':
        return <span className="badge badge-status-processing">PROCESSING</span>;
      case 'Shipped':
        return <span className="badge badge-status-shipped">SHIPPED</span>;
      case 'Delivered':
        return <span className="badge badge-status-delivered">DELIVERED</span>;
      case 'Cancelled':
        return <span className="badge badge-status-cancelled">CANCELLED</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

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
          <h1 className="display-6 fw-bold text-dark mb-1">MY ORDER HISTORY</h1>
          <p className="text-muted small mb-0">
            Track, view receipts, and manage your menswear purchases.
          </p>
        </div>
        <button
          className="btn btn-retro-light btn-sm d-flex align-items-center gap-1"
          onClick={fetchOrders}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {actionNotice && (
        <div className="alert alert-info small d-flex align-items-center gap-2 mb-4">
          <CheckCircle2 size={16} />
          <span>{actionNotice}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-dark" role="status"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-5 bg-white border p-5 rounded-1">
          <Package size={48} className="text-muted mb-3" />
          <h3 className="fw-bold mb-2">No Past Orders Found</h3>
          <p className="text-muted small mb-4">
            You haven't placed any orders yet. Discover our collection of vintage essentials.
          </p>
          <Link to="/shop" className="btn btn-retro-dark">
            EXPLORE THE STORE <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border rounded-1 p-4 shadow-sm">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom pb-3 mb-3 gap-2">
                <div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold text-dark font-editorial">
                      ORDER #{order._id.slice(-8).toUpperCase()}
                    </span>
                    {getStatusBadge(order.orderStatus)}
                  </div>
                  <div className="text-muted small">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div className="text-md-end">
                    <div className="text-muted small">TOTAL PAID / PAYABLE</div>
                    <div className="fw-bold fs-6">₹{order.total.toLocaleString('en-IN')}</div>
                  </div>

                  {order.orderStatus === 'Pending' && (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={cancelLoading === order._id}
                    >
                      {cancelLoading === order._id ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="row g-3 mb-3">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="col-md-6">
                    <div className="d-flex align-items-center gap-3 p-2 border rounded-1 bg-light">
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '60px', height: '76px', objectFit: 'cover' }}
                        className="border"
                      />
                      <div className="flex-grow-1">
                        <div className="fw-bold small text-dark">{item.name}</div>
                        <div className="text-muted small" style={{ fontSize: '11px' }}>
                          Size: <strong>{item.size}</strong> • Color: <strong>{item.color}</strong>
                        </div>
                        <div className="text-muted small" style={{ fontSize: '11px' }}>
                          Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div className="fw-bold small pe-2">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping address footer */}
              <div className="bg-light p-3 rounded-1 d-flex flex-column flex-md-row justify-content-between align-items-md-center small text-muted">
                <div>
                  <strong>Delivery to:</strong> {order.shippingAddress.fullName}, {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                </div>
                <div className="mt-2 mt-md-0">
                  <strong>Payment:</strong> {order.paymentMethod}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
