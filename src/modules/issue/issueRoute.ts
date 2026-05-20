import { Router } from "express";
import { issueController } from "./issueController.js";
import { verifyToken } from "../../middleware/authMiddleware.js";
import { requireRole } from "../../middleware/roleMiddleware.js";

const router = Router();

// Issue management routes
// POST / - Create issue (authenticated)
// GET / - List all issues (public)
// GET /:id - Get single issue (public)
// PATCH /:id - Update issue (authenticated, role-based)
// DELETE /:id - Delete issue (maintainer only)
 
router.post("/", verifyToken, issueController.createIssue);
router.get("/", issueController.getAllIssues);
router.get("/:id", issueController.getSingleIssue);
router.patch("/:id", verifyToken, issueController.updateIssue);
router.delete("/:id", verifyToken, requireRole(["maintainer"]), issueController.deleteIssue);

export const issueRoute = router;
