import { Request } from 'express';
import { Document, Types } from 'mongoose';

// ─── User Roles ───────────────────────────────────────────────
export type UserRole = 'buyer' | 'seller' | 'rider';

// ─── Auth Provider ────────────────────────────────────────────
export type AuthProvider = 'local' | 'google';

// ─── User Document ────────────────────────────────────────────
export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password?: string;           // optional — google users have no password
  phone?: string;
  role: UserRole;
  photo?: string;              // filename or URL
  provider: AuthProvider;
  googleId?: string;
  isVerified: boolean;
  isActive: boolean;
  refreshTokens: string[];     // store multiple refresh tokens (multi-device)
  createdAt: Date;
  updatedAt: Date;

  // methods
  comparePassword(candidate: string): Promise<boolean>;
  toSafeObject(): SafeUser;
}

// ─── Safe User (no sensitive fields) ─────────────────────────
export interface SafeUser {
  id: string;
  username: string;
  email: string;
  phone?: string;
  role: UserRole;
  photo?: string;
  provider: AuthProvider;
  isVerified: boolean;
  createdAt: Date;
}

// ─── JWT Payloads ─────────────────────────────────────────────
export interface AccessTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  type: 'access';
}

export interface RefreshTokenPayload {
  userId: string;
  type: 'refresh';
}

// ─── Authenticated Request ────────────────────────────────────
export interface AuthRequest extends Request {
  user?: AccessTokenPayload;
  file?: Express.Multer.File;
}

// ─── Register Body ────────────────────────────────────────────
export interface RegisterBody {
  username: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
}

// ─── Login Body ───────────────────────────────────────────────
export interface LoginBody {
  email: string;
  password: string;
}

// ─── Token Pair ───────────────────────────────────────────────
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// ─── API Response ─────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>[];
}
