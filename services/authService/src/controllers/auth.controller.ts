import { Request, Response } from 'express';
import { User } from '../models/User';
import { signTokenPair, verifyRefreshToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/response';
import { getGoogleAuthUrl, getGoogleUser } from '../config/google';
import { AuthRequest, RegisterBody, LoginBody } from '../types';
import { logger } from '../utils/logger';
import { config } from '../config/env';
import fs from 'fs';
import path from 'path';

// ─────────────────────────────────────────────────────────────
//  REGISTER  POST /api/auth/register
// ─────────────────────────────────────────────────────────────
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { username, email, password, phone, role } = req.body as RegisterBody;
    const photoFile = (req as AuthRequest).file;

    // Check duplicates
    const existing = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });

    if (existing) {
      // Clean up uploaded photo if registration fails
      if (photoFile) fs.unlinkSync(photoFile.path);

      const field = existing.email === email.toLowerCase() ? 'email' : 'username';
      sendError(res, `${field} is already taken`, 409);
      return;
    }

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password,
      phone,
      role: role ?? 'buyer',      // default to buyer
      photo: photoFile?.filename ?? null,
      provider: 'local',
      isVerified: false,
    });

    const tokens = signTokenPair(
      user._id.toString(),
      user.email,
      user.role
    );

    // Store refresh token
    await User.findByIdAndUpdate(user._id, {
      $push: { refreshTokens: tokens.refreshToken },
    });

    logger.info(`New user registered: ${user.email}`);

    sendSuccess(
      res,
      'Registration successful',
      { user: user.toSafeObject(), ...tokens },
      201
    );
  } catch (error) {
    logger.error('Register error:', error);
    sendError(res, 'Registration failed', 500);
  }
}

// ─────────────────────────────────────────────────────────────
//  LOGIN  POST /api/auth/login
// ─────────────────────────────────────────────────────────────
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as LoginBody;

    // Explicitly select password and refreshTokens (excluded by default)
    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+password +refreshTokens');

    if (!user) {
      sendError(res, 'Invalid email or password', 401);
      return;
    }

    if (user.provider === 'google') {
      sendError(res, 'This account uses Google login. Please sign in with Google.', 400);
      return;
    }

    if (!user.isActive) {
      sendError(res, 'Account is deactivated', 403);
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      sendError(res, 'Invalid email or password', 401);
      return;
    }

    const tokens = signTokenPair(
      user._id.toString(),
      user.email,
      user.role
    );

    // Store refresh token (limit to 5 active devices)
    const updatedTokens = [...user.refreshTokens.slice(-4), tokens.refreshToken];
    await User.findByIdAndUpdate(user._id, { refreshTokens: updatedTokens });

    logger.info(`User logged in: ${user.email}`);

    sendSuccess(res, 'Login successful', {
      user: user.toSafeObject(),
      ...tokens,
    });
  } catch (error) {
    logger.error('Login error:', error);
    sendError(res, 'Login failed', 500);
  }
}

// ─────────────────────────────────────────────────────────────
//  REFRESH TOKEN  POST /api/auth/refresh
// ─────────────────────────────────────────────────────────────
export async function refreshToken(req: Request, res: Response): Promise<void> {
  try {
    const { refreshToken: token } = req.body as { refreshToken: string };

    if (!token) {
      sendError(res, 'Refresh token required', 400);
      return;
    }

    // Verify token signature
    const payload = verifyRefreshToken(token);

    // Find user and check token is still valid (not revoked)
    const user = await User.findById(payload.userId).select('+refreshTokens');
    if (!user || !user.refreshTokens.includes(token)) {
      sendError(res, 'Invalid refresh token', 401);
      return;
    }

    // Rotate: remove old token, issue new pair
    const newTokens = signTokenPair(
      user._id.toString(),
      user.email,
      user.role
    );

    const updatedTokens = user.refreshTokens
      .filter((t) => t !== token)
      .concat(newTokens.refreshToken)
      .slice(-5);

    await User.findByIdAndUpdate(user._id, { refreshTokens: updatedTokens });

    sendSuccess(res, 'Tokens refreshed', newTokens);
  } catch (error) {
    logger.error('Refresh token error:', error);
    sendError(res, 'Invalid or expired refresh token', 401);
  }
}

// ─────────────────────────────────────────────────────────────
//  LOGOUT  POST /api/auth/logout
// ─────────────────────────────────────────────────────────────
export async function logout(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { refreshToken: token } = req.body as { refreshToken?: string };
    const userId = req.user?.userId;

    if (userId && token) {
      // Revoke this specific device's refresh token
      await User.findByIdAndUpdate(userId, {
        $pull: { refreshTokens: token },
      });
    }

    sendSuccess(res, 'Logged out successfully');
  } catch (error) {
    logger.error('Logout error:', error);
    sendError(res, 'Logout failed', 500);
  }
}

