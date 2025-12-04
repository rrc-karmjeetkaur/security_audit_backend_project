import errorHandler from "../src/api/v1/middleware/errorHandler";
import { AuthenticationError, AuthorizationError, ServiceError } from "../src/api/v1/errors/errors";
import { HTTP_STATUS } from "../src/constants/httpConstants";

describe("errorHandler middleware", () => {
  let mockReq: any;
  let mockRes: any;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockReq = {};
    mockRes = { status: statusMock };
  });

  it("should handle AuthenticationError with correct status and message", () => {
    const error = new AuthenticationError("Invalid token", "TOKEN_INVALID");
    errorHandler(error as any, mockReq as any, mockRes as any, (() => {}) as any);
    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: { message: "Invalid token", code: "TOKEN_INVALID" },
      timestamp: expect.any(String),
    });
  });

  it("should handle AuthorizationError with correct status and message", () => {
    const error = new AuthorizationError("Insufficient permissions", "INSUFFICIENT_ROLE");
    errorHandler(error as any, mockReq as any, mockRes as any, (() => {}) as any);
    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.FORBIDDEN);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: { message: "Insufficient permissions", code: "INSUFFICIENT_ROLE" },
      timestamp: expect.any(String),
    });
  });

  it("should handle generic Error with 500 status", () => {
    const error = new Error("Unexpected error");
    errorHandler(error as any, mockReq as any, mockRes as any, (() => {}) as any);
    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: { message: "An unexpected error occurred", code: "UNKNOWN_ERROR" },
      timestamp: expect.any(String),
    });
  });

  it("should handle null error gracefully", () => {
    errorHandler(null as any, mockReq as any, mockRes as any, (() => {}) as any);
    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: { message: "An unexpected error occurred", code: "UNKNOWN_ERROR" },
      timestamp: expect.any(String),
    });
  });

  it("should handle ServiceError with custom status code", () => {
    const error = new ServiceError("Validation failed", "VALIDATION_ERROR");
(error as any).statusCode = 422; 
    errorHandler(error as any, mockReq as any, mockRes as any, (() => {}) as any);
    expect(statusMock).toHaveBeenCalledWith(422);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: { message: "Validation failed", code: "VALIDATION_ERROR" },
      timestamp: expect.any(String),
    });
  });
}); 