/**
 * Google Apps Script Web App for contact form submissions.
 *
 * Deploy as web app (execute the doPost function) and set "Anyone, even anonymous" access.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var name = data.name;
    var email = data.email;
    var message = data.message;

    if (!name || !email || !message) {
      return ContentService.createTextOutput(
        JSON.stringify({ success: false, message: 'All fields are required.' })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.openById('SPREADSHEET_ID'); // replace with your Sheet ID
    var sheet = ss.getSheetByName('FormResponses') || ss.insertSheet('FormResponses');

    // Append a new row [timestamp, name, email, message]
    sheet.appendRow([new Date(), name, email, message]);

    // Send email notification
    MailApp.sendEmail({
      to: 'you@yourdomain.com',
      subject: 'New Contact Form Submission',
      htmlBody: '<p><strong>Name:</strong> ' + name + '</p>' +
                '<p><strong>Email:</strong> ' + email + '</p>' +
                '<p><strong>Message:</strong><br>' + message + '</p>'
    });

    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: 'Received and recorded.' })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, message: 'Internal Apps Script error.' })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
