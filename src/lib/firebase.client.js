import {initializeApp} from 'firebase/app';
import {getMessaging, getToken, onMessage} from 'firebase/messaging'

const vapidKey = "BFyB4J1v0NwZVMkHhuk6GoOsg0fnMQSiGf5vsk_8ifLGPCRgjSWjdh4uiveti73s-qB__j_SV7mpOiJarrIuuno"

const firebaseConfig = {
  apiKey: "AIzaSyBMRTZLvGgf9Dbq2GkhMjJj8MMu2KJBTgA",
  authDomain: "web-luloi.firebaseapp.com",
  projectId: "web-luloi",
  storageBucket: "web-luloi.appspot.com",
  messagingSenderId: "129975875380",
  appId: "1:129975875380:web:2f26c28265d5e47190d761",
  measurementId: "G-7MM7FL5M3Z"
};
 
initializeApp(firebaseConfig);

export const messaging = globalThis?.window?.navigator ? getMessaging() : {};

export const getNotificationToken = async () => {
  if(!globalThis?.window?.navigator) return ''
  const token = await getToken(messaging, {vapidKey})
  
  if(!token) return new Error('Error while requesting the token to the browser')
  return token
}

export const onMessageListener = () => {
  if(!globalThis?.window?.navigator) return new Promise(() => resolve({}))
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("payload", payload)
      resolve(payload);
    });
  });
}