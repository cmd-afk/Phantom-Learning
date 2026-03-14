/**
 * Phantom Learning — log sign-ins to this Google Sheet
 *
 * SETUP:
 * 1. Create a Google Sheet (or use an existing one).
 * 2. Add a header row in row 1, e.g.: Timestamp | Email | Name | Blocked
 * 3. In the Sheet: Extensions → Apps Script. Paste this entire file.
 * 4. Save, then Deploy → New deployment → type "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web app URL (ends with /exec).
 * 6. In your site, set SHEET_LOG_URL in redirect.html to that URL.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var body = {};
    if (e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Email", "Name", "Blocked"]);
    } else if (sheet.getLastColumn() < 4) {
      sheet.getRange(1, 4).setValue("Blocked");
    }
    var blockedVal = body.blocked;
    var blocked = blockedVal === true || blockedVal === "true" || blockedVal === "Yes" || String(blockedVal).toLowerCase() === "yes";
    var row = [
      body.time || new Date().toISOString(),
      body.email || "",
      body.name || "",
      blocked ? "Yes" : "No"
    ];
    sheet.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
