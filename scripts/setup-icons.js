#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Creating backup app icon configuration...');

// Create a simple package.json script entry
const packagePath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Add icon generation script if not exists
if (!packageJson.scripts['generate-icons']) {
  packageJson.scripts['generate-icons'] = 'node scripts/generate-icons.js';
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Added generate-icons script to package.json');
}

// Create instructions file
const instructions = `
# 🎨 How to Add Your Custom App Icon

## Quick Setup (5 minutes):

### Step 1: Open Icon Generator
1. Open the file: \`icon-generator.html\` in your browser
2. You'll see 4 different icon previews

### Step 2: Download Icons  
1. Click each "Download" button:
   - Download App Icon (icon.png)
   - Download Adaptive Icon (adaptive-icon.png) 
   - Download Favicon (favicon.png)
   - Download Splash Icon (splash-icon.png)

### Step 3: Replace Files
1. Go to your project folder: \`assets/images/\`
2. Replace the existing files with your downloaded ones
3. Make sure the filenames match exactly

### Step 4: Build & Test
\`\`\`bash
# Restart your development server
npx expo start --clear

# Build for Android to see the icon
npx expo run:android
\`\`\`

## 📱 Where You'll See Your Icon:
- **Android Home Screen**: Your custom wallet icon
- **App Drawer**: Professional branded icon  
- **Splash Screen**: Loading screen with your logo
- **Recent Apps**: Recognizable in task switcher

## 🎯 Icon Design Features:
- **Wallet Symbol**: Perfect for budget tracking app
- **Blue Theme**: Matches your app colors (#3b82f6)
- **Modern Design**: Contemporary rounded style
- **High Quality**: 1024x1024 resolution for crisp display

## 🔧 Technical Details:
- **Format**: PNG with transparency support
- **Adaptive**: Works with all Android icon shapes
- **Scalable**: Looks great on all screen densities
- **Optimized**: Properly sized for best performance

Your Budget Tracker app will look professional and branded! 🚀
`;

fs.writeFileSync(path.join(__dirname, '..', 'QUICK_ICON_SETUP.md'), instructions);
console.log('✅ Created QUICK_ICON_SETUP.md with simple instructions');

// Verify icon files exist
const iconsPath = path.join(__dirname, '..', 'assets', 'images');
const requiredIcons = ['icon.png', 'adaptive-icon.png', 'favicon.png', 'splash-icon.png'];

console.log('🔍 Checking existing icon files...');
requiredIcons.forEach(iconFile => {
  const iconPath = path.join(iconsPath, iconFile);
  if (fs.existsSync(iconPath)) {
    console.log(`✅ ${iconFile} exists`);
  } else {
    console.log(`⚠️  ${iconFile} missing - will be created by generator`);
  }
});

console.log('\n🎉 Icon setup complete!');
console.log('📁 Open icon-generator.html in your browser to create custom icons');
console.log('📖 Read QUICK_ICON_SETUP.md for step-by-step instructions');
