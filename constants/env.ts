const rawUrl = process.env.EXPO_PUBLIC_SHEET_API_URL;

if (!rawUrl) {
  throw new Error(
    "Missing EXPO_PUBLIC_SHEET_API_URL. Copy .env.example to .env and set your Apps Script Web App URL."
  );
}

export const sheet_api_url: string = rawUrl;
