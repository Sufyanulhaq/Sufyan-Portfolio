import mongoose, { type Document, Schema } from "mongoose"

export interface ICategory extends Document {
  name: string
  slug: string
  description?: string
  color?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    color: {
      type: String,
      trim: true,
      default: "#0ea5e9",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for better performance
CategorySchema.index({ slug: 1 })
CategorySchema.index({ isActive: 1 })
CategorySchema.index({ createdAt: -1 })

export default mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema)
