const Sales = require('../models/sales');
const Product = require('../models/product');

exports.createBill = async (req, res) => {
  try {
    const {
      items,
      paymentMethod,
      totalAmount
    } = req.body;

    // Validate stock availability
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product: ${product.name}`
        });
      }
    }

    // Create bill and update stock
    const bill = new Sales({
      items: items.map(item => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price
      })),
      paymentMethod,
      totalAmount,
      userID: req.user._id
    });

    // Update stock levels
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    await bill.save();

    // Generate invoice format for printing
    const invoiceData = {
      billNo: bill._id,
      date: bill.createdAt,
      items: await Promise.all(items.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          name: product.name,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price
        };
      })),
      total: totalAmount
    };

    res.status(201).json({
      message: "Bill created successfully",
      invoice: invoiceData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};