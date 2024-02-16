import {initializeApp} from 'firebase/app';
import {getMessaging, getToken, onMessage} from 'firebase/messaging'

const vapidKey = process.env.NEXT_PUBLIC_VAPID_KEY

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
};
 
const firebaseApp = initializeApp(firebaseConfig);

export const messaging = globalThis?.window?.navigator ? getMessaging() : {};

export const getNotificationToken = async (serviceWorkerRegistration ) => {
  try {
    console.log(firebaseApp)
    console.log('get notification')
    if(!globalThis?.window?.navigator) return ''
    console.log('get notification - nevagator exists')
    console.log(messaging, vapidKey)
    return getToken(messaging, {vapidKey, serviceWorkerRegistration}).then((token) => {
      console.log('token: ', token, !token)

      if(!token) return new Error('Empty token send by the browser: ', token)
      console.log('here')
      return token
    }).catch((e) => {throw new Error(e)})
    
  } catch (error) {
    console.error('An error ocurred while requesting the token to the browser: ', error)
  }
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