import AuthorizedLayout from '@/components/layouts/authorized/AuthorizedLayout'
import React from 'react'

export const metadata = {
  title: 'Inici'
}

function DashboardLayout({children}) {
  return (
    <AuthorizedLayout>{children}</AuthorizedLayout>
  )
}

export default DashboardLayout