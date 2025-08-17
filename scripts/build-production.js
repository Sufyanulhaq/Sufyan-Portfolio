const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting production build process...');

// Step 1: Clean previous builds
console.log('🧹 Cleaning previous builds...');
try {
  execSync('rm -rf .next', { stdio: 'inherit' });
  execSync('rm -rf out', { stdio: 'inherit' });
} catch (error) {
  console.log('No previous builds to clean');
}

// Step 2: Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('pnpm install --frozen-lockfile', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Step 3: Build the application
console.log('🔨 Building application...');
try {
  execSync('pnpm build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 4: Export static files (optional)
console.log('📤 Exporting static files...');
try {
  execSync('pnpm export', { stdio: 'inherit' });
  console.log('✅ Export completed successfully!');
} catch (error) {
  console.log('⚠️ Export failed (this is optional):', error.message);
}

console.log('🎉 Production build process completed!');
console.log('📁 Your build is ready in the .next directory');
console.log('🚀 Ready for deployment to Vercel!');
