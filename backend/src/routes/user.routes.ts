import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';
import { changePasswordValidators, validate } from '../middleware/validate.middleware';

const router = Router();

router.use(protect);

router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.patch('/change-password', changePasswordValidators, validate, changePassword);
router.delete('/account', deleteAccount);

export default router;