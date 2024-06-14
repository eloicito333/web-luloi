import AdminLayoutComponent from '@/components/layouts/authorized/admin/AdminLayoutComponent';

export const metadata = {
  title: 'Luloi - Admin Dashboard'
}

function AdminLayout({children}) {
  return (
    <AdminLayoutComponent>
      {children}
    </AdminLayoutComponent>
  )
}

export default AdminLayout