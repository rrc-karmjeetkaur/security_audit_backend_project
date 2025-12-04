import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";


export async function setRole(req: Request, res: Response, next: NextFunction) {
  try {
    const { uid, role } = req.body;

    if (!uid || !role) {
      return res.status(400).json({ error: "uid and role are required" });
    }

    
    await admin.auth().setCustomUserClaims(uid, { role });

    return res.status(200).json({ message: "Role successfully assigned" });
  } catch (error) {
    console.error("Error setting role:", error);
    next(error); 
  }
}
