const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function fixEnvironmentVariables() {
  console.log('🔧 Fixing Environment Variables...\n');
  
  // Read current .env.local
  const envPath = path.join(process.cwd(), '.env.local');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Generate new NEXTAUTH_SECRET
  const crypto = require('crypto');
  const newSecret = crypto.randomBytes(32).toString('base64');
  
  // Update NEXTAUTH_SECRET
  if (envContent.includes('your-super-secret-key-here-change-in-production')) {
    envContent = envContent.replace(
      'NEXTAUTH_SECRET="your-super-secret-key-here-change-in-production"',
      `NEXTAUTH_SECRET="${newSecret}"`
    );
    console.log('✅ Generated new NEXTAUTH_SECRET');
  }
  
  // Write updated .env.local
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Updated .env.local file');
  
  // Test database connection
  console.log('\n🔌 Testing Database Connection...');
  
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI not found in environment variables');
    }
    
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test if models are working
    console.log('\n📊 Testing Models...');
    
    // Check if User model exists
    if (mongoose.models.User) {
      const userCount = await mongoose.models.User.countDocuments();
      console.log(`✅ User model working - Found ${userCount} users in database`);
    } else {
      console.log('⚠️  User model not found - this might cause issues');
    }
    
    await mongoose.disconnect();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
  
  console.log('\n🎉 Environment setup completed successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Restart your development server');
  console.log('2. Try logging in with admin credentials');
  console.log('3. Test the contact form');
}

fixEnvironmentVariables().catch(console.error);
