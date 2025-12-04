import { Request, Response, NextFunction } from "express";
import { ServiceError } from "../errors/errors";
import { successResponse } from "../models/responseModel";
export const createLoan = (req: Request, res: Response, next: NextFunction) => {
  try {
    const created = {
      id: `loan_${Date.now()}`,
      amount: req.body?.amount ?? 0,
      applicantId: req.body?.applicantId ?? null,
      status: "created",
      createdBy: (res.locals as any).uid ?? null,
    };

    return res.status(201).json(successResponse(created));
  } catch (err) {
    return next(new ServiceError("Failed to create loan", "LOAN_CREATE_ERROR"));
  }
};

export const getAllLoans = (_req: Request, res: Response, next: NextFunction) => {
  try {
    const loans = [
      { id: "loan_1", amount: 1000, status: "under_review" },
      { id: "loan_2", amount: 2500, status: "approved" },
    ];
    return res.json(successResponse(loans));
  } catch (err) {
    return next(new ServiceError("Failed to fetch loans", "LOANS_FETCH_ERROR"));
  }
};

export const getLoanById = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const loan = { id, amount: 1500, status: "under_review", applicantId: "app_123" };
    return res.json(successResponse(loan));
  } catch (err) {
    return next(new ServiceError("Failed to fetch loan by id", "LOAN_FETCH_ERROR"));
  }
};

export const updateLoan = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = { id, ...updates, updatedBy: (res.locals as any).uid ?? null, status: "updated" };
    return res.json(successResponse(updated));
  } catch (err) {
    return next(new ServiceError("Failed to update loan", "LOAN_UPDATE_ERROR"));
  }
};

export const deleteLoan = (req: Request, res: Response, next: NextFunction) => {
  try {
    // For a hardcoded stub we just return 204 No Content
    return res.status(204).send();
  } catch (err) {
    return next(new ServiceError("Failed to delete loan", "LOAN_DELETE_ERROR"));
  }
};