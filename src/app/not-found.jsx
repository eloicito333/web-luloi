"use client"

import { Button } from '@nextui-org/react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import React from 'react'

function NotFound() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const handleBackwardsBtnClick = () => {
    router.back()
  }

  return (
    <main className="flex justify-center items-center text-black bg-pink-200 gap-4 w-full h-screen flex-col p-10">
      <h1 className="text-5xl font-extrabold text-center">404 Ups...<div  className="h-4"/>
        Aquesta ruta no existeix
      </h1>
      <p className='pb-8 text-center'>Prova de revisar que està ben escrita, tornar enrrere, o contactar amb l'administrador si creus que es tracta d'un error</p>
      <div className='w-min flex sm:flex-row justify-center items-center gap-2'>
        <Button className="text-large w-full px-2" color="primary" variant="flat" onClick={handleBackwardsBtnClick}>Enrrere</Button>
        <Button className="text-large w-full px-2" color="secondary" variant="flat" as={Link} href={"/dashboard"}>Inici</Button>
      </div>
    </main>
  )
}

export default NotFound