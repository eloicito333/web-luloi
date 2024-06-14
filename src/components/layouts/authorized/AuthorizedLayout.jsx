'use client'

import { useSession } from 'next-auth/react'

import React from 'react'
import AuthorizedNavbar from './AuthorizedNavbar'

function AuthorizedLayout({children}) {
  const { data: session } = useSession()
  const {user} = session
  
  return (
    <div className='bg-pink-200 w-full h-screen'>
      <AuthorizedNavbar user={user} />
      <div className='h-full text-black'>
        {children}
      </div>
    </div>
  )
}

export default AuthorizedLayout