// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyBMRTZLvGgf9Dbq2GkhMjJj8MMu2KJBTgA",
  authDomain: "web-luloi.firebaseapp.com",
  projectId: "web-luloi",
  storageBucket: "web-luloi.appspot.com",
  messagingSenderId: "129975875380",
  appId: "1:129975875380:web:2f26c28265d5e47190d761",
  measurementId: "G-7MM7FL5M3Z"
};

firebase.initializeApp(firebaseConfig);


class CustomPushEvent extends Event {
  constructor(data) {
    super('push');

    Object.assign(this, data);
    this.custom = true;
  }
}

/*
 * Overrides push notification data, to avoid having 'notification' key and firebase blocking
 * the message handler from being called
 */
self.addEventListener('push', (e) => {
  // Skip if event is our own custom event
  if (e.custom) return;

  // Kep old event data to override
  const oldData = e.data;

  // Create a new event to dispatch, pull values from notification key and put it in data key,
  // and then remove notification key
  const newEvent = new CustomPushEvent({
    data: {
      ehheh: oldData.json(),
      json() {
        const newData = oldData.json();

        for(const key in newData.data) {
          try {
            newData.data[key] = JSON.parse(newData.data[key]) || newData.data[key]
            console.log(`transformed ${key} key into ${newData.data[key]}`)
          } catch {}
        }

        newData.data = {
          ...newData.data,
          notification: {...newData.notification},
        };
        delete newData.notification;
        return newData;
      },
    },
    waitUntil: e.waitUntil.bind(e),
  });

  // Stop event propagation
  e.stopImmediatePropagation();

  // Dispatch the new wrapped event
  dispatchEvent(newEvent);
});

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
 // Customize notification here
  const notification = payload.data.notification

  const notificationTitle = notification.title;
  const notificationOptions = {
    ...notification,
    body: notification.body,
    icon: notification.icon || '/icon.png',
    badge: notification.icon || notification.badge || '/icon.png',
    data: payload.data
  };

  delete notificationOptions.data.notification

  self.registration.showNotification(notificationTitle, notificationOptions);

  self.addEventListener("notificationclick", async (event) => {
    console.log(event, globalThis)

    event.notification.close();
    try {
      if(event.notification.data.link) {
        const link = globalThis.location.origin + event.notification.data.link
        let linkOpened = false

        // Focus an existing tab if it matches the URL, otherwise open a new one
        event.waitUntil(
          clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
              if (client.url === link && 'focus' in client) {
                client.focus();
                linkOpened = true;
                break;
              }
            }
            if (!linkOpened && clients.openWindow) {
              clients.openWindow(link);
            }
          })
        );
      }
    } catch (e) {
      console.log(e)
      //clients.openWindow("/")
    }
  })
});