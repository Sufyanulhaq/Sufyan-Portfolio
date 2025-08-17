import mongoose, { type Document, Schema } from "mongoose"

export interface IPost extends Document {
  title: string
  slug: string
  content: string
  excerpt: string
  coverImage?: string
  published: boolean
  featured: boolean
  author: mongoose.Types.ObjectId
  category: string
  tags: string[]
  readTime: number
  views: number
  likes: number
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
      maxlength: 300,
    },
    coverImage: {
      type: String,
      default: null,
    },
    published: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    readTime: {
      type: Number,
      default: 5,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better performance
PostSchema.index({ slug: 1 })
PostSchema.index({ published: 1, createdAt: -1 })
PostSchema.index({ author: 1 })
PostSchema.index({ category: 1 })
PostSchema.index({ tags: 1 })

export default mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema)
