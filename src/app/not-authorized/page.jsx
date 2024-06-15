"use client"

import { Button } from '@nextui-org/react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import React from 'react'

function NotAuthorized() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const handleBackwardsBtnClick = () => {
    router.back()
  }

  return (
    <main className="flex justify-center items-center text-black bg-pink-200 gap-4 w-ful h-screen flex-col p-10">
      <h1 className="text-5xl font-extrabold">No estàs autoritzat per accedir a aquesta ruta</h1>
      <p className='pb-8'>Si es tracta d&apos;un error, contacta amb el creador de la pàgina web i en breus moments estaràs autoritzat/da</p>
      <div className='w-min flex sm:flex-row justify-center items-center gap-2'>
        <Button className="text-large w-full"color="primary" variant="flat" onClick={handleBackwardsBtnClick}>Enrrere</Button>
        <Button className="text-large w-full"color="secondary" variant="flat" as={Link} href={searchParams.get('redirect') || "/"}>Reintentar</Button>
      </div>
    </main>
  )
}

export default NotAuthorized