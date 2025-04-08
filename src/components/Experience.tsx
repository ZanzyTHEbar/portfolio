import { For, Show } from 'solid-js'
import type { Experience as ExperienceType } from '@src/types'

/* Experience Section */
const Experience = (props: { data?: ExperienceType[] }) => {
    // Use provided data or empty array as fallback
    const experiences = () => props.data || [];
    
    return (
        <section id="experience" class="py-20 px-4 sm:px-6 lg:px-8">
            <div class="max-w-7xl mx-auto">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-quicksand font-bold text-white mb-4">
                        Professional Experience
                    </h2>
                    <div class="w-20 h-1 bg-[#FFD700] mx-auto rounded-full" />
                </div>
                
                <Show when={experiences().length > 0} fallback={
                    <div class="text-center text-gray-400 py-12">
                        <p>Loading experience...</p>
                    </div>
                }>
                    <div class="space-y-8">
                        <For each={experiences()}>
                            {(job, index) => (
                                <div
                                    style={{ 'animation-delay': `${index() * 200}ms` }}
                                    class="bg-gray-800 rounded-3xl p-8 border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 animate-slide-up opacity-0">
                                    <div class="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                        <div>
                                            <h3 class="text-2xl font-quicksand font-bold text-white">
                                                {job.title}
                                            </h3>
                                            <p class="text-[#FFD700] font-nunito">{job.company}</p>
                                        </div>
                                        <div class="mt-2 md:mt-0">
                                            <span class="bg-gray-900 text-gray-300 px-4 py-1 rounded-full font-nunito">
                                                {job.period}
                                            </span>
                                        </div>
                                    </div>
                                    <p class="text-gray-300 font-nunito mb-4">{job.description}</p>
                                    <div class="border-t border-gray-700 pt-4 mt-4">
                                        <h4 class="text-lg font-quicksand font-bold text-white mb-2">
                                            Key Achievements
                                        </h4>
                                        <ul class="space-y-2">
                                            <For each={job.achievements}>
                                                {(achievement) => (
                                                    <li class="text-gray-300 font-nunito flex items-start">
                                                        <span class="text-[#FFD700] mr-2">•</span>
                                                        {achievement}
                                                    </li>
                                                )}
                                            </For>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </For>
                    </div>
                </Show>
            </div>
        </section>
    )
}

export default Experience
