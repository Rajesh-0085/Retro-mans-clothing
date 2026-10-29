const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get dashboard metrics and sales summary
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // Calculate total revenue (excluding cancelled orders)
    const validOrders = await Order.find({ orderStatus: { $ne: 'Cancelled' } });
    const totalSales = validOrders.reduce((sum, order) => sum + (order.total || 0), 0);

    // Recent 5 orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('customer', 'name email');

    // Low stock products (< 5)
    const lowStockProducts = await Product.find({ stock: { $lte: 5 } }).select(
      'name stock price category'
    );

    // Order status breakdown
    const statusCounts = {
      Pending: await Order.countDocuments({ orderStatus: 'Pending' }),
      Processing: await Order.countDocuments({ orderStatus: 'Processing' }),
      Shipped: await Order.countDocuments({ orderStatus: 'Shipped' }),
      Delivered: await Order.countDocuments({ orderStatus: 'Delivered' }),
      Cancelled: await Order.countDocuments({ orderStatus: 'Cancelled' }),
    };

    res.status(200).json({
      success: true,
      stats: {
        totalSales,
        totalOrders,
        totalProducts,
        totalCustomers,
        statusCounts,
        recentOrders,
        lowStockProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders with optional status filter & pagination
// @route   GET /api/orders (or /api/admin/orders)
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.orderStatus = status;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // If order is changed to cancelled from another status, restock items
    if (status === 'Cancelled' && order.orderStatus !== 'Cancelled') {
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }

    order.orderStatus = status;
    if (status === 'Delivered') {
      order.paymentStatus = 'Completed';
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (error) {
    next(error);
  }
};
