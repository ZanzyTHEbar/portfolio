import { ExternalLink } from 'lucide-solid'
import { For, Show } from 'solid-js'
import type { Project } from '@src/types'
import ResponsiveImage from './ResponsiveImage'

/* Projects Section */
const ProjectSection = (props: { data?: Project[] }) => {
    // Use provided data or empty array as fallback
    const projects = () => props.data || []

    return (
        <section id="projects" class="py-20 px-4 sm:px-6 lg:px-8">
            <div class="max-w-7xl mx-auto">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-quicksand font-bold text-white mb-4">
                        Featured Projects
                    </h2>
                    <div class="w-20 h-1 bg-[#FFD700] mx-auto rounded-full" />
                </div>

                <Show
                    when={projects().length > 0}
                    fallback={
                        <div class="text-center text-gray-400 py-12">
                            <p>Loading projects...</p>
                        </div>
                    }>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <For each={projects()}>
                            {(project, projectIndex) => (
                                <div
                                    data-index={projectIndex()}
                                    style={{ 'animation-delay': `${projectIndex() * 150}ms` }}
                                    class="bg-gray-800 rounded-3xl overflow-hidden border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group animate-slide-up opacity-0">
                                    <div class="relative h-48 overflow-hidden">
                                        <ResponsiveImage
                                            src={project.image}
                                            alt={project.title}
                                            class="transform group-hover:scale-110 transition-transform duration-300"
                                            loading={projectIndex() < 2 ? 'eager' : 'lazy'}
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                        <div class="absolute inset-0 bg-gray-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <a
                                                href={project.link}
                                                class="bg-[#FFD700] text-gray-900 px-6 py-2 rounded-full font-nunito hover:bg-[#FFC800] transition-colors flex items-center gap-2">
                                                View Project <ExternalLink class="h-4 w-4" />
                                            </a>
                                        </div>
                                    </div>
                                    <div class="p-6">
                                        <div class="flex items-center gap-2 mb-3">
                                            <div class="h-6 w-6">{project.icon}</div>
                                            <h3 class="text-xl font-quicksand font-bold text-white">
                                                {project.title}
                                            </h3>
                                        </div>
                                        <p class="text-gray-300 font-nunito mb-4">
                                            {project.description}
                                        </p>
                                        <div class="flex flex-wrap gap-2">
                                            <For each={project.tags}>
                                                {(tag, tagIndex) => (
                                                    <span
                                                        data-index={tagIndex()}
                                                        class="px-3 py-1 bg-gray-900 text-gray-300 rounded-full text-sm font-nunito">
                                                        {tag}
                                                    </span>
                                                )}
                                            </For>
                                        </div>
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

export default ProjectSection
