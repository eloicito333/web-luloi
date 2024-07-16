"use client"

import { useAppContext } from '@/components/Providers/AppProvider'
import UserIconFallback from '@/components/UserIconFallback'
import LogOutModal from '@/components/modals/LogOutModal'
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Navbar, NavbarBrand, NavbarContent, NavbarMenuToggle } from '@nextui-org/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useRef } from 'react'

const userConfigItems = []
const adminConfigItems = [
  {
    name: 'Admin Dashboard',
    href: '/admin/dashboard',
  }
]

function AuthorizedNavbar({user}) {
  const {isAdminSideBarOpen, setIsAdminSideBarOpen, isAdminSideBarToggleable} = useAppContext()

  const pathname = usePathname()

  const isAdminUser = user?.role === "ADMIN"
  const isAdminRoute = pathname.startsWith("/admin")

  const openModalRef = useRef(null)
  const handleLogoutClick = () => {openModalRef.current.click()}
  const handleMenuChange = (isOpen) => {
    setIsAdminSideBarOpen(isOpen)
  }

  return (
    <Navbar className='bg-pink-300/50' isMenuOpen={isAdminSideBarOpen}>
      <NavbarContent as="div" justify="start" className="flex flex-row justify-center items-center gap-4">
        {isAdminUser && isAdminRoute && (
          <NavbarMenuToggle
            onChange={handleMenuChange}
            aria-label={isAdminSideBarOpen ? "Tancar menú" : "Obrir menú"}
            className="sm:hidden navbar-menu-toggle"
          />
        )}
        <NavbarBrand as={Link} href={"/dashboard"} className="flex justify-start items-center gap-2">
          <Image src="/icon.png" width={24} height={24} alt={"Icona de la pàgina"}/>
          <span className="title-gradient text-2xl font-bold">LULOI</span>
        </NavbarBrand>
      </NavbarContent>
      
      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              showFallback={<UserIconFallback name={user.name} />}
              isBordered
              as="button"
              className="transition-transform opacity-100"
              color="secondary"
              name={user.name}
              size="sm"
              src={user.image}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem as="div" key="profile" className="h-14 gap-2">
              <p className="font-semibold">Registrat com</p>
              <p className="font-semibold">{user.email}</p>
            </DropdownItem>
            {(isAdminUser ? [...adminConfigItems, ...userConfigItems] : userConfigItems)
            .map(userConfigItem => (
              <DropdownItem as={Link} href={userConfigItem.href} key={userConfigItem.name}>{userConfigItem.name}</DropdownItem>
            ))}
            <DropdownItem key="logout" color="danger" onClick={handleLogoutClick}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
      <LogOutModal openModalRef={openModalRef} />
    </Navbar>
  )
}

export default AuthorizedNavbar