// routes.ts
import { Express } from "express";
import { AuthController } from "./controllers/authController";
import { ProfileController } from "./controllers/profileController";
import { AuthMiddleware } from "./controllers/authMiddleware";
import { UserController } from "./controllers/userController";
import { ConnectionController } from "./controllers/connectionController";
import { ChatController } from "./controllers/chatController";
import { FeedController } from "./controllers/feedController";
import { Request, Response } from "express";

export const defineRoutes = (app: Express) => {
  /**
   * @swagger 
   * /api:
   *   get:
   *     tags:
   *       - TESTING!!!
   *     summary: Test route
   *     description: This is a simple test route to check the server's health.
   *     responses:
   *       200:
   *         description: A successful response with a list of test users
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 test:
   *                   type: array
   *                   items:
   *                     type: string
   *                   example: ["berto", "matthew", "indra", "hs"]
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Internal server error"
   */
  app.get("/api", (req, res) => {
    res.json({ test: ["berto", "matthew", "indra", "hs"] });
  });

  app.get("/api/users", AuthMiddleware.authorization, UserController.getUsers);
  app.get(
    "/api/logged-id,",
    AuthMiddleware.authorization,
    UserController.getLoggedInUser
  );


  app.post(
    "/api/connections/request",
    AuthMiddleware.authorization,
    ConnectionController.sendConnectionRequest
  );
  app.get(
    "/api/connections/requests",
    AuthMiddleware.authorization,
    ConnectionController.getPendingRequests
  );
  app.post(
    "/api/connections/respond",
    AuthMiddleware.authorization,
    ConnectionController.respondToRequest
  );
  app.get(
    "/api/connections/:userId",
    AuthMiddleware.authorization,
    ConnectionController.getConnections
  );
  app.delete(
    "/api/connections/unconnect",
    AuthMiddleware.authorization,
    ConnectionController.unconnectConnection
  );

  // Feed routes
  app.get("/api/feed", AuthMiddleware.authorization, FeedController.getFeed);
  app.post(
    "/api/feed",
    AuthMiddleware.authorization,
    FeedController.createPost
  );
  app.put(
    "/api/feed/:post_id",
    AuthMiddleware.authorization,
    FeedController.updatePost
  );
  app.delete(
    "/api/feed/:post_id",
    AuthMiddleware.authorization,
    FeedController.deletePost
  );

  // Auth Routes
  /**
   * @swagger
   * /api/register:
   *   post:
   *     tags:
   *       - Auth
   *     summary: User registration
   *     description: Register a new user with username, email, password, and name.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *                 example: "john_doe"
   *               email:
   *                 type: string
   *                 example: "john@example.com"
   *               name:
   *                 type: string
   *                 example: "John Doe"
   *               password:
   *                 type: string
   *                 example: "Password123!"
   *               confirmPassword:
   *                 type: string
   *                 example: "Password123!"
   *     responses:
   *       201:
   *         description: User created successfully
   *       400:
   *         description: Bad request (e.g., missing fields, passwords do not match)
   *       500:
   *         description: Internal server error
   */
  app.post("/api/register", AuthController.signup);

  /**
   * @swagger
   * /api/login:
   *   post:
   *     tags:
   *       - Auth
   *     summary: User login
   *     description: Login with email and password to receive a JWT token.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 example: "JohnDoe@gmail.com"
   *               password:
   *                 type: string
   *                 example: "Password123!"
   *     responses:
   *       200:
   *         description: User logged in successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Login successful"
   *                 body:
   *                   type: object
   *                   properties:
   *                     token:
   *                       type: string
   *                       example: "your-jwt-token-here"
   *       400:
   *         description: Bad request (e.g., missing fields, incorrect email or password)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Email or Password is wrong"
   *       500:
   *         description: Internal server error (e.g., JWT_SECRET missing or other server issues)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Internal server error"
   */
  app.post("/api/login", AuthController.signin);

  /**
   * 
   * @swagger
   * /api/logout:
   *   post:
   *     tags:
   *       - Auth
   *     summary: User logout
   *     description: Logout the user by clearing the authentication token.
   *     responses:
   *       200:
   *         description: User logged out successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Logout success"
   *       400:
   *         description: Bad request (e.g., user is not logged in or token is missing)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "You are not logged in"
   */
  app.post("/api/logout", AuthController.logout);

  //testing protected route
  app.get("/api/protected", AuthMiddleware.authorization, (req, res) => {
    res.json({
      status: true,
      success: true,
      message: "You have access to this protected route",
      user: req.user,
    });
  });
  app.get("/api/user", AuthMiddleware.authorization, AuthController.getUser);
  app.get(
    "/api/user/:id",
    AuthMiddleware.authorization,
    AuthController.getUserById
  );

  /**
   * PROFILE ROUTES
   */
  app.get("/api/profil/:id", ProfileController.getProfile);
  app.put("/api/profil/:id", ProfileController.setProfile);
  app.get("/api/profil", ProfileController.getAllProfiles);


  /**
   * CHAT ROUTES
   *
  /**
   * @swagger
   * /api/chat/{userId}:
   *   get:
   *     tags:
   *       - Chat
   *     summary: Retrieve chat messages between two users
   *     description: Retrieve all chat messages between the authenticated user and the specified user.
   *     parameters:
   *       - name: userId
   *         in: path
   *         description: The ID of the user to fetch the chat messages with.
   *         required: true
   *         schema:
   *           type: integer
   *         example: 2
   *     responses:
   *       200:
   *         description: Chat messages retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Chat found"
   *                 body:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         description: The unique ID of the chat message.
   *                         example: "1"
   *                       from_id:
   *                         type: string
   *                         description: The ID of the sender.
   *                         example: "1"
   *                       to_id:
   *                         type: string
   *                         description: The ID of the recipient.
   *                         example: "2"
   *                       message:
   *                         type: string
   *                         description: The chat message.
   *                         example: "Hello, how are you?"
   *                       timestamp:
   *                         type: string
   *                         format: date-time
   *                         description: The timestamp when the message was sent.
   *                         example: "2024-12-06T14:30:00Z"
   *       404:
   *         description: No chat messages found between the users
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Chat not found"
   *                 body:
   *                   type: null
   *       500:
   *         description: Internal server error (e.g., database issues)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Failed to retrieve chat"
   *                 body:
   *                   type: null
  */
  app.get(
    "/api/chat/:userId",
    AuthMiddleware.authorization,
    ChatController.getChat
  );

  /**
   * @swagger
   * /api/chat/store/:
   *   post:
   *     tags:
   *       - Chat
   *     summary: Store a new chat message
   *     description: Store a new chat message from one user to another.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               to_id:
   *                 type: integer
   *                 description: The ID of the user the message is sent to.
   *                 example: 2
   *               message:
   *                 type: string
   *                 description: The chat message being sent.
   *                 example: "Hello, how are you?"
   *               timestamp:
   *                 type: string
   *                 format: date-time
   *                 description: The timestamp when the message was sent.
   *                 example: "2024-12-06T14:30:00Z"
   *     responses:
   *       200:
   *         description: Chat message stored successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Chat stored"
   *                 body:
   *                   type: string
   *                   example: "MASUK"
   *       400:
   *         description: Bad request (e.g., missing fields)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Invalid data"
   *       500:
   *         description: Internal server error (failed to store chat)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Failed to store chat"
   *                 body:
   *                   type: string
   *                   example: null
   */
  app.post(
    "/api/chat/store/",
    AuthMiddleware.authorization,
    ChatController.storeChat
  );

  app.get(
    "/api/chat/connection/:userId",
    AuthMiddleware.authorization,
    ChatController.isConnected
  )
};
