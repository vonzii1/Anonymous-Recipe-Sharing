/**
 * Update Navbar Script
 * 
 * This script updates the navbar in all HTML files to use the new component-based approach.
 * It should be run once to update all pages.
 */

const fs = require('fs');
const path = require('path');

// Define the directory containing the HTML files
const publicDir = path.join(__dirname, '..', '..', 'backend', 'public');

// List of HTML files to update
const htmlFiles = [
  'index.html',
  'login.html',
  'signup.html',
  'profile.html',
  'create-post.html',
  'communities.html',
  'search.html',
  'notifications.html',
  'inbox.html',
  'chat.html'
];

// New navbar include code
const navbarInclude = `
  <!-- Modern Navbar Component -->
  <div id="navbar-placeholder"></div>
  
  <!-- Navbar Styles -->
  <link rel="stylesheet" href="/styles/components/_navbar.css">
  
  <!-- Navbar Scripts -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <script src="/scripts/utils/navbar-injector.js" type="module"></script>
`;

// Function to update a single HTML file
function updateHtmlFile(filePath) {
  try {
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove existing navbar (from opening nav tag to closing nav tag)
    content = content.replace(/<nav[\s\S]*?<\/nav>/i, navbarInclude);
    
    // Add CSS link to main.scss if not present
    if (!content.includes('main.scss') && !content.includes('style.css')) {
      content = content.replace(
        '</head>',
        '    <link rel="stylesheet" href="/styles/main.css">\n  </head>'
      );
    }
    
    // Add viewport meta tag if not present
    if (!content.includes('viewport')) {
      content = content.replace(
        '<head>',
        '<head>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">'
      );
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
    
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

// Process all HTML files
console.log('🚀 Starting navbar update process...\n');

htmlFiles.forEach(file => {
  const filePath = path.join(publicDir, file);
  
  if (fs.existsSync(filePath)) {
    updateHtmlFile(filePath);
  } else {
    console.log(`⚠️  File not found: ${filePath}`);
  }
});

console.log('\n✨ Navbar update process completed!');
