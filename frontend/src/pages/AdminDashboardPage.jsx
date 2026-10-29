import React, { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Eye,
  X
} from 'lucide-react';
import { adminAPI, productAPI } from '../services/api';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, products, orders
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState(null);

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Shirts',
    price: '',
    originalPrice: '',
    description: '',
    images: '',
    sizes: 'S, M, L, XL',
    colors: 'Vintage Black, Off White',
    stock: 15,
    featured: false,
  });

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [productSearch, setProductSearch] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, ordersRes, productsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getAllOrders({ limit: 50, status: orderStatusFilter !== 'All' ? orderStatusFilter : undefined }),
        productAPI.getProducts({ limit: 50 }),
      ]);
      setStats(statsRes.data.stats);
      setOrders(ordersRes.data.orders);
      setProducts(productsRes.data.products);
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  }, [orderStatusFilter]);

  useEffect(() => {
    let active = true;
    Promise.all([
      adminAPI.getStats(),
      adminAPI.getAllOrders({ limit: 50, status: orderStatusFilter !== 'All' ? orderStatusFilter : undefined }),
      productAPI.getProducts({ limit: 50 }),
    ]).then(([statsRes, ordersRes, productsRes]) => {
      if (active) {
        setStats(statsRes.data.stats);
        setOrders(ordersRes.data.orders);
        setProducts(productsRes.data.products);
        setLoading(false);
      }
    }).catch((err) => {
      console.error('Error fetching admin data', err);
      if (active) setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [orderStatusFilter]);

  const showNotice = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Product Add / Edit submit
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: productForm.name,
        category: productForm.category,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : 0,
        description: productForm.description,
        images: productForm.images.split(',').map((url) => url.trim()).filter(Boolean),
        sizes: productForm.sizes.split(',').map((s) => s.trim()).filter(Boolean),
        colors: productForm.colors.split(',').map((c) => c.trim()).filter(Boolean),
        stock: Number(productForm.stock),
        featured: Boolean(productForm.featured),
      };

      if (editingProductId) {
        await productAPI.updateProduct(editingProductId, payload);
        showNotice('Product updated successfully!');
      } else {
        await productAPI.createProduct(payload);
        showNotice('New product added to catalog!');
      }

      setIsProductModalOpen(false);
      resetProductForm();
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving product');
    }
  };

  const handleEditClick = (product) => {
    setEditingProductId(product._id);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || '',
      description: product.description,
      images: (product.images || []).join(', '),
      sizes: (product.sizes || []).join(', '),
      colors: (product.colors || []).join(', '),
      stock: product.stock,
      featured: product.featured || false,
    });
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productAPI.deleteProduct(id);
      showNotice('Product removed from catalog.');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting product');
    }
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      category: 'Shirts',
      price: '',
      originalPrice: '',
      description: '',
      images: '',
      sizes: 'S, M, L, XL',
      colors: 'Vintage Black, Off White',
      stock: 15,
      featured: false,
    });
  };

  // Update order status
  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      showNotice(`Order #${orderId.slice(-6)} updated to ${newStatus}`);
      fetchData();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, orderStatus: newStatus }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating order status');
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

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="container-fluid px-lg-5 px-3 py-4" style={{ minHeight: '80vh' }}>
      {/* Toast Notice */}
      {actionNotice && (
        <div
          className="position-fixed bottom-0 end-0 m-4 p-3 bg-dark text-white rounded-1 shadow-lg d-flex align-items-center gap-2"
          style={{ zIndex: 1100, border: '1px solid var(--color-border)' }}
        >
          <CheckCircle2 size={18} className="text-success" />
          <span className="small">{actionNotice}</span>
        </div>
      )}

      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom gap-2">
        <div>
          <span className="font-editorial text-muted-retro small d-block">
            ADMINISTRATION PORTAL
          </span>
          <h1 className="display-6 fw-bold text-dark mb-0">STORE CONTROL CENTER</h1>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-retro-light btn-sm d-flex align-items-center gap-1"
            onClick={fetchData}
          >
            <RefreshCw size={14} /> Refresh Data
          </button>
          <button
            className="btn btn-retro-dark btn-sm d-flex align-items-center gap-1"
            onClick={() => {
              resetProductForm();
              setIsProductModalOpen(true);
            }}
          >
            <Plus size={14} /> Add New Garment
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-pills mb-4 gap-2">
        <li className="nav-item">
          <button
            className={`btn btn-sm ${
              activeTab === 'overview' ? 'btn-dark' : 'btn-outline-dark'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview & Metrics
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn btn-sm ${
              activeTab === 'products' ? 'btn-dark' : 'btn-outline-dark'
            }`}
            onClick={() => setActiveTab('products')}
          >
            Product Catalog ({products.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn btn-sm ${
              activeTab === 'orders' ? 'btn-dark' : 'btn-outline-dark'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            Customer Orders ({orders.length})
          </button>
        </li>
      </ul>

      {loading && !stats ? (
        <div className="text-center py-5">
          <div className="spinner-border text-dark" role="status"></div>
        </div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && stats && (
            <div>
              {/* Stat Metric Cards */}
              <div className="row g-3 mb-4">
                <div className="col-md-3 col-6">
                  <div className="stat-card">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="stat-label">TOTAL SALES (COD)</span>
                      <TrendingUp size={20} className="text-success" />
                    </div>
                    <div className="stat-value">₹{stats.totalSales.toLocaleString('en-IN')}</div>
                    <div className="text-muted" style={{ fontSize: '11px' }}>
                      From {stats.totalOrders} total store orders
                    </div>
                  </div>
                </div>

                <div className="col-md-3 col-6">
                  <div className="stat-card">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="stat-label">ORDERS PLACED</span>
                      <ShoppingBag size={20} className="text-primary" />
                    </div>
                    <div className="stat-value">{stats.totalOrders}</div>
                    <div className="text-muted" style={{ fontSize: '11px' }}>
                      {stats.statusCounts?.Pending || 0} pending fulfillment
                    </div>
                  </div>
                </div>

                <div className="col-md-3 col-6">
                  <div className="stat-card">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="stat-label">ACTIVE PRODUCTS</span>
                      <Package size={20} className="text-warning" />
                    </div>
                    <div className="stat-value">{stats.totalProducts}</div>
                    <div className="text-muted" style={{ fontSize: '11px' }}>
                      Across 5 menswear departments
                    </div>
                  </div>
                </div>

                <div className="col-md-3 col-6">
                  <div className="stat-card">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="stat-label">TOTAL CLIENTS</span>
                      <Users size={20} className="text-info" />
                    </div>
                    <div className="stat-value">{stats.totalCustomers}</div>
                    <div className="text-muted" style={{ fontSize: '11px' }}>
                      Registered client profiles
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Status Distribution */}
              <div className="row g-4 mb-4">
                <div className="col-lg-8">
                  <div className="bg-white border rounded-1 p-4 h-100">
                    <h3 className="h6 fw-bold font-editorial mb-3 pb-2 border-bottom">
                      RECENT STORE ORDERS
                    </h3>
                    <div className="table-responsive">
                      <table className="table align-middle small mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>ORDER</th>
                            <th>CLIENT</th>
                            <th>ITEMS</th>
                            <th>AMOUNT</th>
                            <th>STATUS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(stats.recentOrders || []).map((o) => (
                            <tr key={o._id}>
                              <td className="fw-bold">#{o._id.slice(-6).toUpperCase()}</td>
                              <td>{o.customer?.name || 'Customer'}</td>
                              <td>{o.orderItems?.length || 0} items</td>
                              <td className="fw-bold">₹{o.total?.toLocaleString('en-IN')}</td>
                              <td>{getStatusBadge(o.orderStatus)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Status Counter */}
                <div className="col-lg-4">
                  <div className="bg-white border rounded-1 p-4 h-100">
                    <h3 className="h6 fw-bold font-editorial mb-3 pb-2 border-bottom">
                      ORDER PIPELINE
                    </h3>
                    <div className="d-flex flex-column gap-3">
                      {Object.entries(stats.statusCounts || {}).map(([status, count]) => (
                        <div key={status} className="d-flex justify-content-between align-items-center">
                          <div>{getStatusBadge(status)}</div>
                          <span className="fw-bold fs-6">{count}</span>
                        </div>
                      ))}
                    </div>

                    {stats.lowStockProducts?.length > 0 && (
                      <div className="mt-4 pt-3 border-top">
                        <div className="d-flex align-items-center gap-1 text-danger small fw-bold mb-2">
                          <AlertTriangle size={15} />
                          <span>LOW STOCK ALERT</span>
                        </div>
                        {stats.lowStockProducts.map((p) => (
                          <div key={p._id} className="small text-muted d-flex justify-content-between mb-1">
                            <span className="text-truncate" style={{ maxWidth: '180px' }}>{p.name}</span>
                            <span className="badge bg-danger-subtle text-danger">{p.stock} left</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="position-relative" style={{ maxWidth: '320px', width: '100%' }}>
                  <Search size={16} className="position-absolute text-muted" style={{ left: '12px', top: '12px' }} />
                  <input
                    type="text"
                    className="retro-input ps-5 py-2 small"
                    placeholder="Search product name or category..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                </div>
                <button
                  className="btn btn-retro-dark btn-sm d-flex align-items-center gap-1"
                  onClick={() => {
                    resetProductForm();
                    setIsProductModalOpen(true);
                  }}
                >
                  <Plus size={14} /> Add Product
                </button>
              </div>

              <div className="bg-white border rounded-1 p-3">
                <div className="table-responsive">
                  <table className="table align-middle small mb-0">
                    <thead className="table-light font-editorial" style={{ fontSize: '11px' }}>
                      <tr>
                        <th>GARMENT</th>
                        <th>CATEGORY</th>
                        <th>PRICE</th>
                        <th>STOCK</th>
                        <th>SIZES</th>
                        <th>FEATURED</th>
                        <th className="text-end">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((p) => (
                        <tr key={p._id}>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <img
                                src={p.images[0]}
                                alt={p.name}
                                style={{ width: '44px', height: '56px', objectFit: 'cover' }}
                                className="border"
                              />
                              <div>
                                <div className="fw-bold text-dark">{p.name}</div>
                                <div className="text-muted" style={{ fontSize: '11px' }}>
                                  Rating: {p.rating} ★
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border">{p.category}</span>
                          </td>
                          <td className="fw-bold">
                            ₹{p.price.toLocaleString('en-IN')}
                            {p.originalPrice > p.price && (
                              <div className="text-muted text-decoration-line-through" style={{ fontSize: '10px' }}>
                                ₹{p.originalPrice.toLocaleString('en-IN')}
                              </div>
                            )}
                          </td>
                          <td>
                            <span className={`badge ${p.stock <= 5 ? 'bg-danger' : 'bg-success'}`}>
                              {p.stock} units
                            </span>
                          </td>
                          <td>{(p.sizes || []).join(', ')}</td>
                          <td>
                            {p.featured ? (
                              <span className="badge bg-dark">Featured</span>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                          <td className="text-end">
                            <div className="d-inline-flex gap-2">
                              <button
                                className="btn btn-sm btn-outline-secondary p-1"
                                onClick={() => handleEditClick(p)}
                                title="Edit Product"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger p-1"
                                onClick={() => handleDeleteProduct(p._id)}
                                title="Delete Product"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div>
              {/* Order Status Filters */}
              <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
                <span className="small text-muted fw-bold font-editorial me-2">FILTER STATUS:</span>
                {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    className={`btn btn-sm ${
                      orderStatusFilter === st ? 'btn-dark' : 'btn-outline-secondary'
                    }`}
                    onClick={() => setOrderStatusFilter(st)}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="bg-white border rounded-1 p-3">
                <div className="table-responsive">
                  <table className="table align-middle small mb-0">
                    <thead className="table-light font-editorial" style={{ fontSize: '11px' }}>
                      <tr>
                        <th>ORDER ID</th>
                        <th>DATE</th>
                        <th>CUSTOMER & DESTINATION</th>
                        <th>ITEMS</th>
                        <th>AMOUNT</th>
                        <th>STATUS</th>
                        <th>CHANGE STATUS</th>
                        <th>VIEW</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td className="fw-bold">#{order._id.slice(-8).toUpperCase()}</td>
                          <td>
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td>
                            <div className="fw-bold">{order.shippingAddress?.fullName}</div>
                            <div className="text-muted" style={{ fontSize: '11px' }}>
                              {order.shippingAddress?.city}, {order.shippingAddress?.state} • {order.shippingAddress?.phone}
                            </div>
                          </td>
                          <td>{order.orderItems?.length} items</td>
                          <td className="fw-bold">₹{order.total?.toLocaleString('en-IN')}</td>
                          <td>{getStatusBadge(order.orderStatus)}</td>
                          <td>
                            <select
                              className="form-select form-select-sm"
                              value={order.orderStatus}
                              onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value)}
                              style={{ width: '130px', fontSize: '12px' }}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-dark p-1"
                              onClick={() => setSelectedOrder(order)}
                              title="View Details"
                            >
                              <Eye size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1100 }}
          onClick={() => setIsProductModalOpen(false)}
        >
          <div
            className="bg-white p-4 rounded-1 border shadow-lg max-vh-90 overflow-y-auto"
            style={{ maxWidth: '640px', width: '90%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <span className="fw-bold font-editorial">
                {editingProductId ? 'EDIT PRODUCT' : 'ADD NEW MENSWEAR GARMENT'}
              </span>
              <button
                className="btn btn-sm border-0 p-1"
                onClick={() => setIsProductModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleProductSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">PRODUCT NAME *</label>
                <input
                  type="text"
                  className="retro-input"
                  placeholder="e.g. Japanese Selvedge Trucker Jacket"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">CATEGORY *</label>
                  <select
                    className="form-select form-select-sm retro-input"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  >
                    <option value="Shirts">Shirts</option>
                    <option value="T-Shirts">T-Shirts</option>
                    <option value="Jeans">Jeans</option>
                    <option value="Jackets">Jackets</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-semibold">PRICE (₹) *</label>
                  <input
                    type="number"
                    className="retro-input"
                    placeholder="2499"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-semibold">ORIGINAL PRICE (₹)</label>
                  <input
                    type="number"
                    className="retro-input"
                    placeholder="3499"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">IMAGE URLS (COMMA SEPARATED) *</label>
                <textarea
                  rows={2}
                  className="retro-input"
                  placeholder="https://images.unsplash.com/..., https://..."
                  value={productForm.images}
                  onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                  required
                ></textarea>
                <div className="text-muted" style={{ fontSize: '11px' }}>
                  Paste direct high-resolution image URLs separated by commas.
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">DESCRIPTION *</label>
                <textarea
                  rows={3}
                  className="retro-input"
                  placeholder="Craftsmanship, weight in GSM/oz, fabric composition..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  required
                ></textarea>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">SIZES (COMMA SEPARATED)</label>
                  <input
                    type="text"
                    className="retro-input"
                    value={productForm.sizes}
                    onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">COLORS (COMMA SEPARATED)</label>
                  <input
                    type="text"
                    className="retro-input"
                    value={productForm.colors}
                    onChange={(e) => setProductForm({ ...productForm, colors: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">STOCK COUNT</label>
                  <input
                    type="number"
                    className="retro-input"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-check mb-4">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  className="form-check-input"
                  checked={productForm.featured}
                  onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                />
                <label htmlFor="featuredCheck" className="form-check-label small fw-semibold">
                  Display in Featured Archive Carousel
                </label>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setIsProductModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-retro-dark btn-sm">
                  {editingProductId ? 'Save Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1100 }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white p-4 rounded-1 border shadow-lg max-vh-90 overflow-y-auto"
            style={{ maxWidth: '600px', width: '90%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <div>
                <span className="fw-bold font-editorial">
                  ORDER #{selectedOrder._id.slice(-8).toUpperCase()}
                </span>
                <span className="ms-2">{getStatusBadge(selectedOrder.orderStatus)}</span>
              </div>
              <button
                className="btn btn-sm border-0 p-1"
                onClick={() => setSelectedOrder(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-3">
              <h6 className="fw-bold font-editorial small mb-2">CLIENT SHIPPING ADDRESS</h6>
              <div className="p-3 bg-light rounded-1 small text-muted">
                <div className="fw-bold text-dark">{selectedOrder.shippingAddress?.fullName}</div>
                <div>{selectedOrder.shippingAddress?.street}</div>
                <div>
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.postalCode}
                </div>
                <div>Email: {selectedOrder.shippingAddress?.email}</div>
                <div>Phone: {selectedOrder.shippingAddress?.phone}</div>
              </div>
            </div>

            <div className="mb-3">
              <h6 className="fw-bold font-editorial small mb-2">ORDERED ITEMS</h6>
              <div className="d-flex flex-column gap-2">
                {selectedOrder.orderItems?.map((item, idx) => (
                  <div key={idx} className="d-flex justify-content-between align-items-center p-2 border rounded-1">
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '40px', height: '50px', objectFit: 'cover' }}
                      />
                      <div className="small">
                        <div className="fw-bold">{item.name}</div>
                        <div className="text-muted" style={{ fontSize: '11px' }}>
                          Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="fw-bold small">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="d-flex justify-content-between border-top pt-2 small fw-bold">
              <span>Total Payable (COD):</span>
              <span className="fs-6">₹{selectedOrder.total?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
