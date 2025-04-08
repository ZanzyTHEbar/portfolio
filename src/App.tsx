import Header from '@components/Header'
import Footer from '@components/Footer'
import Experience from '@components/Experience'
import Contact from '@components/Contact'
import Hero from '@components/Hero'
import About from '@components/About'
import ProjectSection from '@components/Projects'
import SkillSection from '@components/Skills'

const App = () => {
    return (
        <div class="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
            <Header />
            <Hero />
            <About />
            <ProjectSection />
            <SkillSection />
            <Experience />
            <Contact />
            <Footer />
        </div>
    )
}

export default App
