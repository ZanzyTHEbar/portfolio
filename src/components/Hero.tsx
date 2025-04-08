/* Hero Section */
//import heroImage from 'img/hero.jpg'

const Hero = () => {
    return (
        <section
            class="relative h-screen flex items-center justify-center"
            style={{
                //'background-image': `url("${heroImage}")`,
                'background-image':
                    'url("https://images.unsplash.com/photo-1617839625591-e5a789593135?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
                'background-size': 'cover',
                'background-position': 'center',
            }}>
            <div class="absolute inset-0 bg-gray-900/80" />
            <div class="relative text-center text-white z-10">
                <h1 class="text-5xl md:text-7xl font-quicksand font-bold mb-4 animate-fade-in">
                    Zacariah Heim
                </h1>
                <p class="text-xl md:text-2xl font-nunito mb-8 text-gray-300 animate-slide-up delay-200">
                    Tech Innovator | AI Consultant | Systems Architect
                </p>
                <a
                    href="#contact"
                    class="bg-[#FFD700] text-gray-900 px-8 py-3 rounded-full font-nunito hover:bg-[#FFC800] transition-colors animate-scale-in delay-400 inline-block">
                    Connect Now
                </a>
            </div>
        </section>
    )
}

export default Hero
