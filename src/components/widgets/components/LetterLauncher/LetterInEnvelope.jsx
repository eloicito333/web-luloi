import React, { useState } from 'react'
import styles from './LetterInEnvelopeStyles.module.css'
import { motion } from 'framer-motion'

function LetterInEnvelope({ onClick, letterHasBeenRead, handleBackdropClick, isLetterOpened, setIsLetterOpened, children }) {


  const handleLetterClick = (event) => {
    // Prevent the click event from propagating to the backdrop
    event.stopPropagation();
    setIsLetterOpened(true)
    setTimeout(() => {
      letterHasBeenRead();
    }, 5000); 

    // Call the onClick function passed from the parent component (if provided)
    if (onClick) {
      onClick();
    }
  }

  return (
    <motion.div
      className={`${styles.container} ${isLetterOpened && styles.flap}`}
      onClick={handleBackdropClick}
      initial={{x: '-120vw'}}
      animate={{ x: 0 }}
      exit={{ x: '-120vw' }}
      transition={{duration: .1}}
    >
      <div className={styles.envelopeWrapper} onClick={handleLetterClick}>
        <div className={styles.envelope}>
            <div className={styles.letter}>
              <div className={`${styles.text} min-h-[500/3px] text-[10px] text-left flex flex-col gap-2`}>
                  {children}
              </div>
            </div>
            <div className={styles.envelopeBottomCover}></div>
        </div>
        <div className={styles.heart}></div>
      </div>
    </motion.div>
  )
}

export default LetterInEnvelope