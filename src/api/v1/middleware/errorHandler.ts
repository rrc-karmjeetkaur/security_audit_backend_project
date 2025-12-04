import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/errors';
import { HTTP_STATUS } from '../../../constants/httpConstants';
import { errorResponse } from '../models/responseModel';

const errorHandler = (err: Error | null, _req: Request, res: Response, _next: NextFunction) => {
  if (!err) {
    console.error('Error: null or undefined');
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse('An unexpected error occurred','UNKNOWN_ERROR'));
  }
  console.error(err.message);
  if (process.env.NODE_ENV !== 'production') console.error(err.stack);
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(errorResponse(err.message, err.code));
  }
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse('An unexpected error occurred','UNKNOWN_ERROR'));
};
export default errorHandler;
