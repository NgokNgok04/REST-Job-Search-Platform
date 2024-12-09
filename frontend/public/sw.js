self.addEventListener("push", (event) => {
  if (!event.data) {
    console.error("Push event received without data.");
    return;
  }
  console.log(event.data.json());
  try {
    console.log("HEELLOOOO NIGGGAAAA");
    const data = event.data.json();
    console.log("hmmmm");
    const {
      title = "Notification",
      body = "",
      icon = "/profile.png",
      data: notificationData = {},
    } = data;
    console.log("BERHASIL EKSTRAK DATA");

    const notificationOptions = {
      body,
      icon,
      tag: notificationData.tag || "unique-tag",
      data: {
        url: notificationData.url || "/",
      },
    };
    console.log("NOTIFICATION OPTION", notificationOptions);
    console.log("INI NOTIFICATION OPTIONN");
    self.registration.showNotification(title, notificationOptions);
    console.log("SUKSES BOSSS");
  } catch (error) {
    console.error("Error parsing push event data:", error);
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const { url } = event.notification.data;

  if (url) {
    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clientList) => {
          for (const client of clientList) {
            if (client.url === url && "focus" in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow(url);
          }
        })
    );
  }
});
