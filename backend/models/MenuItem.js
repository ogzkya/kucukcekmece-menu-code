// backend/models/MenuItem.js - Tesis tipi eklendi
import mongoose from 'mongoose';

import { FACILITY_TYPES } from './constants.js';

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
    facilityType: {
      type: String,
      enum: Object.values(FACILITY_TYPES),
      default: FACILITY_TYPES.SOCIAL,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;