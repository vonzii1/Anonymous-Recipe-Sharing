/**
 * SCSS Compilation Script
 * 
 * This script compiles SCSS files to CSS using sass.
 * Make sure to install sass globally: npm install -g sass
 */

const sass = require('sass');
const fs = require('fs');
const path = require('path');

// Define input and output directories
const inputDir = path.join(__dirname, '..', 'styles');
const outputDir = path.join(__dirname, '..', 'styles');

// Function to compile SCSS to CSS
function compileSCSS(inputFile, outputFile) {
  try {
    const result = sass.renderSync({
      file: inputFile,
      outFile: outputFile,
      outputStyle: 'compressed',
      sourceMap: true,
      sourceMapEmbed: true,
      sourceMapContents: true,
      includePaths: [inputDir]
    });

    // Write the CSS to file
    fs.writeFileSync(outputFile, result.css);
    
    // Write source map if it exists
    if (result.map) {
      fs.writeFileSync(`${outputFile}.map`, result.map);
    }
    
    console.log(`✅ Compiled: ${inputFile} -> ${outputFile}`);
    return true;
  } catch (error) {
    console.error(`❌ Error compiling ${inputFile}:`, error.message);
    return false;
  }
}

// Main function to compile all SCSS files
function compileAllSCSS() {
  console.log('🚀 Starting SCSS compilation...\n');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Compile main SCSS file
  const inputFile = path.join(inputDir, 'main.scss');
  const outputFile = path.join(outputDir, 'main.css');
  
  if (fs.existsSync(inputFile)) {
    const success = compileSCSS(inputFile, outputFile);
    
    if (success) {
      console.log('\n✨ SCSS compilation completed successfully!');
      return true;
    } else {
      console.error('\n❌ SCSS compilation failed!');
      return false;
    }
  } else {
    console.error(`\n❌ Main SCSS file not found: ${inputFile}`);
    return false;
  }
}

// Run the compilation
compileAllSCSS();
