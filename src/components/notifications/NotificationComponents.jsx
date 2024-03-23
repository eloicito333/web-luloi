"use client"

import { Button } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'

import { motion, AnimatePresence } from 'framer-motion';
import { getNotificationToken } from '@/lib/firebase.client';

function NotificationComponents({notificationState, openModal}) {
  const [hasNotificationPermision, setHasNotificationPermission] = notificationState
  const [isButtonLoading, setIsButtonLoading] = useState(false)
  
  useEffect(() => {
    if(globalThis?.window?.Notification?.permission !== "granted") setHasNotificationPermission(false)
  },[setHasNotificationPermission])

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
      setIsButtonLoading(false)
      openModal()
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
    console.log('activate notification button clicked')
    setIsButtonLoading(true)
    try{
      const registration = await registerServiceWorker()
      await askForPermissionToReceiveNotifications(registration)
      const Notification = globalThis?.window?.Notification
      setIsButtonLoading(false)
      if(Notification) new Notification("Luloi 🩵", { body: "Gràcies per activar les notificacions 😘", icon: "/icon.png" });

    } catch (error) {
      console.error('An error ocurred while activating the notifications on the browser: '. error)
    }
  }

  return (
    <AnimatePresence>
      {hasNotificationPermision && (
        <div className="w-full flex justify-center items-center min-w-[334.55px] sm:min-w-[401.42px]">
          <Button
              className="text-xl font-bold py-6"
              variant="flat"
              color="secondary"
              isLoading={isButtonLoading}
              onClick={handleActivateNotificationsButtonClick}
              as={motion.button}
              animate={{opacity: 1, y: 0}}
              initial={{opacity: 0, y: -30}}
              transition={{duration: .5, delay: .005}}
            >Activa les notificacions 🔔</Button>
        </div>
      )}
    </AnimatePresence>
  )
}

export default NotificationComponents