'use client'

import { NextUIProvider } from "@nextui-org/react"
import { SessionProvider } from 'next-auth/react'

function Providers({children, nextAuthSession}) {
  return (
    <NextUIProvider>
      <SessionProvider session={nextAuthSession}>
        {children}
      </SessionProvider>
    </NextUIProvider>
  )
}

export default Providers