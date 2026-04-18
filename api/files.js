import { google } from "googleapis";

export default async function handler(req, res) {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });

    const drive = google.drive({ version: "v3", auth });

    const folderId = req.query.folderId;

    if (!folderId) {
      return res.status(400).json({ error: "Folder ID is required" });
    }

    const response = await drive.files.list({
      q: `'${folderId}' in parents`,
      fields: "files(id, name, mimeType)",
    });

    res.status(200).json(response.data.files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
