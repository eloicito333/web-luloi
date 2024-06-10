'use client'

import { NextUIProvider } from "@nextui-org/react"
import { SessionProvider } from 'next-auth/react'
import { AppProvider } from "./AppProvider"

function Providers({children, nextAuthSession}) {
  return (
    <NextUIProvider>
      <SessionProvider session={nextAuthSession}>
        <AppProvider>
          {children}
        </AppProvider>
      </SessionProvider>
    </NextUIProvider>
  )
}

export default Providers