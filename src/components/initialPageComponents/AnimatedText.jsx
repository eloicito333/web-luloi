"use client"

import { motion} from 'framer-motion';
import React from 'react';


const AnimatedText = ({ children = '', delayTime = .25 , defaultDelay = 0, ...props}) => {
  let text = children

  let accumulatedDelayedItems = 0;

  return (
    <motion.div>
      {text.split('').map((char, index) => {
        if(char !== ' ') {accumulatedDelayedItems++}
        return (
        <motion.span 
          key={index} 
          display="inline-block"
          variants={{
            hidden: {opacity: 0},
            visible: {opacity: 1},
          }}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0, delay: defaultDelay + delayTime*accumulatedDelayedItems}}
          {...props}
        >
          {char}
        </motion.span>
      )})}
    </motion.div>
  );
};

export default AnimatedText;