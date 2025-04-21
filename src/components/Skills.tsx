import { For, Show } from 'solid-js'
import type { Skill } from '@src/types'

/* Skills Section */
const SkillSection = (props: { data?: Skill[] }) => {
    // Use provided data or empty array as fallback
    const skills = () => props.data || []

    return (
        <section id="skills" class="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
            <div class="max-w-7xl mx-auto">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-quicksand font-bold text-white mb-4">
                        Technical Skills
                    </h2>
                    <div class="w-20 h-1 bg-[#FFD700] mx-auto rounded-full" />
                </div>

                <Show
                    when={skills().length > 0}
                    fallback={
                        <div class="text-center text-gray-400 py-12">
                            <p>Loading skills...</p>
                        </div>
                    }>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <For each={skills()}>
                            {(category, index) => (
                                <div
                                    style={{ 'animation-delay': `${index() * 200}ms` }}
                                    class="bg-gray-900 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow border border-gray-700 animate-scale-in opacity-0">
                                    <div class="flex flex-col items-center mb-6">
                                        <div class="h-12 w-12 text-[#FFD700]">{category.icon}</div>
                                        <h3 class="text-2xl font-quicksand font-bold text-white mt-4">
                                            {category.title}
                                        </h3>
                                    </div>
                                    <ul class="space-y-2">
                                        <For each={category.skills}>
                                            {(skill) => (
                                                <li class="text-gray-300 font-nunito flex items-center">
                                                    <span class="w-2 h-2 bg-[#FFD700] rounded-full mr-2" />
                                                    {skill}
                                                </li>
                                            )}
                                        </For>
                                    </ul>
                                </div>
                            )}
                        </For>
                    </div>
                </Show>
            </div>
        </section>
    )
}

export default SkillSection
