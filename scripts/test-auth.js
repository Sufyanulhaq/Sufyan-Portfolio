const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function testAuth() {
  try {
    console.log('🔍 Testing Authentication Setup...\n');
    
    // Check environment variables
    console.log('📋 Environment Variables:');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Not set');
    console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Not set');
    console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL ? '✅ Set' : '❌ Not set');
    
    if (!process.env.MONGODB_URI) {
      console.log('\n❌ MONGODB_URI not set. Please create .env.local file.');
      return;
    }
    
    // Test database connection
    console.log('\n🔌 Testing Database Connection...');
    const mongoose = require('mongoose');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Check if User model exists
    const path = require('path');
    const User = require(path.join(__dirname, '../models/User'));
    console.log('✅ User model loaded');
    
    // Check if test user exists
    const testUser = await User.findOne({ email: 'sufyan@example.com' });
    
    if (testUser) {
      console.log('✅ Test user exists:', testUser.email);
      console.log('Role:', testUser.role);
      console.log('Is Active:', testUser.isActive);
    } else {
      console.log('❌ Test user not found. Creating one...');
      
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      const newUser = new User({
        name: 'Sufyan Test Admin',
        email: 'sufyan@example.com',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        isActive: true,
        isEmailVerified: true,
        preferences: {
          theme: 'light',
          notifications: { email: true, push: true, marketing: false },
          privacy: { showEmail: false, showProfile: true }
        }
      });
      
      await newUser.save();
      console.log('✅ Test user created successfully');
      console.log('Email: sufyan@example.com');
      console.log('Password: admin123');
      console.log('Role: SUPER_ADMIN');
    }
    
    await mongoose.disconnect();
    console.log('\n✅ Authentication test completed successfully!');
    
  } catch (error) {
    console.error('❌ Authentication test failed:', error.message);
    process.exit(1);
  }
}

testAuth();
