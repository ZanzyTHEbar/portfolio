import { Github, Linkedin, X } from 'lucide-solid'

/* Contact Section */
const Contact = () => {
    return (
        <section id="contact" class="py-20 px-4 sm:px-6 lg:px-8">
            <div class="max-w-7xl mx-auto">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-quicksand font-bold text-white mb-4">
                        Let's Innovate Together
                    </h2>
                    <div class="w-20 h-1 bg-[#FFD700] mx-auto rounded-full" />
                </div>
                <div class="bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12 border border-gray-700">
                    <div class="max-w-3xl mx-auto">
                        <form class="space-y-6">
                            <div>
                                <label
                                    for="name"
                                    class="block text-sm font-medium text-gray-300 font-nunito">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    class="mt-1 block w-full rounded-full bg-gray-900 border-gray-700 text-white shadow-sm focus:border-[#FFD700] focus:ring focus:ring-[#FFD700] focus:ring-opacity-50"
                                />
                            </div>
                            <div>
                                <label
                                    for="email"
                                    class="block text-sm font-medium text-gray-300 font-nunito">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    class="mt-1 block w-full rounded-full bg-gray-900 border-gray-700 text-white shadow-sm focus:border-[#FFD700] focus:ring focus:ring-[#FFD700] focus:ring-opacity-50"
                                />
                            </div>
                            <div>
                                <label
                                    for="message"
                                    class="block text-sm font-medium text-gray-300 font-nunito">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    class="mt-1 block w-full rounded-3xl bg-gray-900 border-gray-700 text-white shadow-sm focus:border-[#FFD700] focus:ring focus:ring-[#FFD700] focus:ring-opacity-50"
                                />
                            </div>
                            <button
                                type="submit"
                                class="w-full bg-[#FFD700] text-gray-900 px-8 py-3 rounded-full font-nunito hover:bg-[#FFC800] transition-colors">
                                Send Message
                            </button>
                        </form>
                        <div class="mt-12 flex justify-center space-x-6">
                            <a href="#" class="text-gray-400 hover:text-[#FFD700]">
                                <Github class="h-8 w-8" />
                            </a>
                            <a href="#" class="text-gray-400 hover:text-[#FFD700]">
                                <Linkedin class="h-8 w-8" />
                            </a>
                            <a href="#" class="text-gray-400 hover:text-[#FFD700]">
                                <X class="h-8 w-8" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Contact
