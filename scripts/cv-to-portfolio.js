#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';
import url from 'url';
import dotenv from 'dotenv';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env file
dotenv.config();

// Configuration
const CV_URL = process.env.CV_URL || 'file:///mnt/dragonnet/common/Projects/Personal/General/portfolios/zac/public/cv.json?v=1.0.0';
console.log('Using CV URL:', CV_URL);
const CACHE_DIR = path.join(__dirname, '../.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'cv-cache.json');
const OUTPUT_FILE = path.join(__dirname, '../src/static.tsx');

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

/**
 * Fetch data from a URL
 * @param {string} urlString - The URL to fetch data from
 * @returns {Promise<string>} - The response body
 */
function fetchData(urlString) {
  return new Promise((resolve, reject) => {
    // Handle file:// URLs
    if (urlString.startsWith('file://')) {
      try {
        const filePath = url.fileURLToPath(urlString.split('?')[0]);
        const data = fs.readFileSync(filePath, 'utf8');
        resolve(data);
      } catch (error) {
        reject(new Error(`Error reading file: ${error.message}`));
      }
      return;
    }

    // Handle http:// and https:// URLs
    const protocol = urlString.startsWith('https') ? https : http;

    protocol.get(urlString, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`Status Code: ${res.statusCode}`));
      }

      const data = [];
      res.on('data', (chunk) => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data).toString()));
    }).on('error', reject);
  });
}

/**
 * Extract version from URL
 * @param {string} url - The URL to extract version from
 * @returns {string} - The extracted version or the URL itself if no version found
 */
function extractVersionFromUrl(url) {
  const versionMatch = url.match(/[vV](\d+(\.\d+)*)/);
  if (versionMatch) {
    return versionMatch[1];
  }

  // If no version in URL format, use the URL itself as version identifier
  return url;
}

/**
 * Check if we need to update the data
 * @param {string} url - The URL to check
 * @returns {Promise<boolean>} - Whether we need to update
 */
async function needsUpdate(url) {
  const currentVersion = extractVersionFromUrl(url);

  try {
    if (fs.existsSync(CACHE_FILE)) {
      const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      return cache.version !== currentVersion;
    }
  } catch (error) {
    console.warn('Cache file read error, will fetch fresh data:', error.message);
  }

  return true;
}

/**
 * Transform CV data to portfolio format
 * @param {Object} cvData - The CV data
 * @returns {Object} - The portfolio data
 */
function transformCvToPortfolio(cvData) {
  // Transform experiences
  const experiences = (cvData.workExperience || []).map(job => ({
    title: job.position,
    company: job.company,
    period: `${job.startDate} - ${job.endDate || 'Present'}`,
    description: job.summary,
    achievements: job.highlights || []
  }));

  // Transform projects
  const projects = (cvData.projects || []).map(project => {
    // Determine icon based on project keywords or categories
    let iconName = 'Code2';
    if (project.keywords) {
      const keywords = project.keywords.map(k => k.toLowerCase());
      if (keywords.some(k => k.includes('ai') || k.includes('machine') || k.includes('ml'))) {
        iconName = 'Brain';
      } else if (keywords.some(k => k.includes('cloud') || k.includes('web') || k.includes('internet'))) {
        iconName = 'Globe';
      } else if (keywords.some(k => k.includes('security') || k.includes('crypto'))) {
        iconName = 'Lock';
      } else if (keywords.some(k => k.includes('terminal') || k.includes('cli') || k.includes('command'))) {
        iconName = 'Terminal';
      }
    }

    return {
      title: project.name,
      description: project.description,
      image: project.image || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}`,
      tags: project.keywords || [],
      icon: iconName,
      link: project.url || '#'
    };
  });

  // Transform skills
  const skillCategories = {};

  // Group skills by category
  (cvData.skills || []).forEach(skill => {
    const category = skill.category || 'Other';
    if (!skillCategories[category]) {
      skillCategories[category] = [];
    }
    skillCategories[category].push(skill.name);
  });

  // Map categories to skill objects
  const skills = Object.entries(skillCategories).map(([category, skillList]) => {
    // Determine icon based on category
    let iconName = 'Code2';
    if (category.toLowerCase().includes('ai') || category.toLowerCase().includes('machine')) {
      iconName = 'Brain';
    } else if (category.toLowerCase().includes('cloud') || category.toLowerCase().includes('devops')) {
      iconName = 'Terminal';
    } else if (category.toLowerCase().includes('system') || category.toLowerCase().includes('architecture')) {
      iconName = 'Code2';
    }

    return {
      icon: iconName,
      title: category,
      skills: skillList
    };
  });

  return {
    experiences,
    projects,
    skills
  };
}

/**
 * Generate static.tsx content
 * @param {Object} portfolioData - The portfolio data
 * @returns {string} - The content for static.tsx
 */
function generateStaticTsx(portfolioData) {
  const { experiences, projects, skills } = portfolioData;

  // Create a set of all icons used
  const icons = new Set();
  projects.forEach(project => icons.add(project.icon));
  skills.forEach(skill => icons.add(skill.icon));

  // Convert icon names to actual JSX elements in the output
  const projectsWithJsxIcons = projects.map(project => ({
    ...project,
    icon: `<${project.icon} class="h-6 w-6" />`
  }));

  const skillsWithJsxIcons = skills.map(skill => ({
    ...skill,
    icon: `<${skill.icon} class="h-12 w-12 text-[#FFD700]" />`
  }));

  return `// This file is auto-generated from CV data. Do not edit manually.
import { ${Array.from(icons).join(', ')} } from 'lucide-solid'
import type { Experience, Project, Skill } from './types'

export const Experiences: Experience[] = ${JSON.stringify(experiences, null, 2)
      .replace(/"([^"]+)":/g, '$1:')
      .replace(/\n/g, '\n    ')}

export const Projects: Project[] = ${JSON.stringify(projectsWithJsxIcons, null, 2)
      .replace(/"([^"]+)":/g, '$1:')
      .replace(/"<([^>]+)>"/g, '<$1>')
      .replace(/\n/g, '\n    ')}

export const Skills: Skill[] = ${JSON.stringify(skillsWithJsxIcons, null, 2)
      .replace(/"([^"]+)":/g, '$1:')
      .replace(/"<([^>]+)>"/g, '<$1>')
      .replace(/\n/g, '\n    ')}
`;
}

/**
 * Main function
 */
async function main() {
  try {
    const url = CV_URL;
    console.log(`Checking CV data from: ${url}`);

    // Check if we need to update
    const shouldUpdate = await needsUpdate(url);
    if (!shouldUpdate) {
      console.log('CV data is up to date, skipping update');
      return;
    }

    console.log('Fetching CV data...');
    const data = await fetchData(url);
    const cvData = JSON.parse(data);

    // Transform CV data to portfolio format
    console.log('Transforming CV data to portfolio format...');
    const portfolioData = transformCvToPortfolio(cvData);

    // Generate static.tsx content
    console.log('Generating static.tsx...');
    const staticTsxContent = generateStaticTsx(portfolioData);

    // Write to static.tsx
    fs.writeFileSync(OUTPUT_FILE, staticTsxContent);
    console.log(`Successfully wrote to ${OUTPUT_FILE}`);

    // Update cache
    const cache = {
      version: extractVersionFromUrl(url),
      lastUpdated: new Date().toISOString(),
      url
    };
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
    console.log('Updated cache file');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the main function
main();
