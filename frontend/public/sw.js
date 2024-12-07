self.addEventListener("push", (event) => {
  if (!event.data) {
    console.log("Push event but no data.");
    return;
  }

  const data = event.data.json();
  console.log("DAPATTT BOSSCH :", data);

  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/logo.png",
    badge: "/profile.png",
  });

  self.addEventListener("notificationclick", (event) => {
    event.notification.close();
  });
});
// Listen for push events
// self.addEventListener("push", (event) => {
//   const data = event.data.json();
//   console.log("Push received:", data);

//   // Show notification
//   self.registration.showNotification(data.title, {
//     body: data.body,
//     icon: "/logo.png",
//   });
// });
