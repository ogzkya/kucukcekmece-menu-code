// backend/models/MenuItem.js - Menu item schema
import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: 0,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    weight: {
      type: String,
      default: '',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    allergens: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    orderIndex: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;