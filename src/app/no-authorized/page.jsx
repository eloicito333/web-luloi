"use client"

import { Button } from '@nextui-org/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React from 'react'

function NoAuthorized() {
  const searchParams = useSearchParams()

  return (
    <main className="flex justify-center items-center text-black bg-pink-200 gap-4 w-ful h-screen flex-col p-10">
      <h1 className="text-5xl font-extrabold">No estàs autoritzat per accedir a aquesta ruta</h1>
      <p className='pb-8'>Si es tracta d'un error, contacta amb el creador de la pàgina web i en breus moments estaràs autoritzat/da</p>
      <Button className="text-large"color="secondary" variant="flat" as={Link} href={searchParams.get('redirect') || "/"}>Reintentar</Button>
    </main>
  )
}

export default NoAuthorized