const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Import models
const User = require('../models/User');
const Post = require('../models/Post');
const Project = require('../models/Project');
const Category = require('../models/Category');
const Tag = require('../models/Tag');
const Comment = require('../models/Comment');
const ContactForm = require('../models/ContactForm');
const Newsletter = require('../models/Newsletter');
const UserActivity = require('../models/UserActivity');

async function testSeededData() {
  try {
    console.log('🧪 Testing seeded database...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test data counts
    const counts = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Project.countDocuments(),
      Category.countDocuments(),
      Tag.countDocuments(),
      Comment.countDocuments(),
      ContactForm.countDocuments(),
      Newsletter.countDocuments(),
      UserActivity.countDocuments()
    ]);

    const [userCount, postCount, projectCount, categoryCount, tagCount, commentCount, contactCount, newsletterCount, activityCount] = counts;

    console.log('\n📊 Database Content Summary:');
    console.log(`   👥 Users: ${userCount}`);
    console.log(`   📝 Blog Posts: ${postCount}`);
    console.log(`   🚀 Projects: ${projectCount}`);
    console.log(`   📂 Categories: ${categoryCount}`);
    console.log(`   🏷️ Tags: ${tagCount}`);
    console.log(`   💬 Comments: ${commentCount}`);
    console.log(`   📧 Contact Forms: ${contactCount}`);
    console.log(`   📰 Newsletter Subscriptions: ${newsletterCount}`);
    console.log(`   📈 User Activities: ${activityCount}`);

    // Test specific data
    if (userCount > 0) {
      const adminUser = await User.findOne({ role: 'SUPER_ADMIN' });
      if (adminUser) {
        console.log(`\n👑 Admin User: ${adminUser.name} (${adminUser.email})`);
      }
    }

    if (postCount > 0) {
      const featuredPost = await Post.findOne({ featured: true });
      if (featuredPost) {
        console.log(`\n⭐ Featured Post: ${featuredPost.title}`);
        console.log(`   Views: ${featuredPost.views}, Likes: ${featuredPost.likes}`);
      }
    }

    if (projectCount > 0) {
      const featuredProject = await Project.findOne({ featured: true });
      if (featuredProject) {
        console.log(`\n🚀 Featured Project: ${featuredProject.title}`);
        console.log(`   Category: ${featuredProject.category}`);
        console.log(`   Technologies: ${featuredProject.technologies.join(', ')}`);
      }
    }

    if (categoryCount > 0) {
      const categories = await Category.find().limit(3);
      console.log(`\n📂 Sample Categories: ${categories.map(c => c.name).join(', ')}`);
    }

    if (tagCount > 0) {
      const tags = await Tag.find().limit(5);
      console.log(`\n🏷️ Sample Tags: ${tags.map(t => t.name).join(', ')}`);
    }

    // Test relationships
    if (postCount > 0 && commentCount > 0) {
      const postWithComments = await Post.findOne().populate('comments');
      if (postWithComments) {
        console.log(`\n💬 Post "${postWithComments.title}" has comments`);
      }
    }

    console.log('\n✅ Database test completed successfully!');
    console.log('\n🎯 Next Steps:');
    console.log('   1. Visit your website to see the seeded content');
    console.log('   2. Login to admin dashboard with sufyan@example.com / admin123');
    console.log('   3. Explore the sample projects and blog posts');
    console.log('   4. Customize the content for your portfolio');

  } catch (error) {
    console.error('❌ Error testing database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run test
testSeededData();
