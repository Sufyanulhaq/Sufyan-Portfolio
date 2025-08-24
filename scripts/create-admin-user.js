const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function createAdminUser() {
  try {
    console.log('🔍 Creating Admin User...\n');
    
    // Check environment variables
    console.log('📋 Environment Variables:');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Not set');
    console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Not set');
    
    if (!process.env.MONGODB_URI) {
      console.log('\n❌ MONGODB_URI not set. Please create .env.local file.');
      return;
    }
    
    // Test database connection
    console.log('\n🔌 Testing Database Connection...');
    const mongoose = require('mongoose');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Create User schema directly
    const userSchema = new mongoose.Schema({
      name: String,
      email: { type: String, unique: true },
      password: String,
      role: { type: String, enum: ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER', 'USER'], default: 'USER' },
      isActive: { type: Boolean, default: true },
      isEmailVerified: { type: Boolean, default: true },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });
    
    const User = mongoose.model('User', userSchema);
    console.log('✅ User model created');
    
    // Check if test user exists
    const testUser = await User.findOne({ email: 'sufyan@example.com' });
    
    if (testUser) {
      console.log('✅ Test user already exists:', testUser.email);
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
        isEmailVerified: true
      });
      
      await newUser.save();
      console.log('✅ Test user created successfully');
      console.log('Email: sufyan@example.com');
      console.log('Password: admin123');
      console.log('Role: SUPER_ADMIN');
    }
    
    await mongoose.disconnect();
    console.log('\n✅ Admin user setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Admin user setup failed:', error.message);
    process.exit(1);
  }
}

createAdminUser();
