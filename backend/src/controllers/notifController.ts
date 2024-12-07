import { Request, response, Response } from "express";
import { PrismaClient } from "@prisma/client";
import responseAPI from "../utils/responseAPI";
import webPush from "../config/webPush";
import test from "node:test";
// import {
//   getAllSubscriptions,
//   saveSubscription,
// } from "../models/subscriptionModel";

type PushSubscriptionData = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

const prisma = new PrismaClient();

export const notifController = {
  getNotif: async (req: Request, res: Response) => {
    try {
      const notif = await prisma.pushSubscription.findFirst();
      // const payloadNotif = notif.map((not) => ({
      //   endpoint: not.endpoint,
      //   user_id: not.user_id,
      //   keys: not.keys,
      //   created_at: not.created_at,
      // }));
      responseAPI(res, 200, true, "nigger", { message: "cek" });
    } catch (error) {
      console.error(error);
    } finally {
      return;
    }
  },
  subscribe: async (req: Request, res: Response) => {
    const { endpoint, keys, user_id } = req.body;

    try {
      const testing = await prisma.pushSubscription.upsert({
        where: { endpoint },
        update: { keys, user_id },
        create: { endpoint, keys, user_id },
      });
      responseAPI(res, 200, true, "Subscription saved successfully!");
    } catch (error) {
      console.error("Error saving subscription:", error);
      responseAPI(res, 200, false, "Failed to save subscription");
    } finally {
      return;
    }
  },
  sendNotification: async (req: Request, res: Response) => {
    const { user_id, payload } = req.body;
    try {
      console.log("Payload received:", payload); // Log the payload
      const subscriptions = await prisma.pushSubscription.findMany({
        where: {
          user_id: user_id,
        },
      });
      if (subscriptions.length === 0) {
        responseAPI(res, 200, true, "NO SUBSCRIPTION FOUND");
        return;
      }

      Promise.all(
        subscriptions.map((subscription) => {
          const keys = subscription.keys as { p256dh?: string; auth?: string };
          if (
            keys &&
            typeof keys.p256dh === "string" &&
            typeof keys.auth === "string"
          ) {
            const payloadSubs = {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: keys.p256dh,
                auth: keys.auth,
              },
            };
            webPush.sendNotification(payloadSubs, JSON.stringify(payload));
          }
        })
      ).then(() =>
        responseAPI(res, 200, true, "KUKIRIM INI YA, KUKIRIM INI Y")
      );
      return;
      // responseAPI(res, 200, true, `test ${user_id}`, payload);
    } catch (error) {
      console.error(error);
    }
    return;
  },
};
//   try {
//     const subscriptions = await prisma.pushSubscription.findMany({
//       where: { user_id },
//     });

//     if (subscriptions.length === 0) {
//       return responseAPI(res, 200, false, "Error", {
//         error: "No Subscription found",
//       });
//     }
//     const notificationPromises = subscriptions.map((subscription) => {
//       const keys = subscription.keys as { p256dh?: string; auth?: string };
//       if (
//         keys &&
//         typeof keys.p256dh === "string" &&
//         typeof keys.auth === "string"
//       ) {
//         const pushSubscription = {
//           endpoint: subscription.endpoint,
//           keys: {
//             p256dh: keys.p256dh,
//             auth: keys.auth,
//           },
//         };
//         return webPush.sendNotification(
//           pushSubscription,
//           JSON.stringify(payload)
//         );
//       }
//     });
//     await Promise.all(notificationPromises);

//     responseAPI(res, 200, true, "Notification sent successfully");
//   } catch (error) {
//     console.error("Error sending notifications:", error);
//     responseAPI(res, 500, false, "Error sending notifications");
//   } finally {
//     return;
//   }
// },
// };

// subscriptions.forEach((subscription) => {
//   const keys = subscription.keys as { p256dh?: string; auth?: string };
//   if (
//     keys &&
//     typeof keys.p256dh === "string" &&
//     typeof keys.auth === "string"
//   ) {
//     const pushSubscription = {
//       endpoint: subscription.endpoint,
//       keys: {
//         p256dh: keys.p256dh,
//         auth: keys.auth,
//       },
//     };
//     webPush
//       .sendNotification(pushSubscription, JSON.stringify(payload))
//       .catch((err) => console.error("Error sending notification: ", err));
//   } else {
//     console.error(
//       `Invalid keys for subscription: ${subscription.endpoint}`
//     );
//   }
// });

// export const subscribe = async (req: Request, res: Response) => {
//   const subscription = req.body;

//   try {
//     await saveSubscription(subscription);
//     res.status(200).json({ message: "Subscription saved successfully!" });
//   } catch (error) {
//     console.error("Error saving subscription:", error);
//     res.status(500).json({ error: "Failed to save subscription" });
//   }
// };

// export const sendNotification = async () => {
//   const subscriptions = await getAllSubscriptions();

//   const payload = JSON.stringify({
//     title: "Hello from Push Notifications!",
//     body: "This is a test notification.",
//     icon: "/icon.png",
//   });

//   subscriptions.forEach((subscription) => {
//     webPush
//       .sendNotification(subscription, payload)
//       .catch((err) => console.error("Error sending notification:", err));
//   });
// };
