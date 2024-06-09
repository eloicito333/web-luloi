import React from 'react'
import {motion} from 'framer-motion'

function AnimatedCircles() {
  return (
    <motion.div className="absolute top-0 left-0 z-1 bg-transparent w-full h-full overflow-hidden">
        <motion.div
          className="backdrop-blur-sm bg-fuchsia-300/10 rounded-full w-[400px] sm:w-[450px] md:w-[500px] lg:w-[550px] aspect-square glass-shadowed absolute top-[-100px] right-[-150px] z-10"
          animate={{y: 0, x: 0}}
          initial={{y: -25, x: 50}}
          transition={{duration: 1, ease: 'easeOut', delay: 0}}
        />
        <motion.div
          className="backdrop-blur-sm bg-white/20 rounded-full w-[600px] sm:w-[800px] md:w-[1000px] aspect-square glass-shadowed absolute bottom-[-150px] md:bottom-[-300px] left-[-200px] md:left-[-300px] z-10"
          animate={{y: 0, x: 0}}
          initial={{y: 100, x: -50}}
          transition={{duration: 1, ease: 'easeOut', delay: 0}}
       />
        <motion.div
          className="backdrop-blur-sm bg-fuchsia-600/10 rounded-full w-[400px] sm:w-[600px] md:w-[800px] lg:w-[850px] aspect-square glass-shadowed absolute bottom-[-30px] sm:bottom-[-150px] md:bottom-[-250px] right-[-200px] z-10"
          animate={{y: 0, x: 0}}
          initial={{y: 75, x: 50}}
          transition={{duration: 1, ease: 'easeOut', delay: 0}}
        />
      </motion.div>
  )
}

export default AnimatedCircles