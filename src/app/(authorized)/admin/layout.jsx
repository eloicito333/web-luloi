import Link from 'next/link'
import React from 'react'
import { IoSettingsSharp } from "react-icons/io5";

export const metadata = {
  title: 'Luloi - Admin Dashboard'
}

const SIDEBAR_LINKS = [
  {
    name: "Configuració",
    href: "/admin/config",
    icon: IoSettingsSharp
  }
]

function AdminLayout({children}) {
  return (
    <div className="w-full h-full">
      <aside className="fixed top-[65px] left-0 h-full w-64 bg-fuchsia-300/50 border-fuchsia-200 border-r p-5">
        <ul className="list-none text-lg">
          {SIDEBAR_LINKS.map((element, index) => (
            <li key={index}><Link href={element.href} className="flex flex-row items-center gap-1"><element.icon />{element.name}</Link></li>
          ))}
        </ul>
      </aside>
      <main className="ml-64 w-[100% -256px] h-full">
        {children}
      </main>
    </div>
  )
}

export default AdminLayout