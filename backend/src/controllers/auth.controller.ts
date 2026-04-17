import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db';
import { createError } from '../middleware/error.middleware';

// ── Token helpers ──────────────────────────────────────────────────────────────
const signAccessToken = (userId: string): string =>
  jwt.sign({ sub: userId }, process.env.JWT_SECRET as any, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as any,
  } as any);

const signRefreshToken = (userId: string): string =>
  jwt.sign({ sub: userId }, process.env.JWT_REFRESH_SECRET as any, {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
  } as any);

// ── Register ───────────────────────────────────────────────────────────────────
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length) {
      return next(createError('Email already in use.', 409));
    }

    const hash = await bcrypt.hash(password, 12);

    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password_hash, is_verified)
       VALUES ($1, $2, $3, FALSE)
       RETURNING id, name, email, role, avatar_url, created_at`,
      [name, email, hash]
    );

    const user = rows[0];
    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    await pool.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refreshToken, user.id]);

    res.status(201).json({ success: true, data: { user, accessToken, refreshToken } });
  } catch (err) {
    next(err);
  }
};

// ── Login ──────────────────────────────────────────────────────────────────────
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const { rows } = await pool.query(
      'SELECT id, name, email, role, avatar_url, password_hash FROM users WHERE email = $1',
      [email]
    );

    const user = rows[0];
    if (!user || !user.password_hash) {
      return next(createError('Invalid email or password.', 401));
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return next(createError('Invalid email or password.', 401));

    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    await pool.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refreshToken, user.id]);

    const { password_hash: _ph, ...safeUser } = user;
    res.json({ success: true, data: { user: safeUser, accessToken, refreshToken } });
  } catch (err) {
    next(err);
  }
};

// ── Refresh Token ──────────────────────────────────────────────────────────────
export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return next(createError('Refresh token required.', 400));

    let payload: { sub: string };
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as any) as {
        sub: string;
      };
    } catch {
      return next(createError('Invalid or expired refresh token.', 401));
    }

    const { rows } = await pool.query(
      'SELECT id, refresh_token FROM users WHERE id = $1',
      [payload.sub]
    );

    if (!rows.length || rows[0].refresh_token !== refreshToken) {
      return next(createError('Refresh token mismatch.', 401));
    }

    const newAccessToken = signAccessToken(payload.sub);
    const newRefreshToken = signRefreshToken(payload.sub);

    await pool.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [
      newRefreshToken,
      payload.sub,
    ]);

    res.json({ success: true, data: { accessToken: newAccessToken, refreshToken: newRefreshToken } });
  } catch (err) {
    next(err);
  }
};

// ── Logout ─────────────────────────────────────────────────────────────────────
export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await pool.query('UPDATE users SET refresh_token = NULL WHERE id = $1', [req.user!.id]);
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    next(err);
  }
};

// ── Google OAuth callback ──────────────────────────────────────────────────────
export const googleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as { id: string };
    if (!user) return next(createError('Google auth failed.', 401));

    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    await pool.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refreshToken, user.id]);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(
      `${frontendUrl}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  } catch (err) {
    next(err);
  }
};

// ── Get current user ───────────────────────────────────────────────────────────
export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, role, avatar_url, is_verified, created_at FROM users WHERE id = $1',
      [req.user!.id]
    );
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};