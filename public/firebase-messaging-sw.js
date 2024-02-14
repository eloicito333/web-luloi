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

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
 // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});