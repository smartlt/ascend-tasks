import mongoose, { Schema, model, models } from "mongoose";
import type { UrlMapping } from "../types";

interface IUrlDocument extends UrlMapping, Document {}

const UrlSchema = new Schema<IUrlDocument>(
  {
    shortKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    originalUrl: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    createdAt: {
      type: String,
      required: true,
      default: () => new Date().toISOString(),
    },
    accessCount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: false, // We handle timestamps manually
    versionKey: false, // Remove __v field
  }
);

UrlSchema.index({ createdAt: -1 });

// Prevent model recompilation during development
const Url = models.Url || model<IUrlDocument>("Url", UrlSchema);

export default Url;
