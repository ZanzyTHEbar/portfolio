import { Suspense, createEffect, onMount } from 'solid-js'
import { lazyLoad } from './utils/lazyLoad'
import { usePortfolioData } from './utils/cvDataFetcher'

// Only import Header and Hero eagerly for fast initial load
import Header from '@components/Header'
import Hero from '@components/Hero'

// Lazy load other components
const About = lazyLoad(() => import('@components/About'))
const ProjectSection = lazyLoad(() => import('@components/Projects'))
const SkillSection = lazyLoad(() => import('@components/Skills'))
const Experience = lazyLoad(() => import('@components/Experience'))
const Contact = lazyLoad(() => import('@components/Contact'))
const Footer = lazyLoad(() => import('@components/Footer'))

// Loading fallback component
const LoadingFallback = () => (
    <div class="flex justify-center items-center py-12">
        <div class="animate-spin h-8 w-8 border-4 border-[#FFD700] border-t-transparent rounded-full"></div>
    </div>
)

const App = () => {
    // Fetch portfolio data
    const { data: portfolioData, loading, error, checkForUpdates } = usePortfolioData()

    // Check for updates periodically
    onMount(() => {
        // Check for updates every 5 minutes
        const updateInterval = setInterval(
            () => {
                checkForUpdates()
            },
            5 * 60 * 1000,
        )

        // Clean up interval on unmount
        return () => clearInterval(updateInterval)
    })

    // Create a context effect to log data loading
    createEffect(() => {
        if (loading()) {
            console.log('Loading portfolio data...')
        } else if (error()) {
            console.error('Error loading portfolio data:', error())
        } else if (portfolioData()) {
            console.log('Portfolio data loaded, version:', portfolioData()?.meta.version)
        }
    })

    return (
        <div class="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
            <Header />
            <Hero />
            <Suspense fallback={<LoadingFallback />}>
                <About />
            </Suspense>
            <Suspense fallback={<LoadingFallback />}>
                <ProjectSection data={portfolioData()?.projects} />
            </Suspense>
            <Suspense fallback={<LoadingFallback />}>
                <SkillSection data={portfolioData()?.skills} />
            </Suspense>
            <Suspense fallback={<LoadingFallback />}>
                <Experience data={portfolioData()?.experiences} />
            </Suspense>
            <Suspense fallback={<LoadingFallback />}>
                <Contact />
            </Suspense>
            <Suspense fallback={<LoadingFallback />}>
                <Footer
                    version={portfolioData()?.meta.version}
                    lastUpdated={portfolioData()?.meta.lastUpdated}
                />
            </Suspense>
        </div>
    )
}

export default App
