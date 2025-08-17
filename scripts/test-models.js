const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Import models
const Post = require('../models/Post');
const Project = require('../models/Project');
const Category = require('../models/Category');

async function testModels() {
  try {
    console.log('🔌 Testing models...');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test Post model
    console.log('\n📝 Testing Post model...');
    try {
      const postCount = await Post.countDocuments();
      console.log(`   Posts count: ${postCount}`);
      
      if (postCount > 0) {
        const posts = await Post.find().limit(2).lean();
        console.log(`   Sample posts:`, posts.map(p => ({ id: p._id, title: p.title, slug: p.slug })));
      }
    } catch (error) {
      console.error('   ❌ Post model error:', error.message);
    }

    // Test Project model
    console.log('\n🚀 Testing Project model...');
    try {
      const projectCount = await Project.countDocuments();
      console.log(`   Projects count: ${projectCount}`);
      
      if (projectCount > 0) {
        const projects = await Project.find().limit(2).lean();
        console.log(`   Sample projects:`, projects.map(p => ({ id: p._id, title: p.title, slug: p.slug })));
      }
    } catch (error) {
      console.error('   ❌ Project model error:', error.message);
    }

    // Test Category model
    console.log('\n🏷️ Testing Category model...');
    try {
      const categoryCount = await Category.countDocuments();
      console.log(`   Categories count: ${categoryCount}`);
      
      if (categoryCount > 0) {
        const categories = await Category.find().limit(2).lean();
        console.log(`   Sample categories:`, categories.map(c => ({ id: c._id, name: c.name, slug: c.slug })));
      }
    } catch (error) {
      console.error('   ❌ Category model error:', error.message);
    }

    // Check collections directly
    console.log('\n📚 Checking collections directly...');
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('   Available collections:', collections.map(c => c.name));

  } catch (error) {
    console.error('❌ Error testing models:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

testModels();
