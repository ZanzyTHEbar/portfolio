import { Suspense } from 'solid-js'
import { lazyLoad } from './utils/lazyLoad'

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
    return (
        <div class="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
            <Header />
            <Hero />
            <Suspense fallback={<LoadingFallback />}>
                <About />
            </Suspense>
            <Suspense fallback={<LoadingFallback />}>
                <ProjectSection />
            </Suspense>
            <Suspense fallback={<LoadingFallback />}>
                <SkillSection />
            </Suspense>
            <Suspense fallback={<LoadingFallback />}>
                <Experience />
            </Suspense>
            <Suspense fallback={<LoadingFallback />}>
                <Contact />
            </Suspense>
            <Suspense fallback={<LoadingFallback />}>
                <Footer />
            </Suspense>
        </div>
    )
}

export default App
