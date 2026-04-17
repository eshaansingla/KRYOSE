import { Router } from 'express';
import passport from 'passport';
import {
  register,
  login,
  logout,
  refresh,
  googleCallback,
  getMe,
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import {
  registerValidators,
  loginValidators,
  validate,
} from '../middleware/validate.middleware';

const router = Router();

router.post('/register', registerValidators, validate, register);
router.post('/login', loginValidators, validate, login);
router.post('/refresh', refresh);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

// Google OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/api/auth/google/fail' }),
  googleCallback
);
router.get('/google/fail', (_req, res) => {
  res.status(401).json({ success: false, message: 'Google authentication failed.' });
});

export default router;