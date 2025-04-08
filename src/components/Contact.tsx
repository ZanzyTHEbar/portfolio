import { useFormHandler, type FormHandler } from 'solid-form-handler'
import { zodSchema } from 'solid-form-handler/zod'
import { createSignal, Show } from 'solid-js'
import { z } from 'zod'

// Import icons
import { Github, Linkedin, X, CheckCircleIcon, AlertCircleIcon } from 'lucide-solid'

// Define the contact form schema using zod
const contactSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Please enter a valid email address'),
    message: z.string().min(10, 'Message must be at least 10 characters long'),
})

// Define the type for our form data
type ContactFormData = z.infer<typeof contactSchema>

/* Form Field Component */
const FormField = (props: {
    name: keyof ContactFormData
    label: string
    type?: string
    rows?: number
    formHandler: FormHandler<ContactFormData>
}) => {
    const { name, label, type = 'text', rows, formHandler } = props
    const { formData, getFieldError, touchField } = formHandler
    const error = () => getFieldError(name)

    // Common classes for input fields
    const baseInputClass =
        'mt-1 block w-full bg-gray-900 border-gray-700 text-white shadow-sm focus:ring focus:ring-opacity-50'
    const validClass = 'focus:border-[#FFD700] focus:ring-[#FFD700]'
    const errorClass = 'border-red-500 focus:border-red-500 focus:ring-red-500'

    const inputClass = () => {
        return `${baseInputClass} ${error() ? errorClass : validClass} ${
            type === 'textarea' ? 'rounded-3xl' : 'rounded-full'
        }`
    }

    return (
        <div>
            <label for={name} class="block text-sm font-medium text-gray-300 font-nunito">
                {label}
            </label>
            <Show
                when={type === 'textarea'}
                fallback={
                    <input
                        type={type}
                        id={name}
                        name={name}
                        class={inputClass()}
                        value={formData()[name]?.toString() || ''}
                        onInput={(e) => formHandler.setFieldValue(name, e.currentTarget.value)}
                        onBlur={() => touchField(name)}
                    />
                }>
                <textarea
                    id={name}
                    name={name}
                    rows={rows || 4}
                    class={inputClass()}
                    value={formData()[name]?.toString() || ''}
                    onInput={(e) => formHandler.setFieldValue(name, e.currentTarget.value)}
                    onBlur={() => touchField(name)}
                />
            </Show>
            <Show when={error()}>
                <p class="mt-1 text-sm text-red-500">{error()}</p>
            </Show>
        </div>
    )
}

/* Contact Section */
const Contact = () => {
    const [formStatus, setFormStatus] = createSignal<'idle' | 'loading' | 'success' | 'error'>(
        'idle',
    )
    const [statusMessage, setStatusMessage] = createSignal('')

    // Initialize form handler with zod schema
    const formHandler = useFormHandler<ContactFormData>(zodSchema(contactSchema))
    const { formData, resetForm } = formHandler

    // Check if form is valid
    const isFormValid = () => Object.keys(formHandler.getFormErrors()).length === 0

    const handleSubmit = async (e: Event) => {
        e.preventDefault()

        try {
            // Validate the form
            await formHandler.validateForm()

            if (isFormValid()) {
                // Set loading state
                setFormStatus('loading')

                // Send the form data to our serverless function
                const response = await fetch('/submit-form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData()),
                })

                const result = await response.json()

                if (result.success) {
                    // Show success message
                    setFormStatus('success')
                    setStatusMessage(
                        result.message ||
                            "Your message has been sent successfully! We'll get back to you soon.",
                    )
                    resetForm()
                } else {
                    // Show error message
                    setFormStatus('error')
                    setStatusMessage(
                        result.message ||
                            'There was an error sending your message. Please try again.',
                    )
                }

                // Reset status after 5 seconds
                setTimeout(() => setFormStatus('idle'), 5000)
            }
        } catch (error) {
            console.error('Submission error:', error)
            setFormStatus('error')
            setStatusMessage('There was an error sending your message. Please try again.')

            // Reset error status after 5 seconds
            setTimeout(() => setFormStatus('idle'), 5000)
        }
    }

    return (
        <section id="contact" class="py-20 px-4 sm:px-6 lg:px-8">
            <div class="max-w-7xl mx-auto">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-quicksand font-bold text-white mb-4">
                        Let's Innovate Together
                    </h2>
                    <div class="w-20 h-1 bg-[#FFD700] mx-auto rounded-full" />
                </div>
                <div class="bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12 border border-gray-700 animate-fade-in">
                    <div class="max-w-3xl mx-auto">
                        <Show when={formStatus() === 'loading'}>
                            <div class="mb-6 p-4 bg-blue-900/30 border border-blue-700 rounded-xl flex items-center gap-3 text-blue-400">
                                <div class="animate-spin h-5 w-5 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                                <p>Sending your message...</p>
                            </div>
                        </Show>

                        <Show when={formStatus() === 'success'}>
                            <div class="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-xl flex items-center gap-3 text-green-400">
                                <CheckCircleIcon class="h-5 w-5 flex-shrink-0" />
                                <p>{statusMessage()}</p>
                            </div>
                        </Show>

                        <Show when={formStatus() === 'error'}>
                            <div class="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-xl flex items-center gap-3 text-red-400">
                                <AlertCircleIcon class="h-5 w-5 flex-shrink-0" />
                                <p>{statusMessage()}</p>
                            </div>
                        </Show>

                        <form class="space-y-6 animate-slide-up delay-200" onSubmit={handleSubmit}>
                            <FormField name="name" label="Name" formHandler={formHandler} />
                            <FormField
                                name="email"
                                label="Email"
                                type="email"
                                formHandler={formHandler}
                            />
                            <FormField
                                name="message"
                                label="Message"
                                type="textarea"
                                rows={4}
                                formHandler={formHandler}
                            />
                            <button
                                type="submit"
                                class="w-full bg-[#FFD700] text-gray-900 px-8 py-3 rounded-full font-nunito hover:bg-[#FFC800] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                disabled={!isFormValid() || formStatus() === 'loading'}>
                                Send Message
                            </button>
                        </form>
                        <div class="mt-12 flex justify-center space-x-6 animate-fade-in delay-300">
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
