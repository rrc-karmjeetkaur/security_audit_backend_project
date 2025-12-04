import { Request, Response, NextFunction } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';
import { AuthenticationError } from '../errors/errors';
import { getErrorMessage, getErrorCode } from '../utils/errorUtils';
import { auth } from '../../../config/firebaseConfig';

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;
    if(!token) throw new AuthenticationError('Unauthorized: No token provided','TOKEN_NOT_FOUND');
    const decoded: DecodedIdToken = await auth.verifyIdToken(token);
    res.locals.uid = decoded.uid;
    res.locals.role = (decoded as any).role || (decoded as any).claims?.role;
    return next();
  } catch (error: unknown) {
    if (error instanceof AuthenticationError) return next(error);
    if (error instanceof Error) return next(new AuthenticationError(`Unauthorized: ${getErrorMessage(error)}`, getErrorCode(error)));
    return next(new AuthenticationError('Unauthorized: Invalid token','TOKEN_INVALID'));
  }
};
export default authenticate;
