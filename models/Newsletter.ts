import mongoose, { type Document, Schema } from "mongoose"

export interface INewsletter extends Document {
  email: string
  firstName?: string
  lastName?: string
  isSubscribed: boolean
  source?: string
  ipAddress?: string
  userAgent?: string
  subscribedAt: Date
  unsubscribedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const NewsletterSchema = new Schema<INewsletter>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    firstName: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    isSubscribed: {
      type: Boolean,
      default: true,
    },
    source: {
      type: String,
      trim: true,
      enum: ["Website", "Blog", "Social Media", "Referral", "Other"],
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    unsubscribedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for better performance
// Remove duplicate email index since unique: true already creates it
NewsletterSchema.index({ isSubscribed: 1 })
NewsletterSchema.index({ subscribedAt: -1 })
NewsletterSchema.index({ createdAt: -1 })

export default mongoose.models.Newsletter || mongoose.model<INewsletter>("Newsletter", NewsletterSchema, "newsletters")
