import React from 'react'
import {motion} from 'framer-motion'
import { Button } from '@nextui-org/react'

function AnimatedBtn({delay = 0, duration = .5, ease, ...props}) {

  return (
      <Button
        animate={{opacity: 1, y: 0}}
        initial={{opacity: 0, y: 30}}
        transition={{duration, ease, delay}}
        variant="flat"
        color="secondary"
        as={motion.button}
        {...props}
      >
        Claro que si guapo
      </Button>
  )
}

export default AnimatedBtn