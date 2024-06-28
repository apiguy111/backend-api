const { User } = require("../models/userModel");
const jwt = require("jsonwebtoken");
const {
  createUser,
  deleteUser,
  getUser,
  getAllUsers,
} = require("../controllers/userController");
const httpMocks = require("node-mocks-http");

jest.mock("../models/userModel");
jest.mock("jsonwebtoken");

describe("User Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  describe("createUser", () => {
    let req, res, next;

    beforeEach(() => {
      req = httpMocks.createRequest();
      res = httpMocks.createResponse({
        eventEmitter: require("events").EventEmitter,
      });
      next = jest.fn();
    });

    it("should create a new user and return a token", async () => {
      const mockUser = {
        _id: "123",
        email: "test@example.com",
        name: "Test User",
        age: 25,
        city: "Test City",
        zipCode: "12345",
        save: jest.fn().mockResolvedValue({
          _id: "123",
          email: "test@example.com",
          name: "Test User",
          age: 25,
          city: "Test City",
          zipCode: "12345",
        }),
      };

      req.body = {
        email: "test@example.com",
        name: "Test User",
        age: 25,
        city: "Test City",
        zipCode: "12345",
      };
      User.findOne.mockResolvedValue(null);
      User.mockImplementation(() => mockUser);
      jwt.sign.mockReturnValue("mockToken");

      await createUser(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(mockUser.save).toHaveBeenCalled();
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser._id, name: mockUser.name },
        process.env.JWT_SECRET
      );

      res.on("end", () => {
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
          _id: "123",
          email: "test@example.com",
          name: "Test User",
          age: 25,
          city: "Test City",
          zipCode: "12345",
        });
        expect(res.cookies.access_token.value).toBe("mockToken");
      });
      res.end();
    });

    it("should return 400 if user already exists", async () => {
      req.body = {
        email: "test@example.com",
        name: "Test User",
        age: 25,
        city: "Test City",
        zipCode: "12345",
      };
      User.findOne.mockResolvedValue({ email: "test@example.com" });

      await createUser(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({
        error: "User with this email already exists",
      });
    });

    it("should return 500 if there is an error creating the user", async () => {
      req.body = {
        email: "test@example.com",
        name: "Test User",
        age: 25,
        city: "Test City",
        zipCode: "12345",
      };
      User.findOne.mockResolvedValue(null);
      User.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error("Failed to save user")),
      }));

      await createUser(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({
        error: "An error occurred while creating the user",
      });
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("deleteUser", () => {
    it("should delete an existing user", async () => {
      req.params.id = "123";
      User.findByIdAndDelete.mockResolvedValue({ _id: "123" });

      await deleteUser(req, res, next);

      expect(User.findByIdAndDelete).toHaveBeenCalledWith("123");
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual("User has been deleted.");
    });

    it("should handle delete failure", async () => {
      req.params.id = "123";
      User.findByIdAndDelete.mockRejectedValue(new Error("Delete failed"));

      await deleteUser(req, res, next);

      expect(User.findByIdAndDelete).toHaveBeenCalledWith("123");
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("getUser", () => {
    it("should get an existing user", async () => {
      const mockUser = {
        _id: "123",
        email: "test@example.com",
        name: "Test User",
        age: 25,
        city: "Test City",
        zipCode: "12345",
      };

      req.params.id = "123";
      User.findById.mockResolvedValue(mockUser);

      await getUser(req, res, next);

      expect(User.findById).toHaveBeenCalledWith("123");
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockUser);
    });

    it("should handle user not found error", async () => {
      req.params.id = "456";
      User.findById.mockResolvedValue(null);

      await getUser(req, res, next);

      expect(User.findById).toHaveBeenCalledWith("456");
      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual("User not found");
    });

    it("should handle get user failure", async () => {
      req.params.id = "123";
      User.findById.mockRejectedValue(new Error("Get user failed"));

      await getUser(req, res, next);

      expect(User.findById).toHaveBeenCalledWith("123");
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("getAllUsers", () => {
    it("should get all users", async () => {
      const mockUsers = [
        {
          _id: "123",
          email: "test1@example.com",
          name: "Test User 1",
          age: 25,
          city: "Test City 1",
          zipCode: "12345",
        },
        {
          _id: "456",
          email: "test2@example.com",
          name: "Test User 2",
          age: 30,
          city: "Test City 2",
          zipCode: "67890",
        },
      ];

      User.find.mockResolvedValue(mockUsers);

      await getAllUsers(req, res, next);

      expect(User.find).toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockUsers);
    });

    it("should handle get all users failure", async () => {
      User.find.mockRejectedValue(new Error("Get all users failed"));

      await getAllUsers(req, res, next);

      expect(User.find).toHaveBeenCalled();
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({
        error: "An error occurred while fetching users",
      });
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
