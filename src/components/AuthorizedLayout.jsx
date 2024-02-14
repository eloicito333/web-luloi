'use client'

import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Navbar, NavbarBrand, NavbarContent } from '@nextui-org/react'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const userConfigItems = []

function AuthorizedLayout({children}) {
  const { data: session } = useSession()
  const {user} = session

  const handleLogoutClick = () => signOut()
  
  return (
    <div className='bg-pink-200 w-full h-screen'>
      <header className='text-white'>
        <Navbar className='bg-pink-300/50' isBordered>
          <NavbarBrand className="flex justify-center items-center gap-2">
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
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Registrat com</p>
                  <p className="font-semibold">{user.email}</p>
                </DropdownItem>
                {userConfigItems.map(userConfigItem => (
                  <DropdownItem as={Link} href={userConfigItem.href} key={userConfigItem.name}>{userConfigItem.name}</DropdownItem>
                ))}
                <DropdownItem key="logout" color="danger" onClick={handleLogoutClick}>
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarContent>
        </Navbar>
      </header>
      <main className='h-full'>
        {children}
      </main>
    </div>
  )
}

export default AuthorizedLayout