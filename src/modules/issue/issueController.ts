import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../interfaces/authInterface.js";
import { issueService } from "./issueService.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";

// ================= CREATE ISSUE =================
const createIssue = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { title, description, type } = req.body;
  const reporter_id = req.user!.id;

  const newIssue = await issueService.createIssue(title, description, type, reporter_id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Issue created successfully",
    data: newIssue,
  });
});

// ================= GET ALL ISSUES =================
const getAllIssues = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const sort = (req.query.sort as string) || "newest";
  const type = req.query.type as string | undefined;
  const status = req.query.status as string | undefined;

  const issues = await issueService.getAllIssues(sort, type, status);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Issues retrieved successfully",
    data: issues,
  });
});

// ================= GET SINGLE ISSUE =================
const getSingleIssue = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const issueId = Number(req.params.id);

  if (!issueId) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Invalid issue id",
    });
  }

  const issue = await issueService.getIssueById(issueId);

  if (!issue) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Issue not found",
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Issue retrieved successfully",
    data: issue,
  });
});

// ================= UPDATE ISSUE =================
const updateIssue = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const issueId = Number(req.params.id);
  const { title, description, type, status } = req.body;
  const user = req.user!;

  if (isNaN(issueId)) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Invalid issue id",
    });
  }

  const issue = await issueService.getIssueById(issueId);

  if (!issue) {
    return sendResponse(res, {
      statusCode: 404,
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
      return sendResponse(res, {
        statusCode: 403,
        success: false,
        message: "Forbidden: You don't own this issue",
      });
    }

    if (!isOpen) {
      return sendResponse(res, {
        statusCode: 409,
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

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Issue updated successfully",
    data: updatedIssue,
  });
});

// ================= DELETE ISSUE =================
const deleteIssue = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const issueId = Number(req.params.id);

  if (isNaN(issueId)) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Invalid issue id",
    });
  }

  const isDeleted = await issueService.deleteIssue(issueId);

  if (!isDeleted) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Issue not found",
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Issue deleted successfully",
  });
});

export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
