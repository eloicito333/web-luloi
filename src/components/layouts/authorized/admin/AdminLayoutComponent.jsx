"use client"

import React, { useEffect } from 'react'
import Link from 'next/link'
import { IoSettingsSharp } from "react-icons/io5";
import {motion} from 'framer-motion'
import { useAppContext } from '@/components/Providers/AppProvider';
import { useWindowSize } from '@/hooks/useWindowSize';
import { SM_SCREEN_SIZE } from '@/lib/consts';

const SIDEBAR_LINKS = [
  {
    name: "Configuració",
    href: "/admin/config",
    icon: IoSettingsSharp
  }
]

function AdminLayoutComponent({children}) {
  const {isAdminSideBarOpen, setIsAdminSideBarOpen, isAdminSideBarToggleable, setIsAdminSideBarToggleable} = useAppContext()
  const windowSize = useWindowSize()
  useEffect(() => {
    setIsAdminSideBarToggleable(windowSize.width < SM_SCREEN_SIZE)
  }, [windowSize.width])

  const asideVariants = {
    open: {
      x: 0
    },
    closed: {
      x: -320
    }
  }

  const backdropVariants = {
    open: {
      opacity: .3
    },
    closed: {
      opacity: 0
    }
  }

  const handleBackdropClick = () => {
    console.log("Backdrop clicked", isAdminSideBarOpen, isAdminSideBarToggleable)
    setIsAdminSideBarOpen(false)
  }

  return (
    <div className="w-full h-full">
      {(isAdminSideBarToggleable && isAdminSideBarOpen) && (
        <motion.div
          className="w-screen h-full bg-black opacity-30 absolute top-[64px] left-0 z-[80]"
          animate={backdropVariants[(!isAdminSideBarToggleable || isAdminSideBarOpen) ? "open" :  "closed"]}
          initial={backdropVariants[!isAdminSideBarToggleable ? "open" :  "closed"]}
          transition={{duration: .3, ease: 'easeOut', delay: 0}}
          onClick={handleBackdropClick}
        ></motion.div>
      )}
      <motion.aside
        className="fixed top-[64px] left-0 h-[calc(100%-64px)] w-64 p-5 bg-[#f5bdf2] z-[85]"
        animate={asideVariants[(!isAdminSideBarToggleable || isAdminSideBarOpen) ? "open" :  "closed"]}
        initial={asideVariants[!isAdminSideBarToggleable ? "open" :  "closed"]}
        transition={{duration: .3, ease: 'easeOut', delay: 0}}
      >
        <ul className="list-none text-lg">
          {SIDEBAR_LINKS.map((element, index) => (
            <li key={index}><Link href={element.href} className="flex flex-row items-center gap-1"><element.icon />{element.name}</Link></li>
          ))}
        </ul>
        
      </motion.aside>
      <main className="ml-0 w-full sm:ml-64 sm:w-[calc(100%-256px)] h-full">
        {children}
      </main>
    </div>
  )
}

export default AdminLayoutComponent