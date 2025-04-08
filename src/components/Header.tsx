import { For, createSignal, Show } from 'solid-js'
import { BrainCircuit as Circuit, Menu, X } from 'lucide-solid'
import { Transition } from 'solid-transition-group'

/* Header */
const Header = () => {
    const menuItems: string[] = ['About', 'Projects', 'Skills', 'Experience', 'Contact']
    const [isMenuOpen, setIsMenuOpen] = createSignal(false)

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen())
    const closeMenu = () => setIsMenuOpen(false)

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

                    {/* Desktop Menu */}
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

                    {/* Mobile Menu Button */}
                    <div class="md:hidden">
                        <button
                            onClick={toggleMenu}
                            class="text-gray-300 hover:text-[#FFD700] transition-colors"
                            aria-label="Toggle menu">
                            {isMenuOpen() ? <X class="h-6 w-6" /> : <Menu class="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            <Transition
                enterActiveClass="transition-all duration-300 ease-out"
                enterClass="opacity-0 max-h-0"
                enterToClass="opacity-100 max-h-96"
                exitActiveClass="transition-all duration-200 ease-in"
                exitClass="opacity-100 max-h-96"
                exitToClass="opacity-0 max-h-0"
                appear={true}>
                <Show when={isMenuOpen()}>
                    <div class="md:hidden bg-gray-800/95 backdrop-blur-sm overflow-hidden">
                        <div class="px-4 py-3 space-y-1 border-t border-gray-700">
                            <For each={menuItems}>
                                {(item) => (
                                    <a
                                        href={`#${item.toLowerCase()}`}
                                        class="block py-2 px-3 text-base font-nunito text-gray-300 hover:text-[#FFD700] hover:bg-gray-700/50 rounded-lg transition-colors"
                                        onClick={closeMenu}>
                                        {item}
                                    </a>
                                )}
                            </For>
                        </div>
                    </div>
                </Show>
            </Transition>
        </header>
    )
}

export default Header
