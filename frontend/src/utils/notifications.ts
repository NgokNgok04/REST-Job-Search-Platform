import client from "./axiosClient";

type NotifResponse = {
  status: boolean;
  message: string;
  body?: {
    message?: string;
  };
};

export const subscribeToPushNotifications = async (
  subscription: PushSubscription,
  userId: number
) => {
  try {
    console.log(subscription);
    const response = await client.post<NotifResponse>("/subscribe", {
      ...subscription.toJSON(),
      // keys: subscription.toJSON().keys,
      user_id: userId,
    });
    console.log("Subscription saved successfully:", response.data.message);
  } catch (error) {
    console.error("Error saving subscription:", error);
  }
};

export const enableNotifications = async (userId: number) => {
  if (!("serviceWorker" in navigator)) {
    console.error("Service workers are not supported in this browser.");
    return;
  }

  const registration = await navigator.serviceWorker.register("/sw.js");
  // const registration = await navigator.serviceWorker.ready;
  // console.log("vite public key :", import.meta.env.);
  console.log("vite public key :", import.meta.env.VITE_PUBLIC_VAPID_KEY);
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      import.meta.env.VITE_PUBLIC_VAPID_KEY!
    )!,
  });
  console.log("SUBSCRIPTION :", subscription);
  await subscribeToPushNotifications(subscription, userId);
};

// Helper function to convert VAPID key to Uint8Array
const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
