import { Router } from 'express';
import {
  createWorkspace,
  getMyWorkspaces,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
  getMembers,
  updateMemberRole,
  removeMember,
  inviteMember,
  acceptInvite,
} from '../controllers/workspace.controller';
import { protect, requireWorkspaceRole } from '../middleware/auth.middleware';
import { workspaceValidators, validate } from '../middleware/validate.middleware';

const router = Router();

router.use(protect);

router.post('/', workspaceValidators, validate, createWorkspace);
router.get('/', getMyWorkspaces);

router.get('/:workspaceId', getWorkspace);
router.patch(
  '/:workspaceId',
  requireWorkspaceRole('owner', 'admin'),
  updateWorkspace
);
router.delete('/:workspaceId', requireWorkspaceRole('owner'), deleteWorkspace);

// Members
router.get('/:workspaceId/members', getMembers);
router.patch(
  '/:workspaceId/members/:userId',
  requireWorkspaceRole('owner', 'admin'),
  updateMemberRole
);
router.delete(
  '/:workspaceId/members/:userId',
  requireWorkspaceRole('owner', 'admin'),
  removeMember
);

// Invites
router.post('/:workspaceId/invites', requireWorkspaceRole('owner', 'admin'), inviteMember);
router.post('/invites/:token/accept', acceptInvite);

export default router;