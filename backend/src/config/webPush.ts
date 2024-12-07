import webPush from "web-push";
import dotenv from "dotenv";

dotenv.config();

webPush.setVapidDetails(
  "mailto:vladimirmatthew791@gmail.com",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export default webPush;
