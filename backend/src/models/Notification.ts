import { PushSubscription } from "@prisma/client";
import { InputJsonValue } from "@prisma/client/runtime/library";
import { z } from "zod";

export type PushSubs = {
  user_id: bigint | null;
  endpoint: string;
  keys: InputJsonValue;
};

export const PushSubsSchema = z.object({
  user_id: z
    .string()
    .refine(
      (val) => {
        try {
          BigInt(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "user_id must be a valid bigint" }
    )
    .transform((val) => BigInt(val))
    .nullable(),
  endpoint: z.string().min(1, "Endpoint cannot be empty"),
  keys: z
    .any()
    .refine(
      (value) => {
        try {
          JSON.stringify(value);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Keys must be a valid JSON object" }
    )
    .transform((value): InputJsonValue => value),
});

export type PushChatNotification = {
  name: string;
  to_id: bigint;
  room_id: bigint;
  message: string;
};

export const PushChatNotificationSchema = z.object({
  name: z.string(),
  to_id: z
    .string()
    .refine(
      (val) => {
        try {
          BigInt(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "user_id must be a valid bigint" }
    )
    .transform((val) => BigInt(val)),
  room_id: z
    .string()
    .refine(
      (val) => {
        try {
          BigInt(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "room_id must be a valid bigint" }
    )
    .transform((val) => BigInt(val)),
  message: z.string().trim().min(1, "Message cannot be empty"),
});

export type PushFeedNotification = {
  name: string;
  user_id: bigint;
  content: string;
};

export const PushFeedNotificationSchema = z.object({
  name: z.string().trim(),
  user_id: z
    .string()
    .refine(
      (val) => {
        try {
          BigInt(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "user_id must be a valid bigint" }
    )
    .transform((val) => BigInt(val)),
  content: z.string().trim().min(1, "Content cannot be empty"),
});
