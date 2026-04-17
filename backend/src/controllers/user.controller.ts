import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/db';
import { createError } from '../middleware/error.middleware';

// ── Get profile ────────────────────────────────────────────────────────────────
export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, role, avatar_url, is_verified, created_at FROM users WHERE id = $1',
      [req.user!.id]
    );
    if (!rows.length) return next(createError('User not found.', 404));
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// ── Update profile ─────────────────────────────────────────────────────────────
export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, avatar_url } = req.body;
    const { rows } = await pool.query(
      `UPDATE users
       SET name       = COALESCE($1, name),
           avatar_url = COALESCE($2, avatar_url)
       WHERE id = $3
       RETURNING id, name, email, role, avatar_url, is_verified, created_at`,
      [name, avatar_url, req.user!.id]
    );
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// ── Change password ────────────────────────────────────────────────────────────
export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    const { rows } = await pool.query('SELECT password_hash FROM users WHERE id = $1', [
      req.user!.id,
    ]);

    if (!rows[0].password_hash) {
      return next(createError('Cannot change password for OAuth-only accounts.', 400));
    }

    const valid = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!valid) return next(createError('Current password is incorrect.', 401));

    const hash = await bcrypt.hash(newPassword, 12);
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, req.user!.id]);

    res.json({ success: true, message: 'Password updated.' });
  } catch (err) {
    next(err);
  }
};

// ── Delete account ─────────────────────────────────────────────────────────────
export const deleteAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.user!.id]);
    res.json({ success: true, message: 'Account deleted.' });
  } catch (err) {
    next(err);
  }
};