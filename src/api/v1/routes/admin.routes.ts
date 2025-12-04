// src/api/v1/routes/admin.routes.ts
import { Router } from "express";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import { setRole } from "../controllers/admin.controller"; // ✅ named import

const router = Router();


router.post(
  "/claims",
  authenticate,                        
  isAuthorized({ hasRole: ["admin"] }), 
  setRole                               
);

export default router;

