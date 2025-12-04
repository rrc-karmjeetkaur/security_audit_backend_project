import { Router } from "express";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import {
  createLoan,
  getAllLoans,
  getLoanById,
  updateLoan,
  deleteLoan,
} from "../controllers/loans.controller";

const router = Router();
router.post(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["officer", "admin"] }),
  createLoan
);
router.get(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["officer", "admin", "auditor"] }),
  getAllLoans
);
router.get(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["officer", "admin", "auditor"] }),
  getLoanById
);
router.put(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["officer", "admin"], allowSameUser: false }),
  updateLoan
);
router.delete(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["admin"] }),
  deleteLoan
);

export default router;
