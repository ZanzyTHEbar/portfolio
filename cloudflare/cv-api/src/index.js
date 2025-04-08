/**
 * Cloudflare Worker to serve CV data as JSON
 * 
 * This worker:
 * 1. Retrieves CV data from KV storage
 * 2. Transforms it into the required format
 * 3. Serves it with proper caching headers
 */

// Define the portfolio data structure transformer
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
    skills,
    meta: cvData.meta || { version: '1.0.0', lastUpdated: new Date().toISOString() }
  };
}

export default {
  async fetch(request, env, ctx) {
    // Set up CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle OPTIONS request for CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    // Only allow GET requests
    if (request.method !== 'GET') {
      return new Response('Method Not Allowed', {
        status: 405,
        headers: {
          ...corsHeaders,
          'Allow': 'GET, OPTIONS'
        }
      });
    }

    try {
      // Get the URL path
      const url = new URL(request.url);
      const path = url.pathname;

      // Serve raw CV data at /cv.json
      if (path === '/cv.json') {
        // Get CV data from KV
        const cvData = await env.CV_DATA.get('cv', { type: 'json' });
        
        if (!cvData) {
          return new Response('CV data not found', {
            status: 404,
            headers: corsHeaders
          });
        }

        // Return the raw CV data
        return new Response(JSON.stringify(cvData), {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
          }
        });
      }
      
      // Serve transformed portfolio data at /portfolio-data.json
      if (path === '/portfolio-data.json') {
        // Get CV data from KV
        const cvData = await env.CV_DATA.get('cv', { type: 'json' });
        
        if (!cvData) {
          return new Response('CV data not found', {
            status: 404,
            headers: corsHeaders
          });
        }

        // Transform CV data to portfolio format
        const portfolioData = transformCvToPortfolio(cvData);

        // Return the transformed data
        return new Response(JSON.stringify(portfolioData), {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
          }
        });
      }

      // Serve version info at /version
      if (path === '/version') {
        // Get CV data from KV
        const cvData = await env.CV_DATA.get('cv', { type: 'json' });
        
        if (!cvData || !cvData.meta) {
          return new Response(JSON.stringify({ version: '1.0.0' }), {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
              'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
            }
          });
        }

        // Return just the version info
        return new Response(JSON.stringify({ 
          version: cvData.meta.version || '1.0.0',
          lastUpdated: cvData.meta.lastUpdated || new Date().toISOString()
        }), {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
          }
        });
      }

      // Default response for other paths
      return new Response('Not Found', {
        status: 404,
        headers: corsHeaders
      });
    } catch (error) {
      // Handle errors
      return new Response(`Error: ${error.message}`, {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};
