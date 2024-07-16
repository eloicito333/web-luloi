import React from 'react'
import WidgetCard from '../../components/WidgetCard'
import { Button, cn } from '@nextui-org/react'
import {Divider} from "@nextui-org/divider";
import ConfigCard from './ConfigCard';
import { FaRotateLeft, FaCheck  } from "react-icons/fa6";


function ConfigSection({section, className, ...props}) {
  const {name, description, fields} = section

  return (
    <WidgetCard as="section" className={cn("flex flex-col justify-start items-start", className)} {...props} >
      <div className='w-full flex flex-row justify-between'>
        <h2 className="text-3xl font-bold text-black self-end ">{name}</h2>
        <div className='flex flex-row justify-center items-center gap-1 self-start'>
          <Button isIconOnly variant='faded' className='p-1.5 leading-none min-w-0 min-h-0 w-min h-min bg-pink-100 border-pink-300/75'><FaRotateLeft /></Button>
          <Button isIconOnly variant='faded' className='p-1.5 leading-none min-w-0 min-h-0 w-min h-min bg-pink-100 border-pink-300/75'><FaCheck /></Button>
        </div>
      </div>
      <p className="text-base text-gray-500">{description}</p>
      <Divider className='my-2' />
      <div className='w-full flex flex-col justify-start items-start gap-2'>
        {fields.map((field, index) => (
          <ConfigCard key={index} field={field} />
        ))}
      </div>
    </WidgetCard>
  )
}

export default ConfigSection