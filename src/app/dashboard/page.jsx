"use client"

import React, { useEffect, useRef } from 'react'
import NotificationComponents from '@/components/notifications/NotificationComponents';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import CountdownWidget from '@/components/widgets/Countdown';
import ActivatePWAModal from '@/components/modals/ActivatePWAModal';

function Dashboard() {
  const [hasNotificationPermision, setHasNotificationPermission] = useLocalStorage('hasNotificationPermision', false)

  const openModalRef = useRef(null)
  const openModal = () => {openModalRef?.current?.click()}

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(globalThis?.window?.navigator.userAgent) && !globalThis?.window?.MSStream;
    if (isIOS && !globalThis?.window.matchMedia('(display-mode: standalone)').matches) openModalRef?.current?.click()
  }, [openModalRef])


  return (
    <div className="p-4 flex flex-col gap-4 items-center h-full bg-gradient-to-t from-indigo-500 via-purple-400 to-pink-300">

      <ActivatePWAModal openModalRef={openModalRef} />
      <NotificationComponents notificationState={[hasNotificationPermision, setHasNotificationPermission]} openModal={openModal} />
      <div>
        {hasNotificationPermision && (
          <div>
            <CountdownWidget initialTime={new Date()}/>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard