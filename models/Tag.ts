import mongoose, { type Document, Schema } from "mongoose"

export interface ITag extends Document {
  name: string
  slug: string
  color?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const TagSchema = new Schema<ITag>(
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
    color: {
      type: String,
      trim: true,
      default: "#64748b",
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
TagSchema.index({ slug: 1 })
TagSchema.index({ isActive: 1 })
TagSchema.index({ createdAt: -1 })

export default mongoose.models.Tag || mongoose.model<ITag>("Tag", TagSchema)
