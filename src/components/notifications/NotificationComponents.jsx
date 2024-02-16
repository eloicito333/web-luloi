"use client"

import { Button, Card, CardBody } from '@nextui-org/react'
import React, { useEffect } from 'react'

import { motion } from 'framer-motion';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getNotificationToken } from '@/lib/firebase.client';

function NotificationComponents() {
  const [hasPermision, setHasPermission] = useLocalStorage('hasNotificationPermision', false)
  useEffect(async () => {
    if(globalThis?.window?.Notification?.permission !== "granted") setHasPermission(false)
  },[setHasPermission])

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
  }

  const registerServiceWorker = async () => {
    try{
      if (!globalThis?.window?.navigator || !('serviceWorker' in navigator)) return
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
      console.log('Service Worker registration successful:', registration);

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
    <>
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
          {/* <Notification /> */}
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
    </>
  )
}

export default NotificationComponents