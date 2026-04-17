import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
}

// Extend Express Request
declare global {
  namespace Express {
    interface User extends AuthUser {}
  }
}

// ── Protect any route ──────────────────────────────────────────────────────────
export const protect = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate('jwt', { session: false }, (err: Error, user: AuthUser) => {
    if (err || !user) {
      res.status(401).json({ success: false, message: 'Unauthorized. Please log in.' });
      return;
    }
    req.user = user;
    next();
  })(req, res, next);
};

// ── Require specific roles ─────────────────────────────────────────────────────
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Forbidden. Insufficient permissions.' });
      return;
    }
    next();
  };
};

// ── Require workspace-level role ───────────────────────────────────────────────
import pool from '../config/db';

export const requireWorkspaceRole = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const workspaceId = req.params.workspaceId || req.body.workspaceId;
      const userId = req.user?.id;

      if (!workspaceId || !userId) {
        res.status(400).json({ success: false, message: 'Missing workspace or user.' });
        return;
      }

      const { rows } = await pool.query(
        'SELECT role FROM workspace_members WHERE workspace_id = $1 AND user_id = $2',
        [workspaceId, userId]
      );

      if (!rows.length || !roles.includes(rows[0].role)) {
        res.status(403).json({ success: false, message: 'Insufficient workspace permissions.' });
        return;
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};