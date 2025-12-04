import request from "supertest";
import app from "../src/app"; // <-- correct for tests at repo root
import { auth } from "../src/config/firebaseConfig";

jest.mock("../src/config/firebaseConfig", () => ({
  auth: {
    verifyIdToken: jest.fn(),
  },
}));

describe("POST /api/v1/loans - Authentication and Authorization Integration", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return 401 with proper error format when no token provided", async () => {
    const response = await request(app).post("/api/v1/loans").send({ amount: 100 });
    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      success: false,
      error: {
        message: "Unauthorized: No token provided",
        code: "TOKEN_NOT_FOUND",
      },
      timestamp: expect.any(String),
    });
  });

  it("should return 403 with proper error format when user lacks role", async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
      uid: "user123",
      role: "user",
    });

    const response = await request(app)
      .post("/api/v1/loans")
      .set("Authorization", "Bearer valid-token")
      .send({ amount: 100 });

    expect(response.status).toBe(403);
    expect(response.body).toMatchObject({
      success: false,
      error: {
        message: "Forbidden: Insufficient role",
        code: "INSUFFICIENT_ROLE",
      },
      timestamp: expect.any(String),
    });
  });

  it("should succeed when user has proper role and token", async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
      uid: "admin123",
      role: "admin",
    });

    const response = await request(app)
      .post("/api/v1/loans")
      .set("Authorization", "Bearer valid-admin-token")
      .send({ amount: 100 });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({ amount: 100 });
  });
}); 