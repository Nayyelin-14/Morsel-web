import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { sendError } from '../utils/response';
import { AuthRequest, UserRole } from '../types';
import { logger } from '../utils/logger';

// ─── Authenticate: verify Bearer token ───────────────────────
export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      sendError(res, 'No token provided', 401);
      return;
    }

    const token = authHeader.slice(7); // strip "Bearer "
    const payload = verifyAccessToken(token);

    req.user = payload;
    next();
  } catch (error) {
    logger.debug('Auth middleware error:', error);
    sendError(res, 'Invalid or expired token', 401);
  }
}

// ─── Authorize: role-based access control ────────────────────
export function authorize(...roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendError(
        res,
        `Access denied. Required roles: ${roles.join(', ')}`,
        403
      );
      return;
    }

    next();
  };
}
