import { google } from 'googleapis';
import { config } from './env';

// ─── Singleton OAuth2 Client ──────────────────────────────────
export const oauth2Client = new google.auth.OAuth2(
  config.google.clientId,
  config.google.clientSecret,
  config.google.redirectUri
);

// ─── Scopes requested from Google ────────────────────────────
export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'openid',
];

// ─── Generate the Google consent URL ─────────────────────────
export function getGoogleAuthUrl(): string {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',   // get refresh token too
    scope: GOOGLE_SCOPES,
    prompt: 'consent',        // always show consent screen
  });
}

// ─── Exchange code → tokens + user info ──────────────────────
export async function getGoogleUser(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
  const { data } = await oauth2.userinfo.get();

  return {
    googleId: data.id!,
    email: data.email!,
    name: data.name ?? data.email!.split('@')[0],
    picture: data.picture ?? undefined,
  };
}
