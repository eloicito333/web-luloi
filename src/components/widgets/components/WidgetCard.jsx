import { Card, cn } from '@nextui-org/react'
import React from 'react'

function WidgetCard({children, className, mainAs, ...props}) {
  console.log(props)
  const Component = mainAs || Card
  return (
    <Component className={cn(`bg-pink-200/70 bg-opacity-50 p-2 sm:p-4 rounded-lg min-w-[334.55px] sm:min-w-[401.42px] flex justify-center items-center`, className)} {...props}>
      {children}
    </Component>
  )
}

export default WidgetCard