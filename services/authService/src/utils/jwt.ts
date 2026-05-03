import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
  TokenPair,
  UserRole,
} from '../types';

// ─── Sign Access Token ────────────────────────────────────────
export function signAccessToken(
  userId: string,
  email: string,
  role: UserRole
): string {
  const payload: AccessTokenPayload = { userId, email, role, type: 'access' };
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

// ─── Sign Refresh Token ───────────────────────────────────────
export function signRefreshToken(userId: string): string {
  const payload: RefreshTokenPayload = { userId, type: 'refresh' };
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

// ─── Sign Both ────────────────────────────────────────────────
export function signTokenPair(
  userId: string,
  email: string,
  role: UserRole
): TokenPair {
  return {
    accessToken: signAccessToken(userId, email, role),
    refreshToken: signRefreshToken(userId),
  };
}

// ─── Verify Access Token ──────────────────────────────────────
export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, config.jwt.accessSecret) as AccessTokenPayload;
  if (decoded.type !== 'access') throw new Error('Invalid token type');
  return decoded;
}

// ─── Verify Refresh Token ─────────────────────────────────────
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const decoded = jwt.verify(token, config.jwt.refreshSecret) as RefreshTokenPayload;
  if (decoded.type !== 'refresh') throw new Error('Invalid token type');
  return decoded;
}
