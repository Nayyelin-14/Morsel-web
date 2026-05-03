import dotenv from 'dotenv';
dotenv.config();

// ─── Helper: crash early if required env is missing ──────────
function required(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env variable: ${key}`);
  return val;
}

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

// ─── Exported Config ─────────────────────────────────────────
export const config = {
  // Server
  port: parseInt(optional('PORT', '5001'), 10),
  nodeEnv: optional('NODE_ENV', 'development'),
  isDev: optional('NODE_ENV', 'development') === 'development',

  // MongoDB
  mongoUri: required('MONGO_URI'),

  // JWT
  jwt: {
    accessSecret: required('JWT_ACCESS_SECRET'),
    refreshSecret: required('JWT_REFRESH_SECRET'),
    accessExpiresIn: optional('JWT_ACCESS_EXPIRES_IN', '15m'),
    refreshExpiresIn: optional('JWT_REFRESH_EXPIRES_IN', '7d'),
  },

  // Google OAuth
  google: {
    clientId: required('GOOGLE_CLIENT_ID'),
    clientSecret: required('GOOGLE_CLIENT_SECRET'),
    redirectUri: required('GOOGLE_REDIRECT_URI'),
  },

  // Client
  clientUrl: optional('CLIENT_URL', 'http://localhost:3000'),

  // Upload
  upload: {
    maxFileSizeMb: parseInt(optional('MAX_FILE_SIZE_MB', '5'), 10),
    dir: optional('UPLOAD_DIR', 'uploads'),
  },
} as const;
