'use client'

import { useSession } from 'next-auth/react'

import React from 'react'
import AuthorizedNavbar from './AuthorizedNavbar'
import { ChatProvider } from '@/components/Providers/ChatProvider'
import ChatComponent from '@/components/chat/ChatComponent'

function AuthorizedLayout({children}) {
  const { data: session } = useSession()
  const {user} = session
  
  return (
    <ChatProvider>
      <div className='bg-pink-200 w-full h-dvh overflow-auto'>
        <AuthorizedNavbar user={user} />
        <div className='h-full text-black'>
          {children}
        </div>
        <ChatComponent />
      </div>
    </ChatProvider>
  )
}

export default AuthorizedLayout