"use client"
import LogOutModal from '@/components/modals/LogOutModal'
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Navbar, NavbarBrand, NavbarContent } from '@nextui-org/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useRef } from 'react'

const userConfigItems = []
const adminConfigItems = [
  {
    name: 'Admin Dashboard',
    href: '/admin/dashboard',
  }
]

function AuthorizedNavbar({user}) {
  const openModalRef = useRef(null)
  const handleLogoutClick = () => {openModalRef.current.click()}

  return (
    <Navbar className='bg-pink-300/50' isBordered>
      <NavbarBrand className="flex justify-start items-center gap-2">
        <Image src="/icon.png" width={24} height={24} alt={"Icona de la pàgina"}/>
        <p className="title-gradient text-2xl font-bold">LULOI</p>
      </NavbarBrand>
      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              showFallback
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
            {(user?.role === "ADMIN" ? [...adminConfigItems, ...userConfigItems] : userConfigItems)
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