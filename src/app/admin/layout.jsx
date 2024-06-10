import AuthorizedLayout from '@/components/layouts/authorized/AuthorizedLayout'
import React from 'react'

export const metadata = {
  title: 'Inici'
}

function AdminLayout({children}) {
  return (
    <AuthorizedLayout>{children}</AuthorizedLayout>
  )
}

export default AdminLayout