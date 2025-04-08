#!/usr/bin/env node

/**
 * Script to upload CV data to Cloudflare KV
 * 
 * Usage:
 *   node upload-cv.js path/to/cv.json
 */

import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Get the CV file path from command line arguments
const cvFilePath = process.argv[2];

if (!cvFilePath) {
  console.error('Please provide a path to your CV JSON file');
  console.error('Usage: node upload-cv.js path/to/cv.json');
  process.exit(1);
}

// Read the CV file
try {
  const cvData = JSON.parse(fs.readFileSync(cvFilePath, 'utf8'));
  
  // Update the version and lastUpdated in meta
  if (!cvData.meta) {
    cvData.meta = {};
  }
  
  // If no version is provided, increment the existing one or start at 1.0.0
  if (!cvData.meta.version) {
    cvData.meta.version = '1.0.0';
  }
  
  // Update the lastUpdated timestamp
  cvData.meta.lastUpdated = new Date().toISOString();
  
  // Write the updated CV data to a temporary file
  const tempFilePath = './temp-cv.json';
  fs.writeFileSync(tempFilePath, JSON.stringify(cvData, null, 2));
  
  // Upload to Cloudflare KV using wrangler
  console.log('Uploading CV data to Cloudflare KV...');
  
  execAsync(`npx wrangler kv:key put --binding=CV_DATA "cv" --path=${tempFilePath}`)
    .then(({ stdout }) => {
      console.log('Upload successful!');
      console.log(stdout);
      
      // Clean up the temporary file
      fs.unlinkSync(tempFilePath);
      
      console.log(`CV data uploaded with version ${cvData.meta.version}`);
    })
    .catch((error) => {
      console.error('Error uploading to Cloudflare KV:', error);
      
      // Clean up the temporary file
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      
      process.exit(1);
    });
  
} catch (error) {
  console.error('Error reading or parsing CV file:', error);
  process.exit(1);
}
