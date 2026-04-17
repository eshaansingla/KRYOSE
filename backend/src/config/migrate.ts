import pool from './db';
import dotenv from 'dotenv';

dotenv.config();

const migrate = async (): Promise<void> => {
  const client = await pool.connect();

  try {
    console.log('🔄 Running migrations...');

    await client.query('BEGIN');

    console.log('📋 Creating users table...');
    // ── Users ──────────────────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name          VARCHAR(100) NOT NULL,
        email         VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),                      -- null for OAuth-only users
        avatar_url    TEXT,
        google_id     VARCHAR(255) UNIQUE,
        role          VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        is_verified   BOOLEAN NOT NULL DEFAULT FALSE,
        refresh_token TEXT,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✅ Users table created');

    console.log('📋 Creating workspaces table...');
    // ── Workspaces ─────────────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS workspaces (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name        VARCHAR(100) NOT NULL,
        slug        VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        owner_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        logo_url    TEXT,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✅ Workspaces table created');

    console.log('📋 Creating workspace_members table...');
    // ── Workspace Members ──────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS workspace_members (
        id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
        user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role         VARCHAR(20) NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
        joined_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(workspace_id, user_id)
      );
    `);

    // ── Workspace Invites ──────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS workspace_invites (
        id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
        email        VARCHAR(255) NOT NULL,
        role         VARCHAR(20) NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),
        token        VARCHAR(255) UNIQUE NOT NULL,
        invited_by   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at   TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '7 days',
        accepted_at  TIMESTAMPTZ,
        created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(workspace_id, email)
      );
    `);

    // ── Projects ───────────────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
        name         VARCHAR(150) NOT NULL,
        description  TEXT,
        status       VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'completed')),
        created_by   UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
        created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // ── updated_at trigger function ────────────────────────────────────────────
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    const triggerTables = ['users', 'workspaces', 'projects'];
    for (const table of triggerTables) {
      await client.query(`
        DROP TRIGGER IF EXISTS set_updated_at ON ${table};
        CREATE TRIGGER set_updated_at
          BEFORE UPDATE ON ${table}
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `);
    }

    // ── Indexes ────────────────────────────────────────────────────────────────
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace ON workspace_members(workspace_id);
      CREATE INDEX IF NOT EXISTS idx_workspace_members_user      ON workspace_members(user_id);
      CREATE INDEX IF NOT EXISTS idx_projects_workspace          ON projects(workspace_id);
      CREATE INDEX IF NOT EXISTS idx_workspace_invites_token     ON workspace_invites(token);
    `);

    await client.query('COMMIT');
    console.log('✅ Migrations complete.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
};

migrate().catch(() => process.exit(1));