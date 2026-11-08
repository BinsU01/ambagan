const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [100, 'Description must be 100 characters or less'],
    },
    // Stored in CENTAVOS (₱150.50 -> 15050) to avoid floating-point errors.
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [1, 'Amount must be at least ₱0.01'],
      validate: {
        validator: Number.isInteger,
        message: 'Amount must be a whole number of centavos',
      },
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Who paid is required'],
    },
    splitAmong: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      validate: {
        validator: (arr) => arr.length >= 1,
        message: 'Split among at least one person',
      },
    },
    splitType: {
      type: String,
      enum: ['equal'],
      default: 'equal',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Group page loads expenses newest first.
expenseSchema.index({ groupId: 1, date: -1 });

module.exports = mongoose.model('Expense', expenseSchema);
