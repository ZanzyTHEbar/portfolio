// Cloudflare Function to handle form submissions
export async function onRequest(context) {
  try {
    // Only allow POST requests
    if (context.request.method !== "POST") {
      return new Response(JSON.stringify({ success: false, message: "Method not allowed" }), {
        status: 405,
        headers: {
          "Content-Type": "application/json",
          "Allow": "POST"
        }
      });
    }

    // Parse the request body
    const formData = await context.request.json();

    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      return new Response(JSON.stringify({ success: false, message: "Missing required fields" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    // Email configuration
    const recipientEmail = "zacariahheim@gmail.com";
    const subject = `New contact form submission from ${formData.name}`;
    const message = `
Name: ${formData.name}
Email: ${formData.email}

Message:
${formData.message}
    `;

    // Send email using Cloudflare Email Workers (requires Email Workers to be set up)
    // If you don't have Email Workers set up, you can use a third-party email service
    // For this example, we'll simulate a successful email send

    // In a real implementation, you would use something like:
    /*
    await context.env.EMAIL_SERVICE.send({
      to: recipientEmail,
      from: "noreply@yourdomain.com",
      subject: subject,
      text: message
    });
    */

    // For now, we'll just log the submission and return success
    console.log("Form submission received:", formData);

    // Return success response
    return new Response(JSON.stringify({
      success: true,
      message: "Form submitted successfully! We'll get back to you soon."
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error processing form submission:", error);

    // Return error response
    return new Response(JSON.stringify({
      success: false,
      message: "There was an error processing your submission. Please try again."
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
