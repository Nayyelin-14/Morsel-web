import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { sendError } from '../utils/response';

// ─── Run after validator chains — returns 422 if invalid ──────
export function validate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({
      field: e.type === 'field' ? e.path : 'unknown',
      message: e.msg,
    }));

    sendError(res, 'Validation failed', 422, formatted);
    return;
  }

  next();
}
