import mongoose, { type Document, Schema } from "mongoose"

export interface ICategory extends Document {
  name: string
  slug: string
  description?: string
  color: string
  icon?: string
  parentCategory?: mongoose.Types.ObjectId
  isActive: boolean
  sortOrder: number
  postCount: number
  createdBy: mongoose.Types.ObjectId
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
      default: "#3B82F6",
    },
    icon: String,
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    postCount: {
      type: Number,
      default: 0,
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

CategorySchema.index({ slug: 1 })
CategorySchema.index({ isActive: 1 })
CategorySchema.index({ sortOrder: 1 })

export default mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema)
