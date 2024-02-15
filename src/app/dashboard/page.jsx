"use client"

import React from 'react'
import NotificationComponents from '@/components/notifications/NotificationComponents';

function Dashboard() {
  console.log('here')
  try{if (typeof globalThis?.globalThis?.window === undefined || typeof globalThis?.globalThis?.window?.navigator === undefined) return (<div></div>)} catch{}

  return (
    <div className="p-4 flex justify-center h-full bg-gradient-to-t from-indigo-500 via-purple-400 to-pink-300">
      <NotificationComponents />
    </div>
  )
}

export default Dashboard