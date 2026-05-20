// modules/issue/issueRoute.ts
import { Router } from 'express';
import { issueController } from './issueController';
import { verifyToken } from '../../middleware/authMiddleware';

const router = Router();

router.post('/', verifyToken, issueController.createIssue);
router.get('/', issueController.getAllIssues);
router.get('/:id', issueController.getSingleIssue);
router.patch('/:id', verifyToken, issueController.updateIssue);
router.delete('/:id', verifyToken, issueController.deleteIssue);

export const issueRoute = router;