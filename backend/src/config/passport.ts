import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import pool from './db';

// ── JWT Strategy ───────────────────────────────────────────────────────────────
const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const { rows } = await pool.query(
        'SELECT id, name, email, role, avatar_url FROM users WHERE id = $1',
        [payload.sub]
      );
      if (!rows.length) return done(null, false);
      return done(null, rows[0]);
    } catch (err) {
      return done(err, false);
    }
  })
);

// ── Google OAuth Strategy ──────────────────────────────────────────────────────
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error('No email from Google'), undefined);

          // Upsert user
          const { rows } = await pool.query(
            `INSERT INTO users (name, email, google_id, avatar_url, is_verified)
             VALUES ($1, $2, $3, $4, TRUE)
             ON CONFLICT (email) DO UPDATE
               SET google_id   = EXCLUDED.google_id,
                   avatar_url  = COALESCE(users.avatar_url, EXCLUDED.avatar_url),
                   is_verified = TRUE,
                   updated_at  = NOW()
             RETURNING id, name, email, role, avatar_url`,
            [
              profile.displayName,
              email,
              profile.id,
              profile.photos?.[0]?.value ?? null,
            ]
          );

          return done(null, rows[0]);
        } catch (err) {
          return done(err as Error, undefined);
        }
      }
    )
  );
}

export default passport;