// ─────────────────────────────────────────────────────────────
//  LOGOUT ALL  POST /api/auth/logout-all
// ─────────────────────────────────────────────────────────────
export async function logoutAll(req: AuthRequest, res: Response): Promise<void> {
  try {
    await User.findByIdAndUpdate(req.user?.userId, { refreshTokens: [] });
    sendSuccess(res, 'Logged out from all devices');
  } catch (error) {
    logger.error('Logout all error:', error);
    sendError(res, 'Logout failed', 500);
  }
}

// ─────────────────────────────────────────────────────────────
//  GOOGLE AUTH  GET /api/auth/google
// ─────────────────────────────────────────────────────────────
export function googleAuth(_req: Request, res: Response): void {
  const url = getGoogleAuthUrl();
  res.redirect(url);
}

// ─────────────────────────────────────────────────────────────
//  GOOGLE CALLBACK  GET /api/auth/google/callback
// ─────────────────────────────────────────────────────────────
export async function googleCallback(req: Request, res: Response): Promise<void> {
  try {
    const { code, error } = req.query;

    if (error || !code) {
      res.redirect(`${config.clientUrl}/auth/error?reason=google_denied`);
      return;
    }

    const googleUser = await getGoogleUser(code as string);

    // Find existing user by googleId or email
    let user = await User.findOne({
      $or: [{ googleId: googleUser.googleId }, { email: googleUser.email }],
    }).select('+refreshTokens');

    if (user) {
      // Link Google account if registered locally before
      if (!user.googleId) {
        user.googleId = googleUser.googleId;
        user.provider = 'google';
        user.isVerified = true;
        if (!user.photo && googleUser.picture) user.photo = googleUser.picture;
        await user.save();
      }
    } else {
      // First time Google login → create account
      user = await User.create({
        username: googleUser.name.replace(/\s+/g, '_').toLowerCase(),
        email: googleUser.email,
        googleId: googleUser.googleId,
        photo: googleUser.picture ?? null,
        provider: 'google',
        role: 'buyer',
        isVerified: true,
      });
      // Re-fetch with refreshTokens field
      user = (await User.findById(user._id).select('+refreshTokens'))!;
    }

    const tokens = signTokenPair(
      user._id.toString(),
      user.email,
      user.role
    );

    const updatedTokens = [...(user.refreshTokens ?? []).slice(-4), tokens.refreshToken];
    await User.findByIdAndUpdate(user._id, { refreshTokens: updatedTokens });

    logger.info(`Google OAuth login: ${user.email}`);

    // Redirect to client with tokens in query (or use cookies in production)
    const redirectUrl = new URL(`${config.clientUrl}/auth/callback`);
    redirectUrl.searchParams.set('accessToken', tokens.accessToken);
    redirectUrl.searchParams.set('refreshToken', tokens.refreshToken);
    res.redirect(redirectUrl.toString());

  } catch (error) {
    logger.error('Google callback error:', error);
    res.redirect(`${config.clientUrl}/auth/error?reason=server_error`);
  }
}

// ─────────────────────────────────────────────────────────────
//  GET ME  GET /api/auth/me
// ─────────────────────────────────────────────────────────────
export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = await User.findById(req.user?.userId);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }
    sendSuccess(res, 'User fetched', user.toSafeObject());
  } catch (error) {
    logger.error('GetMe error:', error);
    sendError(res, 'Failed to fetch user', 500);
  }
}

// ─────────────────────────────────────────────────────────────
//  UPDATE PROFILE  PATCH /api/auth/me
// ─────────────────────────────────────────────────────────────
export async function updateProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { username, phone } = req.body as { username?: string; phone?: string };
    const photoFile = req.file;
    const userId = req.user?.userId;

    const user = await User.findById(userId);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    // Remove old photo from disk if new one uploaded
    if (photoFile && user.photo && !user.photo.startsWith('http')) {
      const oldPath = path.resolve(config.upload.dir, user.photo);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    if (username) user.username = username;
    if (phone) user.phone = phone;
    if (photoFile) user.photo = photoFile.filename;

    await user.save();

    sendSuccess(res, 'Profile updated', user.toSafeObject());
  } catch (error) {
    logger.error('UpdateProfile error:', error);
    sendError(res, 'Profile update failed', 500);
  }
}
