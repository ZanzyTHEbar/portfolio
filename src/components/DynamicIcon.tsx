import { Component, createResource, Show } from 'solid-js';
import { Code } from 'lucide-solid'; // Default fallback icon

interface DynamicIconProps {
  name: string;
  class?: string;
  size?: number;
}

const DynamicIcon: Component<DynamicIconProps> = (props) => {
  // Dynamically import the icon
  const [icon] = createResource(
    () => props.name,
    async (iconName) => {
      try {
        // Convert PascalCase to kebab-case for import
        const kebabName = iconName
          .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
          .toLowerCase();
        
        const module = await import(`lucide-solid/icons/${kebabName}`);
        return module.default;
      } catch (error) {
        console.error(`Error loading icon: ${iconName}`, error);
        return Code; // Fallback icon
      }
    }
  );

  return (
    <Show when={!icon.loading} fallback={<div class={props.class || 'h-6 w-6'} />}>
      {icon() && 
        <icon().default 
          class={props.class || 'h-6 w-6'} 
          size={props.size} 
        />
      }
    </Show>
  );
};

export default DynamicIcon;
