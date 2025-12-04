import { Request, Response } from "express";
import authenticate from "../src/api/v1/middleware/authenticate"; // <-- note ../src/...
import { auth } from "../src/config/firebaseConfig";
import { AuthenticationError } from "../src/api/v1/errors/errors";
jest.mock("../src/config/firebaseConfig", () => ({
  auth: {
    verifyIdToken: jest.fn(),
  },
}));
describe("authenticate middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let nextFn: jest.Mock;

  beforeEach(() => {
    mockReq = { headers: {} };
    mockRes = { locals: {} };
    nextFn = jest.fn();
    (auth.verifyIdToken as jest.Mock).mockReset();
  });
 
  it("should pass AuthenticationError when no token is provided", async () => {
    await authenticate(mockReq as Request, mockRes as Response, nextFn);
    expect(nextFn).toHaveBeenCalledWith(expect.any(AuthenticationError));
    const err = nextFn.mock.calls[0][0];
    expect(err.message).toBe("Unauthorized: No token provided");
  });

  it("should pass AuthenticationError when token verification fails", async () => {
    mockReq.headers = { authorization: "Bearer invalid-token" };
    (auth.verifyIdToken as jest.Mock).mockRejectedValueOnce(new Error("Invalid token"));

    await authenticate(mockReq as Request, mockRes as Response, nextFn);
    expect(nextFn).toHaveBeenCalledWith(expect.any(AuthenticationError));
  });

  it("should set res.locals and call next when token is valid", async () => {
    mockReq.headers = { authorization: "Bearer valid-token" };
    (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({ uid: "test-uid", role: "admin" });

    await authenticate(mockReq as Request, mockRes as Response, nextFn);

    expect((mockRes.locals as any).uid).toBe("test-uid");
    expect((mockRes.locals as any).role).toBe("admin");
    expect(nextFn).toHaveBeenCalledWith();
  });

  it("should handle malformed authorization header", async () => {
    mockReq.headers = { authorization: "InvalidFormat" };
    await authenticate(mockReq as Request, mockRes as Response, nextFn);
    expect(nextFn).toHaveBeenCalledWith(expect.any(AuthenticationError));
  });
});