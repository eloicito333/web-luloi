"use client"

import React, { useEffect, useRef } from 'react'
import NotificationComponents from '@/components/notifications/NotificationComponents';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import ActivatePWAModal from '@/components/modals/ActivatePWAModal';
import MoreContentSoon from '@/components/widgets/dashboard/MoreContentSoon';
import CounterWidget from '@/components/widgets/dashboard/CounterWidget';
import { useAppContext } from '@/components/Providers/AppProvider';
import LetterLauncherGroup from '@/components/widgets/dashboard/LetterLauncherGroup';


function Dashboard() {
  const [hasNotificationPermision, setHasNotificationPermission] = useLocalStorage('hasNotificationPermision', false)

  const {setIsPageLookingClear} = useAppContext()

  const openModalRef = useRef(null)
  const openModal = () => {openModalRef?.current?.click()}

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(globalThis?.window?.navigator.userAgent) && !globalThis?.window?.MSStream;
    if (isIOS && !globalThis?.window.matchMedia('(display-mode: standalone)').matches) openModalRef?.current?.click()

    else {
      setIsPageLookingClear(true)
    }
  }, [openModalRef, setIsPageLookingClear])


  return (
    <main className="p-4 flex flex-col gap-4 items-center h-full bg-gradient-to-t from-indigo-500 via-purple-400 to-pink-300 overflow-auto scrollbar-hide">

      <ActivatePWAModal openModalRef={openModalRef} />
      <NotificationComponents notificationState={[hasNotificationPermision, setHasNotificationPermission]} openModal={openModal} />

      <div 
        className='flex justify-center items-center'
      >
          <div className="flex flex-col justify-center items-center gap-4">
            <LetterLauncherGroup />
            <CounterWidget/>
            <MoreContentSoon />
          </div>
      </div>
    </main>
  )
}

export default Dashboard