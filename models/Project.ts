import mongoose, { type Document, Schema } from "mongoose"

export interface IProject extends Document {
  title: string
  slug: string
  description: string
  longDescription: string
  coverImage: string
  images: string[]
  technologies: string[]
  category: string
  featured: boolean
  liveUrl?: string
  githubUrl?: string
  status: "COMPLETED" | "IN_PROGRESS" | "PLANNED"
  startDate: Date
  endDate?: Date
  client?: string
  author?: mongoose.Types.ObjectId
  testimonial?: {
    content: string
    author: string
    position: string
    company: string
  }
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 200,
    },
    longDescription: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    technologies: [
      {
        type: String,
        required: true,
      },
    ],
    category: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    liveUrl: String,
    githubUrl: String,
    status: {
      type: String,
      enum: ["COMPLETED", "IN_PROGRESS", "PLANNED"],
      default: "COMPLETED",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: Date,
    client: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    testimonial: {
      content: String,
      author: String,
      position: String,
      company: String,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
// Remove duplicate slug index since unique: true already creates it
ProjectSchema.index({ featured: 1, createdAt: -1 })
ProjectSchema.index({ category: 1 })
ProjectSchema.index({ status: 1 })

export default mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema, "projects")
