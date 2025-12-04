import { Request, Response, NextFunction } from "express";
import { AuthorizationError } from "../errors/errors";
import { AuthorizationOptions } from "../models/authorizationOptions";
import { MiddlewareFunction } from "../types/expressTypes";
const isAuthorized = (opts: AuthorizationOptions): MiddlewareFunction => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { role, uid } = res.locals as { role?: string; uid?: string };
      const { id } = req.params as { id?: string };

      
      if (opts.allowSameUser && id && uid === id) {
        return next();
      }

      if (!role) {
        throw new AuthorizationError("Forbidden: No role found", "ROLE_NOT_FOUND");
      }

      if (opts.hasRole.includes(role as any)) {
        return next();
      }

      throw new AuthorizationError("Forbidden: Insufficient role", "INSUFFICIENT_ROLE");
    } catch (err) {
      next(err);
    }
  };
};

export default isAuthorized;