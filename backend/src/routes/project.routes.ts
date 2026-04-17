import { Router } from 'express';
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from '../controllers/project.controller';
import { protect, requireWorkspaceRole } from '../middleware/auth.middleware';
import { projectValidators, validate } from '../middleware/validate.middleware';

const router = Router({ mergeParams: true }); // inherit :workspaceId

router.use(protect);

router.post('/', requireWorkspaceRole('owner', 'admin', 'member'), projectValidators, validate, createProject);
router.get('/', getProjects);
router.get('/:projectId', getProject);
router.patch('/:projectId', requireWorkspaceRole('owner', 'admin', 'member'), updateProject);
router.delete('/:projectId', requireWorkspaceRole('owner', 'admin'), deleteProject);

export default router;