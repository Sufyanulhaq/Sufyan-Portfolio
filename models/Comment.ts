import mongoose, { type Document, Schema } from "mongoose"

export interface IComment extends Document {
  content: string
  author: mongoose.Types.ObjectId
  post: mongoose.Types.ObjectId
  parentComment?: mongoose.Types.ObjectId
  isApproved: boolean
  isSpam: boolean
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
    isApproved: {
      type: Boolean,
      default: false,
    },
    isSpam: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for better performance
CommentSchema.index({ post: 1, createdAt: -1 })
CommentSchema.index({ author: 1 })
CommentSchema.index({ isApproved: 1 })
CommentSchema.index({ isSpam: 1 })

export default mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema, "comments")
