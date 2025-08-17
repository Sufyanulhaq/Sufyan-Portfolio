import mongoose, { type Document, Schema } from "mongoose"

export interface IContactForm extends Document {
  name: string
  email: string
  subject: string
  message: string
  phone?: string
  company?: string
  website?: string
  budget?: string
  timeline?: string
  source?: string
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "PROPOSAL_SENT" | "NEGOTIATION" | "CLOSED_WON" | "CLOSED_LOST"
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  assignedTo?: mongoose.Types.ObjectId
  notes?: string
  ipAddress?: string
  userAgent?: string
  createdAt: Date
  updatedAt: Date
}

const ContactFormSchema = new Schema<IContactForm>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    website: {
      type: String,
      trim: true,
    },
    budget: {
      type: String,
      trim: true,
      enum: ["$1K-$5K", "$5K-$10K", "$10K-$25K", "$25K-$50K", "$50K+", "Not Sure"],
    },
    timeline: {
      type: String,
      trim: true,
      enum: ["ASAP", "1-2 weeks", "1-2 months", "3+ months", "Not Sure"],
    },
    source: {
      type: String,
      trim: true,
      enum: ["Website", "Referral", "Social Media", "Search Engine", "Other"],
    },
    status: {
      type: String,
      enum: ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "NEGOTIATION", "CLOSED_WON", "CLOSED_LOST"],
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
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
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
ContactFormSchema.index({ status: 1, createdAt: -1 })
ContactFormSchema.index({ priority: 1 })
ContactFormSchema.index({ assignedTo: 1 })
ContactFormSchema.index({ email: 1 })
ContactFormSchema.index({ createdAt: -1 })

export default mongoose.models.ContactForm || mongoose.model<IContactForm>("ContactForm", ContactFormSchema)
