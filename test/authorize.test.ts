import isAuthorized from "../src/api/v1/middleware/authorize";
import { AuthorizationError } from "../src/api/v1/errors/errors";
import { Request, Response } from "express";
describe("isAuthorized middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let nextFn: jest.Mock;

  beforeEach(() => {
    mockReq = { params: {} };
    mockRes = { locals: {} };
    nextFn = jest.fn(); 
  });

  it("should call next() when user has required role", () => {
    mockRes.locals = { uid: "user123", role: "admin" };
    const mw = isAuthorized({ hasRole: ["admin", "manager"] });
    mw(mockReq as Request, mockRes as Response, nextFn);
    expect(nextFn).toHaveBeenCalledWith();
  });

  it("should pass AuthorizationError to next() when user has insufficient role", () => {
    mockRes.locals = { uid: "user123", role: "user" };
    const mw = isAuthorized({ hasRole: ["admin"] });
    mw(mockReq as Request, mockRes as Response, nextFn);
    expect(nextFn).toHaveBeenCalledWith(expect.any(AuthorizationError));
    const err = nextFn.mock.calls[0][0];
    expect(err.message).toBe("Forbidden: Insufficient role");
    expect(err.code).toBe("INSUFFICIENT_ROLE");
    expect(err.statusCode).toBe(403);
  });

  it("should call next() when same user and allowSameUser is true", () => {
    mockReq.params = { id: "user123" };
    mockRes.locals = { uid: "user123", role: "user" };
    const mw = isAuthorized({ hasRole: ["admin"], allowSameUser: true });
    mw(mockReq as Request, mockRes as Response, nextFn);
    expect(nextFn).toHaveBeenCalledWith();
  });

  it("should pass AuthorizationError to next() when role is missing", () => {
    mockRes.locals = { uid: "user123" };
    const mw = isAuthorized({ hasRole: ["admin"] });
    mw(mockReq as Request, mockRes as Response, nextFn);
    expect(nextFn).toHaveBeenCalledWith(expect.any(AuthorizationError));
    const err = nextFn.mock.calls[0][0];
    expect(err.message).toBe("Forbidden: No role found");
    expect(err.code).toBe("ROLE_NOT_FOUND");
  });

  it("should not allow same user when allowSameUser is false", () => {
    mockReq.params = { id: "user123" };
    mockRes.locals = { uid: "user123", role: "user" };
    const mw = isAuthorized({ hasRole: ["admin"], allowSameUser: false });
    mw(mockReq as Request, mockRes as Response, nextFn);
    expect(nextFn).toHaveBeenCalledWith(expect.any(AuthorizationError));
  });
});