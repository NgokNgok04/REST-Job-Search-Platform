import { Request, response, Response } from "express";
import { PrismaClient } from "@prisma/client";
import responseAPI from "../utils/responseAPI";
import webPush from "../config/webPush";
import test from "node:test";
import { PushChatNotificationSchema } from "../models/Notification";
import { JsonValue } from "@prisma/client/runtime/library";
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
  subscribe: async (req: Request, res: Response) => {
    const { endpoint, keys, user_id } = req.body;

    try {
      await prisma.pushSubscription.upsert({
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
  sendChat: async (req: Request, res: Response) => {
    console.log("MASUK API BACKEND SENDCHAT");
    try {
      const data = PushChatNotificationSchema.parse(req.body);
      const notificationPayload = {
        title: `New Message from ${data.name}`,
        body: `${data.name} has send new message, go check it out!`,
        description: data.message,
        icon: "http://localhost:5173/profile.png",
        data: {
          url: `http://localhost/chat/${data.room_id}`,
        },
      };
      console.log("BERHASIL CONVERT KE PAYLOAD");

      const targetSubs = await prisma.pushSubscription.findMany({
        where: {
          user_id: data.to_id,
        },
      });
      console.log("DAPAT TARGET SUB");

      const subscriptions = targetSubs.map(
        (target: {
          endpoint: string;
          user_id: bigint | null;
          keys: JsonValue;
          created_at: Date;
        }) => {
          const keys = target.keys as { auth: string; p256dh: string };
          return {
            endpoint: target.endpoint,
            keys: {
              auth: keys.auth,
              p256dh: keys.p256dh,
            },
          };
        }
      );
      console.log("DAPAT LIST OF SUBSCRIPTIONNN");

      const sendNotifications = subscriptions.map(
        async (subscription: {
          endpoint: string;
          keys: {
            auth: string;
            p256dh: string;
          };
        }) => {
          try {
            await webPush.sendNotification(
              subscription,
              JSON.stringify(notificationPayload)
            );
          } catch (error) {
            if ((error as any)?.statusCode === 410) {
              console.log(
                `Subscription ${subscription.endpoint} is no longer valid. Removing from database.`
              );
              await prisma.pushSubscription.delete({
                where: {
                  endpoint: subscription.endpoint,
                },
              });
            } else {
              console.error("Error sending notification:", error);
            }
          }
        }
      );

      await Promise.all(sendNotifications);

      console.log("Push notification for chats");
      responseAPI(res, 200, true, "MANTAP BOS");
    } catch (error) {
      console.log(error);
      responseAPI(res, 200, true, "SALAH BOS");
    }
  },
};
