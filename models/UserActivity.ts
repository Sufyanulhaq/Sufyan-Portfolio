import mongoose, { type Document, Schema } from "mongoose"

export interface IUserActivity extends Document {
  user: mongoose.Types.ObjectId
  action: string
  resource?: string
  resourceId?: mongoose.Types.ObjectId
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  createdAt: Date
}

const UserActivitySchema = new Schema<IUserActivity>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    resource: {
      type: String,
      trim: true,
    },
    resourceId: {
      type: Schema.Types.ObjectId,
    },
    details: {
      type: Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for better performance
UserActivitySchema.index({ user: 1, createdAt: -1 })
UserActivitySchema.index({ action: 1 })
UserActivitySchema.index({ resource: 1, resourceId: 1 })
UserActivitySchema.index({ createdAt: -1 })

export default mongoose.models.UserActivity || mongoose.model<IUserActivity>("UserActivity", UserActivitySchema)
