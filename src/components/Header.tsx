import { For } from 'solid-js'
import { BrainCircuit as Circuit } from 'lucide-solid'

/* Header */
const Header = () => {
    const menuItems: string[] = ['About', 'Projects', 'Skills', 'Experience', 'Contact']

    return (
        <header class="fixed w-full bg-gray-900/90 backdrop-blur-sm z-50 border-b border-gray-700">
            <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16 items-center">
                    <div class="flex items-center">
                        <Circuit class="h-8 w-8 text-[#FFD700]" />
                        <span class="ml-2 text-xl font-quicksand font-bold text-white">
                            Zacariah
                        </span>
                    </div>
                    <div class="hidden md:flex space-x-8">
                        <For each={menuItems}>
                            {(item, index) => (
                                <a
                                    data-index={index()}
                                    href={`#${item.toLowerCase()}`}
                                    class="text-gray-300 hover:text-[#FFD700] transition-colors font-nunito">
                                    {item}
                                </a>
                            )}
                        </For>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Header
