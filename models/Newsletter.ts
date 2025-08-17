import mongoose, { type Document, Schema } from "mongoose"

export interface INewsletter extends Document {
  email: string
  name?: string
  isActive: boolean
  subscribedAt: Date
  unsubscribedAt?: Date
  preferences: {
    frequency: "daily" | "weekly" | "monthly"
    categories: string[]
  }
  metadata: {
    source?: string
    ipAddress?: string
    userAgent?: string
  }
  createdAt: Date
  updatedAt: Date
}

const NewsletterSchema = new Schema<INewsletter>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    unsubscribedAt: Date,
    preferences: {
      frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly"],
        default: "weekly",
      },
      categories: [String],
    },
    metadata: {
      source: String,
      ipAddress: String,
      userAgent: String,
    },
  },
  {
    timestamps: true,
  },
)

NewsletterSchema.index({ email: 1 })
NewsletterSchema.index({ isActive: 1 })
NewsletterSchema.index({ subscribedAt: -1 })

export default mongoose.models.Newsletter || mongoose.model<INewsletter>("Newsletter", NewsletterSchema)
