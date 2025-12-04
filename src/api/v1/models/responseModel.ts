export const errorResponse = (message: string, code: string) => ({
  success: false, error: { message, code }, timestamp: new Date().toISOString()
});
export const successResponse = (data:any) => ({ success: true, data, timestamp: new Date().toISOString() });
