import mongoose, { type Document, Schema } from "mongoose"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "VIEWER" | "USER"
  avatar?: string
  bio?: string
  website?: string
  github?: string
  linkedin?: string
  twitter?: string
  isActive: boolean
  isEmailVerified: boolean
  lastLoginAt?: Date
  loginCount: number
  preferences: {
    theme: "light" | "dark" | "system"
    notifications: {
      email: boolean
      push: boolean
      marketing: boolean
    }
    privacy: {
      showEmail: boolean
      showProfile: boolean
    }
  }
  metadata: {
    ipAddress?: string
    userAgent?: string
    location?: string
  }
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["SUPER_ADMIN", "ADMIN", "EDITOR", "VIEWER", "USER"],
      default: "USER",
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    website: String,
    github: String,
    linkedin: String,
    twitter: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: Date,
    loginCount: {
      type: Number,
      default: 0,
    },
    preferences: {
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        marketing: { type: Boolean, default: false },
      },
      privacy: {
        showEmail: { type: Boolean, default: false },
        showProfile: { type: Boolean, default: true },
      },
    },
    metadata: {
      ipAddress: String,
      userAgent: String,
      location: String,
    },
  },
  {
    timestamps: true,
  },
)

UserSchema.index({ email: 1 })
UserSchema.index({ role: 1 })
UserSchema.index({ isActive: 1 })
UserSchema.index({ createdAt: -1 })

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema, "users")
