"use client"

import { Button, Card, CardBody } from '@nextui-org/react'
import React, { useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage';
import 'firebase/messaging';
import { getNotificationToken } from '@/lib/firebase.client';
import Notification from '@/components/notifications/Notification';
import { motion } from 'framer-motion';

function Dashboard() {
  const [hasPermision, setHasPermission] = useLocalStorage('hasNotificationPermision', false)

  useEffect(() => {
    if(window?.Notification?.permission !== "granted") setHasPermission(false)
  },[])

  const askForPermissionToReceiveNotifications = async () => {
    try {
      const token = await getNotificationToken()
      console.log('got token: ', token)
      // Send the token to your server to associate it with the use
      const response = await fetch('/api/notifications/claim/send-token', {
        method: 'POST',
        body: JSON.stringify({token})
      })
      if(response.status !== 200) return new Error('error while posting notification token')
      setHasPermission(true)

    } catch (error) {
      console.error('Error while requesting notification permission:', error);
    }
  };

  const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registration successful:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  };

  const handleActivateNotificationsButtonClick = async () => {
    try{
      await askForPermissionToReceiveNotifications()
      registerServiceWorker()
    } catch (error) {
      console.error('An error ocurred while activating the notifications on the browser: '. error)
    }
  }

  return (
    <div className="p-4 flex justify-center h-full bg-gradient-to-t from-indigo-500 via-purple-400 to-pink-300">
      {hasPermision ? (
        <>
          <Card
            isBordered
            className="h-min "
            shadow="sm"
          >
            <CardBody>
              <h2 className="text-xl font-bold">Notificacions activades 😘</h2>
            </CardBody>
          </Card>
          <Notification />
        </>
      ) : (
        <Button
          className="text-xl font-bold py-6"
          variant="flat"
          color="secondary"
          onClick={handleActivateNotificationsButtonClick}
          as={motion.button}
          animate={{opacity: 1, y: 0}}
          initial={{opacity: 0, y: -30}}
          transition={{duration: .5, delay: .005}}
        >Activa les notificacions 🔔</Button>
      )}
    </div>
  )
}

export default Dashboard