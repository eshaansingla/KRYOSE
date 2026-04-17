import { Request, Response, NextFunction } from 'express';
import { validationResult, body } from 'express-validator';

// ── Run validation result ──────────────────────────────────────────────────────
export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
    return;
  }
  next();
};

// ── Auth validators ────────────────────────────────────────────────────────────
export const registerValidators = [
  body('name').trim().notEmpty().withMessage('Name is required.').isLength({ max: 100 }),
  body('email').isEmail().withMessage('Valid email is required.').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters.')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter.')
    .matches(/[0-9]/).withMessage('Password must contain a number.'),
];

export const loginValidators = [
  body('email').isEmail().withMessage('Valid email is required.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
];

// ── Workspace validators ───────────────────────────────────────────────────────
export const workspaceValidators = [
  body('name').trim().notEmpty().withMessage('Workspace name is required.').isLength({ max: 100 }),
  body('slug')
    .trim()
    .notEmpty()
    .withMessage('Slug is required.')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug can only contain lowercase letters, numbers, and hyphens.'),
];

// ── Project validators ─────────────────────────────────────────────────────────
export const projectValidators = [
  body('name').trim().notEmpty().withMessage('Project name is required.').isLength({ max: 150 }),
];

// ── Password change validators ─────────────────────────────────────────────────
export const changePasswordValidators = [
  body('currentPassword').notEmpty().withMessage('Current password is required.'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters.')
    .matches(/[A-Z]/).withMessage('New password must contain an uppercase letter.')
    .matches(/[0-9]/).withMessage('New password must contain a number.'),
];