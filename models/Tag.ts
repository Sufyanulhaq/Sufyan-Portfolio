import mongoose, { type Document, Schema } from "mongoose"

export interface ITag extends Document {
  name: string
  slug: string
  description?: string
  color: string
  postCount: number
  isActive: boolean
  createdBy: mongoose.Types.ObjectId
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
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      maxlength: 200,
    },
    color: {
      type: String,
      required: true,
      default: "#10B981",
    },
    postCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

TagSchema.index({ slug: 1 })
TagSchema.index({ isActive: 1 })
TagSchema.index({ postCount: -1 })

export default mongoose.models.Tag || mongoose.model<ITag>("Tag", TagSchema)
