// routes.ts
import express, { Express } from "express";
import { AuthController } from "./controllers/authController";
import { ProfileController } from "./controllers/profileController";
import { AuthMiddleware } from "./controllers/authMiddleware";
import { UserController } from "./controllers/userController";
import { ConnectionController } from "./controllers/connectionController";
import { ChatController } from "./controllers/chatController";
import { FeedController } from "./controllers/feedController";
import { Request, Response } from "express";
import { notifController } from "./controllers/notifController";
import path from "path";
import upload from "./middleware/uploadImage";
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

  // User routes
  app.get("/api/users", UserController.getUsers);
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
  app.get("/api/connections/:userId", ConnectionController.getConnections);
  app.delete(
    "/api/connections/unconnect",
    AuthMiddleware.authorization,
    ConnectionController.unconnectConnection
  );

  // Feed routes
  app.get("/api/feed", AuthMiddleware.authorization, FeedController.getFeed);
  app.get(
    "/api/feed/:post_id",
    AuthMiddleware.authorization,
    FeedController.getPostById
  );
  app.get(
    "/api/feed/:post_id",
    AuthMiddleware.authorization,
    FeedController.getPostById
  );
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

  /** PROFILE ROUTES
  /**
   * @swagger
   * /api/profil/self:
   *   get:
   *     summary: Retrieve the current user's profile data.
   *     description: Fetches the profile information of the currently logged-in user.
   *     tags:
   *       - Profile
   *     responses:
   *       200:
   *         description: Success response with user data.
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
   *                   example: "Success get User Data"
   *                 body:
   *                   type: object
   *                   properties:
   *                     username:
   *                       type: string
   *                       example: "john_doe"
   *                     id:
   *                       type: string
   *                       example: "12345"
   *                     name:
   *                       type: string
   *                       example: "John Doe"
   *                     profile_photo:
   *                       type: string
   *                       example: "https://example.com/photo.jpg"
   *       401:
   *         description: Unauthorized if user is not logged in.
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
   *                   example: "User are not login!"
   *       500:
   *         description: Internal server error.
   */
  app.get("/api/profil/self", ProfileController.getSelf);
  /**
   * @swagger
   * /api/profil/{id}:
   *   get:
   *     summary: Retrieve a user's profile.
   *     description: Fetches profile information for a specific user by their ID. If the requesting user is logged in, additional data (e.g., connections, posts) is provided.
   *     tags:
   *       - Profile
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: The ID of the user whose profile is being retrieved.
   *         schema:
   *           type: integer
   *           example: 123
   *     responses:
   *       200:
   *         description: Success response with user profile data.
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
   *                   example: "Success get Profile Another People"
   *                 body:
   *                   type: object
   *                   properties:
   *                     username:
   *                       type: string
   *                       example: "johndoe"
   *                     name:
   *                       type: string
   *                       example: "John Doe"
   *                     work_history:
   *                       type: string
   *                       example: "Software Developer at XYZ Corp"
   *                     skills:
   *                       type: string
   *                       example: "JavaScript, React, Node.js"
   *                     isOwner:
   *                       type: boolean
   *                       example: false
   *                     isConnected:
   *                       type: boolean
   *                       example: true
   *                     connection_count:
   *                       type: string
   *                       example: "5"
   *                     profile_photo:
   *                       type: string
   *                       example: "https://example.com/profile.jpg"
   *                     relevant_posts:
   *                       type: object
   *                       additionalProperties: true
   *                       example: {}
   *       500:
   *         description: Internal server error.
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
   *                   example: "Internal Server Error"
   *       400:
   *         description: Invalid ID provided.
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
   *                   example: "Please enter valid id"
   *       404:
   *         description: User not found.
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
   *                   example: "User not found"
   */

  app.get("/api/profil/:id", ProfileController.getProfile);
  /**
   * @swagger
   * /api/profil/{id}:
   *   put:
   *     summary: Update a user's profile.
   *     description: Allows updating of a user's profile, including username, full name, work history, skills, and profile photo.
   *     tags:
   *       - Profile
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: The ID of the user whose profile is being updated.
   *         schema:
   *           type: integer
   *           example: 123
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *                 description: The user's username.
   *                 example: johndoe
   *               full_name:
   *                 type: string
   *                 description: The user's full name.
   *                 example: John Doe
   *               work_history:
   *                 type: string
   *                 description: The user's work history.
   *                 example: Software Developer at XYZ Corp
   *               skills:
   *                 type: string
   *                 description: The user's skills.
   *                 example: JavaScript, React, Node.js
   *               profile_photo_path:
   *                 type: string
   *                 format: binary
   *                 description: The user's profile photo file.
   *     responses:
   *       200:
   *         description: Success response after updating the profile.
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
   *                   example: "Profile updated successfully"
   *                 body:
   *                   type: object
   *                   properties:
   *                     username:
   *                       type: string
   *                       example: johndoe
   *                     full_name:
   *                       type: string
   *                       example: John Doe
   *                     work_history:
   *                       type: string
   *                       example: Software Developer at XYZ Corp
   *                     skills:
   *                       type: string
   *                       example: JavaScript, React, Node.js
   *                     profile_photo_path:
   *                       type: string
   *                       example: /store/profile.png
   *       400:
   *         description: Validation error, such as an empty username.
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
   *                   example: "Username can't be empty"
   *       500:
   *         description: Internal server error.
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
   *                   example: "Internal Server Error"
   */

  app.put(
    "/api/profil/:id",
    upload.single("profile_photo_path"),
    ProfileController.setProfile
  );

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
    "/api/listchat",
    AuthMiddleware.authorization,
    ChatController.getChatRooms
  );

  app.get(
    "/api/chat/connection/:userId",
    AuthMiddleware.authorization,
    ChatController.isConnected
  );

  /**
   * @swagger
   * /api/subscribe:
   *   post:
   *     summary: Subscribe a user for push notifications.
   *     description: Saves or updates the push subscription for a user.
   *     tags:
   *       - Notifications
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               endpoint:
   *                 type: string
   *                 description: The subscription endpoint.
   *                 example: "https://fcm.googleapis.com/fcm/send/abcd1234"
   *               keys:
   *                 type: object
   *                 description: The cryptographic keys used for the subscription.
   *                 properties:
   *                   auth:
   *                     type: string
   *                     example: "auth_key"
   *                   p256dh:
   *                     type: string
   *                     example: "p256dh_key"
   *               user_id:
   *                 type: integer
   *                 description: The ID of the user subscribing.
   *                 example: 123
   *     responses:
   *       200:
   *         description: Subscription saved successfully.
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
   *                   example: "Subscription saved successfully!"
   *       500:
   *         description: Error saving the subscription.
   */
  app.post("/api/subscribe", notifController.subscribe);
  /**
   * @swagger
   * /api/sendChat:
   *   post:
   *     summary: Send a chat notification to a user.
   *     description: Sends a push notification about a new chat message.
   *     tags:
   *       - Notifications
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: The sender's name.
   *                 example: "Alice"
   *               message:
   *                 type: string
   *                 description: The chat message content.
   *                 example: "Hello, how are you?"
   *               room_id:
   *                 type: integer
   *                 description: The ID of the chat room.
   *                 example: 456
   *               to_id:
   *                 type: integer
   *                 description: The ID of the recipient.
   *                 example: 789
   *     responses:
   *       200:
   *         description: Notification sent successfully.
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
   *                   example: "MANTAP BOS"
   *       500:
   *         description: Error sending the notification.
   */

  app.post("/api/sendChat", notifController.sendChat);
  /**
   * @swagger
   * /api/sendFeed:
   *   post:
   *     summary: Send a feed notification to connected users.
   *     description: Sends a push notification when a user posts a new feed.
   *     tags:
   *       - Notifications
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: The name of the user posting the feed.
   *                 example: "Bob"
   *               content:
   *                 type: string
   *                 description: The content of the feed post.
   *                 example: "Check out my latest project!"
   *               user_id:
   *                 type: integer
   *                 description: The ID of the user posting the feed.
   *                 example: 123
   *     responses:
   *       200:
   *         description: Feed notification sent successfully.
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
   *                   example: "Notification Feed success"
   *       500:
   *         description: Error sending the notification.
   */

  app.post("/api/sendFeed", notifController.sendFeed);

  app.use("/store", express.static(path.join(__dirname, "../store")));
};
