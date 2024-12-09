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
  /**
   * @swagger
   * /api/users:
   *   get:
   *     summary: Fetch a list of users with optional search.
   *     description: Retrieve a list of users, optionally filtering by a search query. If logged in, the connection status with each user is also included.
   *     tags:
   *       - Users
   *     parameters:
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         required: false
   *         description: A search term to filter users by username or full name.
   *         example: "John"
   *     responses:
   *       200:
   *         description: Successfully fetched users.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Users fetched successfully"
   *                 body:
   *                   type: object
   *                   properties:
   *                     users:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: string
   *                             example: "123"
   *                           username:
   *                             type: string
   *                             example: "johndoe"
   *                           full_name:
   *                             type: string
   *                             example: "John Doe"
   *                           profile_photo_path:
   *                             type: string
   *                             example: "/path/to/photo.jpg"
   *                           isConnected:
   *                             type: boolean
   *                             example: true
   *                     isLogin:
   *                       type: boolean
   *                       example: true
   *       500:
   *         description: Internal server error while fetching users.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Failed to fetch users."
   *                 error:
   *                   type: object
   *                   nullable: true
   *                   properties:
   *                     message:
   *                       type: string
   *                       example: "Database operation failed"
   */
  app.get("/api/users", UserController.getUsers);

  /**
   * @swagger
   * api/logged-in-user:
   *   get:
   *     summary: Get the logged-in user's ID
   *     description: Retrieve the ID of the currently logged-in user. Returns an error if no user is found.
   *     tags:
   *       - Users
   *     responses:
   *       200:
   *         description: Successfully retrieved the logged-in user's ID.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "User is logged in"
   *                 body:
   *                   type: string
   *                   example: "user123"
   *       401:
   *         description: Unauthorized access; no user is logged in.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Unauthorized: no user found"
   *                 error:
   *                   type: string
   *                   nullable: true
   *                   example: null
   */
  app.get(
    "/api/logged-id,",
    AuthMiddleware.authorization,
    UserController.getLoggedInUser
  );

  /**
   * @swagger
  //  * api/connections/requests:
   *   post:
   *     summary: Send a connection request
   *     description: Allows a logged-in user to send a connection request to another user.
   *     tags:
   *       - Connection
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               to_id:
   *                 type: string
   *                 description: The ID of the user to whom the connection request is being sent.
   *                 example: "12345"
   *     responses:
   *       201:
   *         description: Connection request sent successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Connection request sent successfully"
   *                 error:
   *                   type: string
   *                   nullable: true
   *                   example: null
   *                 body:
   *                   type: object
   *                   description: Serialized connection request details.
   *       400:
   *         description: Bad request due to invalid input or duplicate connection request.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Invalid or missing 'to_id' parameter"
   *                 error:
   *                   type: string
   *                   nullable: true
   *                   example: null
   *       401:
   *         description: Unauthorized; user is not logged in.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Unauthorized: Missing userId"
   *                 error:
   *                   type: string
   *                   nullable: true
   *                   example: null
   *       500:
   *         description: Server error while processing the request.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Failed to send connection request"
   *                 error:
   *                   type: object
   *                   nullable: true
   *                   properties:
   *                     code:
   *                       type: string
   *                       example: "SERVER_ERROR"
   *                     details:
   *                       type: string
   *                       example: "Error details here"
   */
  app.post(
    "/api/connections/request",
    AuthMiddleware.authorization,
    ConnectionController.sendConnectionRequest
  );

  /**
   * @swagger
   * api/connections/pending:
   *   get:
   *     summary: Get pending connection requests
   *     description: Fetches all pending connection requests for the logged-in user, ordered by the most recent.
   *     tags:
   *       - Connection
   *     responses:
   *       200:
   *         description: Successfully fetched pending connection requests.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Connection requests fetched successfully"
   *                 body:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       request:
   *                         type: object
   *                         properties:
   *                           from_id:
   *                             type: string
   *                             example: "12345"
   *                           to_id:
   *                             type: string
   *                             example: "67890"
   *                           created_at:
   *                             type: string
   *                             format: date-time
   *                             example: "2024-12-08T12:34:56Z"
   *                       user:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: string
   *                             example: "12345"
   *                           username:
   *                             type: string
   *                             example: "johndoe"
   *                           email:
   *                             type: string
   *                             example: "johndoe@example.com"
   *                           full_name:
   *                             type: string
   *                             example: "John Doe"
   *                           profile_photo_path:
   *                             type: string
   *                             nullable: true
   *                             example: "/uploads/profile/johndoe.jpg"
   *       401:
   *         description: Unauthorized; user is not logged in.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Unauthorized: Missing userId"
   *       500:
   *         description: Internal server error while processing the request.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Failed to fetch connection requests"
   *                 error:
   *                   type: object
   *                   nullable: true
   *                   properties:
   *                     code:
   *                       type: string
   *                       example: "SERVER_ERROR"
   *                     details:
   *                       type: string
   *                       example: "Database connection failed"
   */
  app.get(
    "/api/connections/requests",
    AuthMiddleware.authorization,
    ConnectionController.getPendingRequests
  );

  /**
   * @swagger
   * /api/connections/respond:
   *   post:
   *     summary: Respond to a connection request.
   *     description: Accepts or rejects a connection request sent to the logged-in user.
   *     tags:
   *       - Connections
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - to_id
   *               - action
   *             properties:
   *               to_id:
   *                 type: string
   *                 description: The ID of the user who sent the connection request.
   *                 example: "123"
   *               action:
   *                 type: string
   *                 description: The action to perform on the connection request.
   *                 enum:
   *                   - accept
   *                   - reject
   *                 example: "accept"
   *     responses:
   *       200:
   *         description: Successfully processed the connection request.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Request processed successfully."
   *                 body:
   *                   type: object
   *                   nullable: true
   *       400:
   *         description: Bad request due to missing or invalid parameters.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Invalid 'action' parameter. Allowed values: 'accept' or 'reject'"
   *                 error:
   *                   type: object
   *                   nullable: true
   *       401:
   *         description: Unauthorized due to missing or invalid authentication.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Unauthorized: Missing userId"
   *                 error:
   *                   type: object
   *                   nullable: true
   *       404:
   *         description: Connection request not found.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Request not found."
   *                 error:
   *                   type: object
   *                   nullable: true
   *       500:
   *         description: Internal server error while processing the request.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Failed to process connection request."
   *                 error:
   *                   type: object
   *                   properties:
   *                     code:
   *                       type: string
   *                       example: "SERVER_ERROR"
   *                     details:
   *                       type: string
   *                       example: "Database operation failed"
   */
  app.post(
    "/api/connections/respond",
    AuthMiddleware.authorization,
    ConnectionController.respondToRequest
  );

  /**
   * @swagger
   * api/connections/{userId}:
   *   get:
   *     summary: Get user connections
   *     description: Fetches the list of connections for a specified user. Optionally determines if the logged-in user is connected to each connection.
   *     tags:
   *       - Connection
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the user whose connections are being fetched.
   *         example: "12345"
   *     responses:
   *       200:
   *         description: Successfully fetched connections.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Connections fetched successfully"
   *                 body:
   *                   type: object
   *                   properties:
   *                     connections:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: string
   *                             example: "67890"
   *                           username:
   *                             type: string
   *                             example: "johndoe"
   *                           full_name:
   *                             type: string
   *                             example: "John Doe"
   *                           profile_photo_path:
   *                             type: string
   *                             nullable: true
   *                             example: "/uploads/profile/johndoe.jpg"
   *                           isConnected:
   *                             type: boolean
   *                             example: true
   *                     isLogin:
   *                       type: boolean
   *                       description: Indicates if the current user is logged in.
   *                       example: true
   *       400:
   *         description: Bad request due to invalid or missing parameters.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Invalid or missing 'userId' parameter"
   *                 error:
   *                   type: object
   *                   nullable: true
   *                   example: null
   *       500:
   *         description: Internal server error while processing the request.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Failed to fetch connections"
   *                 error:
   *                   type: object
   *                   nullable: true
   *                   properties:
   *                     code:
   *                       type: string
   *                       example: "SERVER_ERROR"
   *                     details:
   *                       type: string
   *                       example: "Database connection failed"
   */
  app.get("/api/connections/:userId", ConnectionController.getConnections);

  /**
   * @swagger
   * /connections/unconnect:
   *   post:
   *     summary: Unconnect two users
   *     description: Removes the connection between two users. Both directions of the connection are deleted.
   *     tags:
   *       - Connection
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               to_id:
   *                 type: string
   *                 description: The ID of the user to unconnect from.
   *                 example: "67890"
   *     responses:
   *       200:
   *         description: Connection successfully removed.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Connection unconnected successfully."
   *       400:
   *         description: Bad request due to invalid or missing parameters.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Invalid or missing 'to_id' parameter"
   *                 error:
   *                   type: object
   *                   nullable: true
   *                   example: null
   *       401:
   *         description: Unauthorized error due to missing user authentication.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Unauthorized: Missing userId"
   *                 error:
   *                   type: object
   *                   nullable: true
   *                   example: null
   *       404:
   *         description: Not found error if no connection exists between the users.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Connection not found. You have to connect first to unconnect"
   *                 error:
   *                   type: object
   *                   nullable: true
   *                   example: null
   *       500:
   *         description: Internal server error while processing the request.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Failed to unconnect connections"
   *                 error:
   *                   type: object
   *                   nullable: true
   *                   properties:
   *                     code:
   *                       type: string
   *                       example: "SERVER_ERROR"
   *                     details:
   *                       type: string
   *                       example: "Database operation failed"
   */
  app.delete(
    "/api/connections/unconnect",
    AuthMiddleware.authorization,
    ConnectionController.unconnectConnection
  );

  /**
   * @swagger
   * /api/feed:
   *   get:
   *     summary: Get User Feed
   *     description: Retrieve a paginated list of feed posts for the authenticated user and their connections.
   *     tags:
   *       - Feed
   *     parameters:
   *       - name: cursor
   *         in: query
   *         description: Cursor for pagination. Use the `nextCursor` value from the previous response.
   *         required: false
   *         schema:
   *           type: string
   *       - name: limit
   *         in: query
   *         description: Number of feed posts to retrieve per page. Defaults to 10.
   *         required: false
   *         schema:
   *           type: integer
   *           default: 10
   *       - name: Authorization
   *         in: header
   *         description: Bearer token for authentication.
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Successfully fetched feed posts.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 body:
   *                   type: object
   *                   properties:
   *                     posts:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           post:
   *                             type: object
   *                             properties:
   *                               id:
   *                                 type: string
   *                               content:
   *                                 type: string
   *                               created_at:
   *                                 type: string
   *                                 format: date-time
   *                               updated_at:
   *                                 type: string
   *                                 format: date-time
   *                           user:
   *                             type: object
   *                             properties:
   *                               id:
   *                                 type: string
   *                               username:
   *                                 type: string
   *                               email:
   *                                 type: string
   *                               full_name:
   *                                 type: string
   *                               profile_photo_path:
   *                                 type: string
   *                             required:
   *                               - id
   *                               - username
   *                               - email
   *                               - full_name
   *                     nextCursor:
   *                       type: string
   *                       nullable: true
   *       401:
   *         description: Unauthorized - User not logged in.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *       500:
   *         description: Internal Server Error.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 error:
   *                   type: string
   */

  app.get("/api/feed", AuthMiddleware.authorization, FeedController.getFeed);

  /**
   * @swagger
   * /api/feed/{post_id}:
   *   get:
   *     summary: Fetches a specific post by its ID.
   *     description: Retrieves a single post by its ID, with authorization checks based on user connection status.
   *     tags:
   *       - Feed
   *     parameters:
   *       - in: path
   *         name: post_id
   *         required: true
   *         description: The ID of the post to fetch.
   *         schema:
   *           type: string
   *           example: "123"
   *     responses:
   *       200:
   *         description: Successfully fetched post.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Post fetched successfully"
   *                 body:
   *                   type: object
   *                   properties:
   *                     post:
   *                       type: object
   *                       properties:
   *                         id:
   *                           type: string
   *                           example: "123"
   *                         content:
   *                           type: string
   *                           example: "This is a sample post content."
   *                         created_at:
   *                           type: string
   *                           format: date-time
   *                           example: "2024-12-09T12:00:00Z"
   *                         updated_at:
   *                           type: string
   *                           format: date-time
   *                           example: "2024-12-09T12:05:00Z"
   *                         user:
   *                           type: object
   *                           properties:
   *                             id:
   *                               type: string
   *                               example: "user123"
   *                             username:
   *                               type: string
   *                               example: "johndoe"
   *                             email:
   *                               type: string
   *                               example: "john.doe@example.com"
   *                             full_name:
   *                               type: string
   *                               example: "John Doe"
   *                             profile_photo_path:
   *                               type: string
   *                               example: "/path/to/profile/photo.jpg"
   *       400:
   *         description: Invalid post ID or user not authorized to view the post.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "You are not authorized to see this feed"
   *       401:
   *         description: Unauthorized error due to missing or invalid user authentication.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Unauthorized: User not logged in"
   *       500:
   *         description: Internal server error while fetching the post.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Failed to get post"
   *                 error:
   *                   type: string
   *                   example: "Database operation failed"
   */
  app.get(
    "/api/feed/:post_id",
    AuthMiddleware.authorization,
    FeedController.getPostById
  );

  /**
   * @swagger
   * /api/feed:
   *   post:
   *     summary: Create a new post.
   *     description: Allows the authenticated user to create a new post with up to 280 characters.
   *     tags:
   *       - Feed
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               content:
   *                 type: string
   *                 description: The content of the post (up to 280 characters).
   *                 example: "This is a new post!"
   *     responses:
   *       201:
   *         description: Post created successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Post created successfully"
   *                 body:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       example: "12345"
   *                     content:
   *                       type: string
   *                       example: "This is a new post!"
   *                     user_id:
   *                       type: string
   *                       example: "user123"
   *       400:
   *         description: Bad request due to invalid or missing parameters.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Content must not exceed 280 characters"
   *       401:
   *         description: Unauthorized error due to missing or invalid authentication.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Unauthorized: User not logged in"
   *       500:
   *         description: Internal server error while creating the post.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Failed to create post"
   *                 error:
   *                   type: string
   *                   example: "Database operation failed"
   */
  app.post(
    "/api/feed",
    AuthMiddleware.authorization,
    FeedController.createPost
  );

  /**
   * @swagger
   * /api/feed/{post_id}:
   *   put:
   *     summary: Update an existing post.
   *     description: Allows the authenticated user to update their own post, provided the post exists and the user is the owner.
   *     tags:
   *       - Feed
   *     parameters:
   *       - in: path
   *         name: post_id
   *         required: true
   *         description: The ID of the post to update.
   *         schema:
   *           type: string
   *           example: "12345"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               trimmed:
   *                 type: string
   *                 description: The new content for the post (up to 280 characters).
   *                 example: "This is the updated content of the post!"
   *     responses:
   *       200:
   *         description: Post updated successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Post updated successfully"
   *                 body:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       example: "12345"
   *                     content:
   *                       type: string
   *                       example: "This is the updated content of the post!"
   *                     user_id:
   *                       type: string
   *                       example: "user123"
   *       400:
   *         description: Bad request due to invalid content or missing parameters.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "trimmed must not exceed 280 characters"
   *       401:
   *         description: Unauthorized error due to missing or invalid authentication.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Unauthorized: User not logged in"
   *       403:
   *         description: Forbidden if the user is not the owner of the post.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "You are not authorized to edit this post"
   *       404:
   *         description: Not found if the post ID does not exist.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Post not found"
   *       500:
   *         description: Internal server error while updating the post.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Failed to update post"
   *                 error:
   *                   type: string
   *                   example: "Database operation failed"
   */
  app.put(
    "/api/feed/:post_id",
    AuthMiddleware.authorization,
    FeedController.updatePost
  );

  /**
   * @swagger
   * /api/feed/{post_id}:
   *   delete:
   *     summary: Delete a post.
   *     description: Allows the authenticated user to delete their own post.
   *     tags:
   *       - Feed
   *     parameters:
   *       - in: path
   *         name: post_id
   *         required: true
   *         description: The ID of the post to delete.
   *         schema:
   *           type: string
   *           example: "12345"
   *     responses:
   *       200:
   *         description: Post deleted successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Post deleted successfully"
   *       401:
   *         description: Unauthorized error due to missing or invalid authentication.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Unauthorized: User not logged in"
   *       403:
   *         description: Forbidden if the user is not the owner of the post.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "You are not authorized to delete this post"
   *       404:
   *         description: Not found if the post ID does not exist.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Post not found"
   *       500:
   *         description: Internal server error while deleting the post.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Failed to delete post"
   *                 error:
   *                   type: string
   *                   example: "Database operation failed"
   */
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

  /**
   * @swagger
   * /api/listchat:
   *   get:
   *     summary: Get chat rooms for the logged-in user
   *     description: Retrieves a list of chat rooms for the logged-in user, including the last message in each chat room.
   *     tags:
   *       - Chat
   *     responses:
   *       200:
   *         description: Chat rooms retrieved successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Chat rooms retrieved"
   *                 body:
   *                   type: object
   *                   properties:
   *                     chatRooms:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           otherUserId:
   *                             type: string
   *                             description: The ID of the other user in the chat room.
   *                             example: "12345"
   *                           lastMessage:
   *                             type: object
   *                             properties:
   *                               message:
   *                                 type: string
   *                                 description: The last message in the chat room.
   *                                 example: "Hey, how are you?"
   *                               from_id:
   *                                 type: string
   *                                 description: The ID of the user who sent the last message.
   *                                 example: "12345"
   *                               to_id:
   *                                 type: string
   *                                 description: The ID of the user who received the last message.
   *                                 example: "67890"
   *                               timestamp:
   *                                 type: string
   *                                 description: The timestamp of the last message.
   *                                 example: "2024-12-09T15:30:00Z"
   *       404:
   *         description: No chat rooms found for the logged-in user.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "No chat rooms found"
   *                 body:
   *                   type: object
   *                   nullable: true
   *                   example: null
   *       500:
   *         description: Internal server error.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Internal Server Error"
   *                 body:
   *                   type: object
   *                   nullable: true
   *                   example: null
   *     security:
   *       - bearerAuth: []
   */
  app.get(
    "/api/listchat",
    AuthMiddleware.authorization,
    ChatController.getChatRooms
  );

  /**
   * @swagger
   * /api/chat/connection/{userId}:
   *   get:
   *     summary: Check if the logged-in user is connected to another user
   *     description: Verifies if the logged-in user has a connection with the specified user.
   *     tags:
   *       - Chat
   *     parameters:
   *       - name: userId
   *         in: path
   *         required: true
   *         description: The ID of the user to check connection with.
   *         schema:
   *           type: integer
   *           example: 12345
   *     responses:
   *       200:
   *         description: The users are connected.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "User connected"
   *                 body:
   *                   type: object
   *                   properties:
   *                     connected:
   *                       type: boolean
   *                       example: true
   *       404:
   *         description: The users are not connected.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "User not connected"
   *                 body:
   *                   type: object
   *                   properties:
   *                     connected:
   *                       type: boolean
   *                       example: false
   *       500:
   *         description: Internal server error.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Internal Server Error"
   *                 body:
   *                   type: object
   *                   nullable: true
   *                   example: null
   */
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
