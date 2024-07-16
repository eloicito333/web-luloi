import React from 'react'
import { cn } from '@nextui-org/react'

function ConfigCard({field, className, ...props}) {
  const {name, description, type} = field

  return (
    <article className={cn("", className)} {...props} >
      <div>
        <h3 className='text-base font-semibold text-black'>{name}</h3>
        <p className='text-xs text-gray-500/75'>{description}</p>
      </div>
    </article>
  )
}

export default ConfigCard