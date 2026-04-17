import { Request, Response, NextFunction } from 'express';
import pool from '../config/db';
import { createError } from '../middleware/error.middleware';

// ── Create project ─────────────────────────────────────────────────────────────
export const createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { workspaceId } = req.params;
    const { name, description } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO projects (workspace_id, name, description, created_by)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [workspaceId, name, description || null, req.user!.id]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// ── Get all projects in a workspace ───────────────────────────────────────────
export const getProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { workspaceId } = req.params;
    const { status } = req.query;

    let query = `
      SELECT p.*, u.name AS created_by_name
      FROM projects p
      JOIN users u ON u.id = p.created_by
      WHERE p.workspace_id = $1
    `;
    const params: (string | string[])[] = [workspaceId];

    if (status) {
      params.push(status as string);
      query += ` AND p.status = $${params.length}`;
    }

    query += ' ORDER BY p.created_at DESC';

    const { rows } = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

// ── Get single project ─────────────────────────────────────────────────────────
export const getProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { workspaceId, projectId } = req.params;
    const { rows } = await pool.query(
      `SELECT p.*, u.name AS created_by_name
       FROM projects p
       JOIN users u ON u.id = p.created_by
       WHERE p.id = $1 AND p.workspace_id = $2`,
      [projectId, workspaceId]
    );
    if (!rows.length) return next(createError('Project not found.', 404));
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// ── Update project ─────────────────────────────────────────────────────────────
export const updateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { workspaceId, projectId } = req.params;
    const { name, description, status } = req.body;

    if (status && !['active', 'archived', 'completed'].includes(status)) {
      return next(createError('Invalid status.', 400));
    }

    const { rows } = await pool.query(
      `UPDATE projects
       SET name        = COALESCE($1, name),
           description = COALESCE($2, description),
           status      = COALESCE($3, status)
       WHERE id = $4 AND workspace_id = $5
       RETURNING *`,
      [name, description, status, projectId, workspaceId]
    );
    if (!rows.length) return next(createError('Project not found.', 404));
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// ── Delete project ─────────────────────────────────────────────────────────────
export const deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { workspaceId, projectId } = req.params;
    const { rowCount } = await pool.query(
      'DELETE FROM projects WHERE id = $1 AND workspace_id = $2',
      [projectId, workspaceId]
    );
    if (!rowCount) return next(createError('Project not found.', 404));
    res.json({ success: true, message: 'Project deleted.' });
  } catch (err) {
    next(err);
  }
};