import { For } from 'solid-js'
import { Experiences } from '@src/static'
import { Briefcase, Calendar } from 'lucide-solid'

/* Experience Section */
const Experience = () => {
    return (
        <>
            <section id="experience" class="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-quicksand font-bold text-white mb-4">
                        Professional Journey
                    </h2>
                    <div class="w-20 h-1 bg-[#FFD700] mx-auto rounded-full" />
                </div>
                <div class="space-y-8">
                    <For each={Experiences}>
                        {(experience, index) => (
                            <div
                                data-index={index()}
                                style={{ 'animation-delay': `${index() * 200}ms` }}
                                class="bg-gray-800 rounded-3xl p-8 border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 animate-slide-up opacity-0">
                                <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                                    <div>
                                        <div class="flex items-center gap-2">
                                            <Briefcase class="h-6 w-6 text-[#FFD700]" />
                                            <h3 class="text-2xl font-quicksand font-bold text-white">
                                                {experience.title}
                                            </h3>
                                        </div>
                                        <p class="text-lg text-[#FFD700] font-nunito mt-2">
                                            {experience.company}
                                        </p>
                                    </div>
                                    <div class="flex items-center gap-2 mt-2 md:mt-0">
                                        <Calendar class="h-5 w-5 text-gray-400" />
                                        <span class="text-gray-400 font-nunito">
                                            {experience.period}
                                        </span>
                                    </div>
                                </div>
                                <p class="text-gray-300 font-nunito mb-6">
                                    {experience.description}
                                </p>
                                <ul class="space-y-3">
                                    <For each={experience.achievements}>
                                        {(achievement, achievementIndex) => (
                                            <li
                                                data-index={achievementIndex()}
                                                class="flex items-start gap-2 text-gray-300 font-nunito">
                                                <span class="text-[#FFD700] mt-1">•</span>
                                                {achievement}
                                            </li>
                                        )}
                                    </For>
                                </ul>
                            </div>
                        )}
                    </For>
                </div>
            </section>
        </>
    )
}

export default Experience
