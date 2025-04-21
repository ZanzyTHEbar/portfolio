// Cloudflare Pages Function to handle contact form submissions
export async function onRequest(context: any) {
    const { request, env } = context

    // Only allow POST requests
    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 })
    }

    try {
        const data = await request.json()
        const { name, email, message } = data

        // Basic validation
        if (!name || !email || !message) {
            return new Response(
                JSON.stringify({ success: false, message: 'All fields are required.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            )
        }

        const webhookUrl = env.GOOGLE_WEBHOOK_URL as string;
        if (!webhookUrl) {
            return new Response(
                JSON.stringify({ success: false, message: 'Server misconfiguration: missing webhook URL.' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const gasResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message }),
        });
        const gasResult = await gasResponse.json();
        if (!gasResponse.ok || !gasResult.success) {
            return new Response(
                JSON.stringify({ success: false, message: gasResult.message || 'Failed to submit form.' }),
                { status: 502, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, message: 'Your message has been sent successfully!' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
    } catch (err) {
        console.error('Submission error:', err)
        return new Response(
            JSON.stringify({ success: false, message: 'Internal Server Error.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
}
