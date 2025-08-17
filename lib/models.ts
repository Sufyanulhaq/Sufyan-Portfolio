// Import all models to ensure they're registered with Mongoose
import User from "@/models/User"
import Post from "@/models/Post"
import Project from "@/models/Project"
import Category from "@/models/Category"
import Tag from "@/models/Tag"
import Comment from "@/models/Comment"
import ContactForm from "@/models/ContactForm"
import Newsletter from "@/models/Newsletter"
import UserActivity from "@/models/UserActivity"

// Export all models
export {
  User,
  Post,
  Project,
  Category,
  Tag,
  Comment,
  ContactForm,
  Newsletter,
  UserActivity
}
