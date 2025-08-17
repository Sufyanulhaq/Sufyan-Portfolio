import mongoose, { type Document, Schema } from "mongoose"

export interface IUserActivity extends Document {
  user: mongoose.Types.ObjectId
  action: string
  resource: string
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
      enum: [
        "LOGIN",
        "LOGOUT",
        "CREATE_POST",
        "UPDATE_POST",
        "DELETE_POST",
        "CREATE_PROJECT",
        "UPDATE_PROJECT",
        "DELETE_PROJECT",
        "CREATE_COMMENT",
        "UPDATE_COMMENT",
        "DELETE_COMMENT",
        "VIEW_POST",
        "LIKE_POST",
        "SHARE_POST",
        "SUBSCRIBE_NEWSLETTER",
        "CONTACT_FORM_SUBMIT",
        "PROFILE_UPDATE",
        "PASSWORD_CHANGE",
        "EMAIL_VERIFY",
      ],
    },
    resource: {
      type: String,
      required: true,
      enum: ["USER", "POST", "PROJECT", "COMMENT", "CATEGORY", "TAG", "NEWSLETTER", "CONTACT"],
    },
    resourceId: {
      type: Schema.Types.ObjectId,
    },
    details: {
      type: Schema.Types.Mixed,
    },
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
)

UserActivitySchema.index({ user: 1, createdAt: -1 })
UserActivitySchema.index({ action: 1 })
UserActivitySchema.index({ resource: 1 })
UserActivitySchema.index({ createdAt: -1 })

export default mongoose.models.UserActivity || mongoose.model<IUserActivity>("UserActivity", UserActivitySchema)
