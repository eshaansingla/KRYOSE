import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db';
import { createError } from '../middleware/error.middleware';

// ── Create workspace ───────────────────────────────────────────────────────────
export const createWorkspace = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const client = await pool.connect();
  try {
    const { name, slug, description } = req.body;
    const userId = req.user!.id;

    await client.query('BEGIN');

    const existing = await client.query('SELECT id FROM workspaces WHERE slug = $1', [slug]);
    if (existing.rows.length) return next(createError('Slug already taken.', 409));

    const { rows } = await client.query(
      `INSERT INTO workspaces (name, slug, description, owner_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, slug, description || null, userId]
    );

    // Auto-add owner as member
    await client.query(
      `INSERT INTO workspace_members (workspace_id, user_id, role)
       VALUES ($1, $2, 'owner')`,
      [rows[0].id, userId]
    );

    await client.query('COMMIT');
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

// ── Get all workspaces for current user ────────────────────────────────────────
export const getMyWorkspaces = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rows } = await pool.query(
      `SELECT w.*, wm.role AS my_role
       FROM workspaces w
       JOIN workspace_members wm ON wm.workspace_id = w.id
       WHERE wm.user_id = $1
       ORDER BY w.created_at DESC`,
      [req.user!.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

// ── Get single workspace ───────────────────────────────────────────────────────
export const getWorkspace = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { workspaceId } = req.params;
    const { rows } = await pool.query(
      `SELECT w.*, wm.role AS my_role
       FROM workspaces w
       JOIN workspace_members wm ON wm.workspace_id = w.id
       WHERE w.id = $1 AND wm.user_id = $2`,
      [workspaceId, req.user!.id]
    );
    if (!rows.length) return next(createError('Workspace not found.', 404));
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// ── Update workspace ───────────────────────────────────────────────────────────
export const updateWorkspace = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { workspaceId } = req.params;
    const { name, description, logo_url } = req.body;

    const { rows } = await pool.query(
      `UPDATE workspaces
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           logo_url = COALESCE($3, logo_url)
       WHERE id = $4
       RETURNING *`,
      [name, description, logo_url, workspaceId]
    );
    if (!rows.length) return next(createError('Workspace not found.', 404));
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// ── Delete workspace ───────────────────────────────────────────────────────────
export const deleteWorkspace = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { workspaceId } = req.params;
    const { rowCount } = await pool.query('DELETE FROM workspaces WHERE id = $1 AND owner_id = $2', [
      workspaceId,
      req.user!.id,
    ]);
    if (!rowCount) return next(createError('Workspace not found or no permission.', 404));
    res.json({ success: true, message: 'Workspace deleted.' });
  } catch (err) {
    next(err);
  }
};

// ── Get workspace members ──────────────────────────────────────────────────────
export const getMembers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { workspaceId } = req.params;
    const { rows } = await pool.query(
      `SELECT u.id, u.name, u.email, u.avatar_url, wm.role, wm.joined_at
       FROM workspace_members wm
       JOIN users u ON u.id = wm.user_id
       WHERE wm.workspace_id = $1
       ORDER BY wm.joined_at ASC`,
      [workspaceId]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

// ── Update member role ─────────────────────────────────────────────────────────
export const updateMemberRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { workspaceId, userId } = req.params;
    const { role } = req.body;

    if (!['admin', 'member', 'viewer'].includes(role)) {
      return next(createError('Invalid role.', 400));
    }

    const { rows } = await pool.query(
      `UPDATE workspace_members SET role = $1
       WHERE workspace_id = $2 AND user_id = $3
       RETURNING *`,
      [role, workspaceId, userId]
    );
    if (!rows.length) return next(createError('Member not found.', 404));
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// ── Remove member ──────────────────────────────────────────────────────────────
export const removeMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { workspaceId, userId } = req.params;
    await pool.query(
      'DELETE FROM workspace_members WHERE workspace_id = $1 AND user_id = $2 AND role != $3',
      [workspaceId, userId, 'owner']
    );
    res.json({ success: true, message: 'Member removed.' });
  } catch (err) {
    next(err);
  }
};

// ── Invite member ──────────────────────────────────────────────────────────────
export const inviteMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { workspaceId } = req.params;
    const { email, role = 'member' } = req.body;
    const token = uuidv4();

    const { rows } = await pool.query(
      `INSERT INTO workspace_invites (workspace_id, email, role, token, invited_by)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (workspace_id, email) DO UPDATE
         SET token = EXCLUDED.token,
             role  = EXCLUDED.role,
             expires_at = NOW() + INTERVAL '7 days'
       RETURNING *`,
      [workspaceId, email, role, token, req.user!.id]
    );

    // TODO: Send invite email with token
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// ── Accept invite ──────────────────────────────────────────────────────────────
export const acceptInvite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const client = await pool.connect();
  try {
    const { token } = req.params;

    const { rows } = await client.query(
      `SELECT * FROM workspace_invites
       WHERE token = $1 AND accepted_at IS NULL AND expires_at > NOW()`,
      [token]
    );

    if (!rows.length) return next(createError('Invalid or expired invite.', 400));

    const invite = rows[0];
    await client.query('BEGIN');

    await client.query(
      `INSERT INTO workspace_members (workspace_id, user_id, role)
       VALUES ($1, $2, $3)
       ON CONFLICT (workspace_id, user_id) DO NOTHING`,
      [invite.workspace_id, req.user!.id, invite.role]
    );

    await client.query(
      'UPDATE workspace_invites SET accepted_at = NOW() WHERE id = $1',
      [invite.id]
    );

    await client.query('COMMIT');
    res.json({ success: true, message: 'Joined workspace.' });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};