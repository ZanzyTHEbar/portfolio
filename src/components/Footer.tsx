import { Show } from 'solid-js'

/* Footer */
const Footer = (props: { version?: string; lastUpdated?: string }) => {
    // Format the last updated date if available
    const formattedDate = () => {
        if (!props.lastUpdated) return ''

        try {
            const date = new Date(props.lastUpdated)
            return date.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
        } catch (e) {
            return props.lastUpdated
        }
    }

    return (
        <footer class="bg-gray-900 text-white py-8 border-t border-gray-800">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p class="font-nunito text-gray-400">
                    © {new Date().getFullYear()} Zacariah Heim. All rights reserved.
                </p>

                <Show when={props.version}>
                    <p class="font-nunito text-gray-500 text-sm mt-2">
                        CV Version: {props.version}
                        <Show when={formattedDate()}>
                            <span class="mx-1">•</span>
                            Last Updated: {formattedDate()}
                        </Show>
                    </p>
                </Show>
            </div>
        </footer>
    )
}

export default Footer
