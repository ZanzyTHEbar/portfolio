import { createResource, createSignal } from 'solid-js';
import type { Experience, Project, Skill } from '../types';

// Configuration
const CV_API_URL = import.meta.env.VITE_CV_API_URL || 'https://cv-api.yourdomain.workers.dev';

// Types for the API response
interface PortfolioData {
  experiences: Experience[];
  projects: Project[];
  skills: Skill[];
  meta: {
    version: string;
    lastUpdated: string;
  };
}

// Function to transform icon names to JSX elements
function transformIconNames(data: PortfolioData): PortfolioData {
  // Import icons dynamically
  const importIcon = async (iconName: string) => {
    try {
      const module = await import(`lucide-solid/dist/esm/icons/${iconName.toLowerCase()}`);
      return module.default;
    } catch (error) {
      console.error(`Error importing icon: ${iconName}`, error);
      // Fallback to a default icon
      const fallbackModule = await import('lucide-solid/dist/esm/icons/code');
      return fallbackModule.default;
    }
  };

  // Create a new object with transformed data
  return {
    ...data,
    projects: data.projects.map(project => ({
      ...project,
      // We'll handle the icon transformation in the component
      iconName: project.icon as unknown as string,
    })),
    skills: data.skills.map(skill => ({
      ...skill,
      // We'll handle the icon transformation in the component
      iconName: skill.icon as unknown as string,
    })),
  };
}

// Function to fetch portfolio data
export function usePortfolioData() {
  const [lastFetched, setLastFetched] = createSignal<Date | null>(null);
  
  // Create a resource to fetch the data
  const [portfolioData, { refetch }] = createResource<PortfolioData>(
    async () => {
      try {
        const response = await fetch(`${CV_API_URL}/portfolio-data.json`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch portfolio data: ${response.statusText}`);
        }
        
        const data = await response.json();
        setLastFetched(new Date());
        
        return transformIconNames(data);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        // Return empty data as fallback
        return {
          experiences: [],
          projects: [],
          skills: [],
          meta: {
            version: '0.0.0',
            lastUpdated: new Date().toISOString(),
          },
        };
      }
    },
    { initialValue: undefined }
  );
  
  // Function to check for updates
  const checkForUpdates = async () => {
    try {
      const response = await fetch(`${CV_API_URL}/version`);
      
      if (!response.ok) {
        return false;
      }
      
      const { version, lastUpdated } = await response.json();
      
      // If we have data and the version is different, refetch
      if (portfolioData() && portfolioData()?.meta.version !== version) {
        refetch();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking for updates:', error);
      return false;
    }
  };
  
  return {
    data: portfolioData,
    loading: () => portfolioData.loading,
    error: () => portfolioData.error,
    refetch,
    lastFetched,
    checkForUpdates,
  };
}
