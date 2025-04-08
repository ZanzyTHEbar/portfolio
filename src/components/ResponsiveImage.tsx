import { createEffect, createSignal, onCleanup, onMount } from 'solid-js'

interface ResponsiveImageProps {
  src: string
  alt: string
  class?: string
  sizes?: string
  loading?: 'lazy' | 'eager'
  width?: number
  height?: number
}

const ResponsiveImage = (props: ResponsiveImageProps) => {
  const [isLoaded, setIsLoaded] = createSignal(false)
  const [isInView, setIsInView] = createSignal(false)
  let imageRef: HTMLImageElement | undefined
  let observer: IntersectionObserver | undefined

  // Default sizes if not provided
  const sizes = props.sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
  
  // Generate srcset for responsive images
  const generateSrcSet = (src: string) => {
    // If it's an external URL that doesn't support width parameters, return the original
    if (src.startsWith('http') && !src.includes('unsplash.com')) {
      return src
    }
    
    // For Unsplash images, we can use their API to get different sizes
    if (src.includes('unsplash.com')) {
      // Extract the base URL without any existing width/height parameters
      const baseUrl = src.split('?')[0]
      
      // Generate srcset with different widths
      return [
        `${baseUrl}?w=480&auto=format&q=75 480w`,
        `${baseUrl}?w=800&auto=format&q=75 800w`,
        `${baseUrl}?w=1200&auto=format&q=75 1200w`,
        `${baseUrl}?w=1600&auto=format&q=75 1600w`
      ].join(', ')
    }
    
    // For local images, we would need to have pre-generated different sizes
    // This is a simplified version that assumes the original image is used
    return src
  }

  onMount(() => {
    if (!imageRef) return
    
    // Set up intersection observer for lazy loading
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true)
          observer?.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    
    observer.observe(imageRef)
  })
  
  onCleanup(() => {
    observer?.disconnect()
  })
  
  // Handle image load event
  const handleLoad = () => {
    setIsLoaded(true)
  }

  return (
    <div class={`relative overflow-hidden ${props.class || ''}`}>
      {/* Low quality placeholder or blur-up effect */}
      {!isLoaded() && (
        <div class="absolute inset-0 bg-gray-800 animate-pulse"></div>
      )}
      
      <img
        ref={imageRef}
        src={props.src}
        alt={props.alt}
        srcset={isInView() ? generateSrcSet(props.src) : undefined}
        sizes={sizes}
        loading={props.loading || 'lazy'}
        width={props.width}
        height={props.height}
        onLoad={handleLoad}
        class={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded() ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}

export default ResponsiveImage
