"use client"

import React from 'react'
import NotificationComponents from '@/components/notifications/NotificationComponents';
import { useLocalStorage } from '@/hooks/useLocalStorage';

function Dashboard() {
  const [hasNotificationPermision, setHasNotificationPermission] = useLocalStorage('hasNotificationPermision', false)

  return (
    <div className="p-4 flex flex-col gap-4 items-center h-full bg-gradient-to-t from-indigo-500 via-purple-400 to-pink-300">
      <NotificationComponents notificationState={[hasNotificationPermision, setHasNotificationPermission]} />
      {hasNotificationPermision && (
        {/* <div>has permission</div> */}
      )}
    </div>
  )
}

export default Dashboard