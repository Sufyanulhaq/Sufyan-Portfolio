import mongoose, { type Document, Schema } from "mongoose"

export interface IContactForm extends Document {
  name: string
  email: string
  subject: string
  message: string
  status: "NEW" | "READ" | "REPLIED" | "CLOSED"
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  assignedTo?: mongoose.Types.ObjectId
  tags: string[]
  metadata: {
    ipAddress?: string
    userAgent?: string
    referrer?: string
  }
  repliedAt?: Date
  closedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const ContactFormSchema = new Schema<IContactForm>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ["NEW", "READ", "REPLIED", "CLOSED"],
      default: "NEW",
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    tags: [String],
    metadata: {
      ipAddress: String,
      userAgent: String,
      referrer: String,
    },
    repliedAt: Date,
    closedAt: Date,
  },
  {
    timestamps: true,
  },
)

ContactFormSchema.index({ status: 1 })
ContactFormSchema.index({ priority: 1 })
ContactFormSchema.index({ createdAt: -1 })
ContactFormSchema.index({ email: 1 })

export default mongoose.models.ContactForm || mongoose.model<IContactForm>("ContactForm", ContactFormSchema)
