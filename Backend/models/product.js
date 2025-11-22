const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    // New fields for SKU specifics
    specifications: {
      flavor: String,
      weight: Number,
      volume: Number,
      unit: String // for weight/volume unit (g, ml, etc.)
    },
    stock: {
      type: Number,
      required: true,
    },
    purchaseInfo: {
      purchaseDate: Date,
      purchasePrice: Number,
      discount: Number,
      mrp: Number,
      expiryDate: Date
    },
    description: String,
    isReturned: {
      type: Boolean,
      default: false
    },
    returnInfo: {
      returnDate: Date,
      returnAmount: Number,
      actualAmountReceived: Number,
      reason: String
    }
  },
  { timestamps: true }
);

// Add index for efficient expiry date queries
ProductSchema.index({ "purchaseInfo.expiryDate": 1 });

// Add method to check for expiring products
ProductSchema.statics.getExpiringProducts = function(days = 30) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    "purchaseInfo.expiryDate": {
      $gte: new Date(),
      $lte: futureDate
    },
    isReturned: false
  });
};