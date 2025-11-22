const Product = require('../models/product');

exports.returnProduct = async (req, res) => {
  try {
    const {
      productId,
      returnAmount,
      actualAmountReceived,
      reason
    } = req.body;

    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Calculate return amount considering original discount
    const originalDiscount = product.purchaseInfo.discount || 0;
    const calculatedReturnAmount = returnAmount * (1 - originalDiscount/100);

    product.isReturned = true;
    product.returnInfo = {
      returnDate: new Date(),
      returnAmount: calculatedReturnAmount,
      actualAmountReceived,
      reason
    };
    product.stock = 0;

    await product.save();

    res.status(200).json({ 
      message: "Product returned successfully",
      returnDetails: product.returnInfo
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};