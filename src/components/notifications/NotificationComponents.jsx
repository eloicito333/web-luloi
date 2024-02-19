"use client"

import { Button, Card, CardBody } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'

import { motion } from 'framer-motion';
import { getNotificationToken } from '@/lib/firebase.client';
import Notification from '@/components/notifications/Notification';

function NotificationComponents({notificationState}) {
  const [hasNotificationPermision, setHasNotificationPermission] = notificationState
  const [isAdviceNotificationVisible, setIsAdviceNotificationVisible] = useState(false)
  
  useEffect(() => {
    if(globalThis?.window?.Notification?.permission !== "granted") setHasNotificationPermission(false)
    else {
      setIsAdviceNotificationVisible(true)
      const timer = setTimeout(() => {
        setIsAdviceNotificationVisible(false);
      }, 3000);
  
      // Clear the timer on component unmount to prevent memory leaks
      return () => clearTimeout(timer);
    }
  },[hasNotificationPermision])

  const AdviceNotificationVariants = {
    hidden: {
      opacity: 0,
      y: -50,
    },
    visible: {
      opacity: 1,
      y: 30,
      transition: {
        duration: 0.5,
      },
    },
  };

  const askForPermissionToReceiveNotifications = async (serviceWorkerRegistration) => {
    try {
      const token = await getNotificationToken(serviceWorkerRegistration)
      console.log('got token: ', token)
      
      // Send the token to your server to associate it with the use
      const response = await fetch('/api/notifications/control/subscribe', {
        method: 'POST',
        body: JSON.stringify({token})
      })
      if(response.status !== 200) return new Error('error while posting notification token')
      
      setHasNotificationPermission(true)

    } catch (error) {
      console.error('Error while requesting notification permission:', error);
    }
  }

  const registerServiceWorker = async () => {
    try{
      console.log(!globalThis?.window?.navigator)
      console.log(!('serviceWorker' in navigator))

      if (!globalThis?.window?.navigator || !('serviceWorker' in navigator)) return
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')

      console.log('Service Worker registration successful:', registration);

      return registration
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  const handleActivateNotificationsButtonClick = async () => {
    console.log('clicked notifi')
    try{
      const registration = await registerServiceWorker()
      await askForPermissionToReceiveNotifications(registration)
    } catch (error) {
      console.error('An error ocurred while activating the notifications on the browser: '. error)
    }
  }

  return (
    <div className="w-full flex justify-center items-center">
      {hasNotificationPermision ? (
        <div className="w-full relative flex justify-center items-center">
          <motion.div
            className="absolute"
            initial="hidden"
            animate={isAdviceNotificationVisible ? "visible" : "hidden"}
            variants={AdviceNotificationVariants}
            exit="hidden"
          >
            <Card
              isBordered
              className="h-min "
              shadow="sm"
            >
              <CardBody>
                <h6 className="text-xl font-bold flex justify-center items-center text-center">Gràcies per activar les notificacions 😘</h6>
              </CardBody>
            </Card>
          </motion.div>
          {<Notification />}
        </div>
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

export default NotificationComponents