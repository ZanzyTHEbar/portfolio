import { For } from 'solid-js'
import { Skills } from '@src/static'

/* Skills Section */
const SkillSection = () => {
    return (
        <section id="skills" class="py-20 bg-gray-800">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-quicksand font-bold text-white mb-4">
                        Technical Expertise
                    </h2>
                    <div class="w-20 h-1 bg-[#FFD700] mx-auto rounded-full" />
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <For each={Skills}>
                        {(category) => (
                            <div
                                data-key={category.title}
                                class="bg-gray-900 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow border border-gray-700">
                                <div class="flex flex-col items-center">
                                    {category.icon}
                                    <h3 class="text-2xl font-quicksand font-bold mt-4 mb-6 text-white">
                                        {category.title}
                                    </h3>
                                    <ul class="space-y-2">
                                        <For each={category.skills}>
                                            {(skill) => (
                                                <li
                                                    data-key={skill}
                                                    class="font-nunito text-gray-300">
                                                    {skill}
                                                </li>
                                            )}
                                        </For>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </For>
                </div>
            </div>
        </section>
    )
}

export default SkillSection
