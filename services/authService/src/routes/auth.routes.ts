import { Router } from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';

import {
  register,
  login,
  refreshToken,
  logout,
  logoutAll,
  googleAuth,
  googleCallback,
  getMe,
  updateProfile,
} from '../controllers/auth.controller';

import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// ─── Rate Limiters ────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 10,
  message: { success: false, message: 'Too many attempts, try again in 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Register Validators ──────────────────────────────────────
const registerValidators = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be 3–30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, underscores'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email required')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and a number'),

  body('phone')
    .optional()
    .matches(/^\+?[\d\s\-()]{7,15}$/)
    .withMessage('Invalid phone number'),

  body('role')
    .optional()
    .isIn(['buyer', 'seller', 'rider'])
    .withMessage('Role must be buyer, seller, or rider'),
];

// ─── Login Validators ─────────────────────────────────────────
const loginValidators = [
  body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password required'),
];

// ─── Routes ───────────────────────────────────────────────────

// Public
router.post(
  '/register',
  authLimiter,
  upload.single('photo'),       // optional photo upload
  registerValidators,
  validate,
  register
);

router.post('/login', authLimiter, loginValidators, validate, login);

router.post('/refresh', refreshToken);

// Google OAuth
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

// Protected
router.post('/logout', authenticate, logout);
router.post('/logout-all', authenticate, logoutAll);

router.get('/me', authenticate, getMe);
router.patch(
  '/me',
  authenticate,
  upload.single('photo'),
  [
    body('username')
      .optional()
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be 3–30 characters'),
    body('phone')
      .optional()
      .matches(/^\+?[\d\s\-()]{7,15}$/)
      .withMessage('Invalid phone number'),
  ],
  validate,
  updateProfile
);

export default router;
