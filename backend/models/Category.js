// backend/models/Category.js - Tesis tipi eklendi
import mongoose from 'mongoose';

import { FACILITY_TYPES } from './constants.js';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    orderIndex: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
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

const Category = mongoose.model('Category', categorySchema);

export default Category;