import { google } from "googleapis";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });

    const drive = google.drive({ version: "v3", auth });

    // ✅ get folderId from query OR use default
    const folderId =
      req.query.folderId || "1YITLhxtuu8mh4HlBGEe8XlIp-XuctbCq";

    const response = await drive.files.list({
      q: `'${folderId}' in parents`,
      fields: "files(id, name, mimeType)",
    });

    res.status(200).json(response.data.files);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
