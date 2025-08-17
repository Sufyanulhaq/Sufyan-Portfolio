import mongoose, { type Document, Schema } from "mongoose"

export interface IComment extends Document {
  content: string
  author: mongoose.Types.ObjectId
  post: mongoose.Types.ObjectId
  parentComment?: mongoose.Types.ObjectId
  approved: boolean
  likes: number
  createdAt: Date
  updatedAt: Date
}

const CommentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    approved: {
      type: Boolean,
      default: false,
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

// Indexes
CommentSchema.index({ post: 1, createdAt: -1 })
CommentSchema.index({ author: 1 })
CommentSchema.index({ approved: 1 })

export default mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema)
