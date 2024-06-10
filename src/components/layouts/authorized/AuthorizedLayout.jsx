'use client'

import { useSession } from 'next-auth/react'

import React from 'react'
import AuthorizedNavbar from './AuthorizedNavbar'

function AuthorizedLayout({children}) {
  const { data: session } = useSession()
  const {user} = session
  
  return (
    <div className='bg-pink-200 w-full h-screen'>
      <header className='text-white'>
        <AuthorizedNavbar user={user} />
      </header>
      <main className='h-full'>
        {children}
      </main>
    </div>
  )
}

export default AuthorizedLayout