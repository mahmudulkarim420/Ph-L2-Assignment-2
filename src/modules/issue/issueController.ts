import type { Response } from "express";
import type { AuthRequest } from "../../interfaces/authInterface.js";
import { issueService } from "./issueService.js";

// ================= CREATE ISSUE =================
const createIssue = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, type } = req.body;
    const reporter_id = req.user!.id;

    const newIssue = await issueService.createIssue(title, description, type, reporter_id);

    return res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: newIssue,
    });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: err.message,
    });
  }
};

// ================= GET ALL ISSUES =================
const getAllIssues = async (req: AuthRequest, res: Response) => {
  try {
    const sort = (req.query.sort as string) || "newest";
    const type = req.query.type as string | undefined;
    const status = req.query.status as string | undefined;

    const issues = await issueService.getAllIssues(sort, type, status);

    return res.status(200).json({
      success: true,
      data: issues,
    });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: err.message,
    });
  }
};

// ================= GET SINGLE ISSUE =================
const getSingleIssue = async (req: AuthRequest, res: Response) => {
  try {
    const issueId = Number(req.params.id);

    if (!issueId) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue id",
      });
    }

    const issue = await issueService.getIssueById(issueId);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: issue,
    });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: err.message,
    });
  }
};

// ================= UPDATE ISSUE =================
const updateIssue = async (req: AuthRequest, res: Response) => {
  try {
    const issueId = Number(req.params.id);
    const { title, description, type, status } = req.body;
    const user = req.user!;

    if (isNaN(issueId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue id",
      });
    }

    const issue = await issueService.getIssueById(issueId);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    const isMaintainer = user.role === "maintainer";
    const isOwner = issue.reporter.id === user.id;
    const isOpen = issue.status === "open";

    // ❗ Permission check
    if (!isMaintainer) {
      if (!isOwner) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You don't own this issue",
        });
      }

      if (!isOpen) {
        return res.status(409).json({
          success: false,
          message: "Conflict: Cannot edit a non-open issue",
        });
      }
    }

    // ❗ ROLE-BASED UPDATE CONTROL (IMPORTANT FIX)
    let updatedIssue;

    if (isMaintainer) {
      updatedIssue = await issueService.updateIssue(issueId, title, description, type, status);
    } else {
      updatedIssue = await issueService.updateIssue(issueId, title, description, type);
    }

    return res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: updatedIssue,
    });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: err.message,
    });
  }
};

// ================= DELETE ISSUE =================
const deleteIssue = async (req: AuthRequest, res: Response) => {
  try {
    const issueId = Number(req.params.id);
    const user = req.user!;

    if (isNaN(issueId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue id",
      });
    }

    if (user.role !== "maintainer") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only maintainers can delete issues",
      });
    }

    const isDeleted = await issueService.deleteIssue(issueId);

    if (!isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: err.message,
    });
  }
};

export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
