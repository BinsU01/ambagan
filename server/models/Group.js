const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Group name is required'],
      trim: true,
      maxlength: [60, 'Group name must be 60 characters or less'],
    },
    members: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      validate: {
        validator: (arr) => arr.length >= 1,
        message: 'A group needs at least one member',
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Fast lookup for "My Groups" (all groups a user belongs to).
groupSchema.index({ members: 1 });

module.exports = mongoose.model('Group', groupSchema);
