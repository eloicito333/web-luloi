import React, { useState } from 'react'
import styles from './LetterInEnvelopeStyles.module.css'
import { motion } from 'framer-motion'

function LetterInEnvelope({ onClick, letterHasBeenRead, handleBackdropClick, isLetterOpened, setIsLetterOpened }) {


  const handleLetterClick = (event) => {
    // Prevent the click event from propagating to the backdrop
    event.stopPropagation();
    setIsLetterOpened(true)
    setTimeout(() => {
      console.log("timeout exec")
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
                  <p>
                    Carinyo,<br />
                    Avui fa sis mesos que, després del millor estiu de la meva vida, i després que em diguessis mil cops que t&apos;ho preguntes quan, segons tu, no anés borratxo, et vaig dir: &quot;Lucía Sánchez García García, vols ser la meva novia?&quot;. Des d&apos;aquell dia, que cada cop que et veig em fascino encara més, i penso: &quot;Com pot ser que una noia tan increïble estigui amb mi?&quot;
                  </p>
                  <p>
                    Estic escrivint aquesta carta per dir-te només dues coses. La primera és que t&apos;estimo, t&apos;estimo molt, i sempre ho faré. I la segona és donar-te les gràcies.
                  </p>
                  <p>
                    Et vull donar les gràcies per aquests sis mesos, per l&apos;últim estiu, per tots els moments en els que has vingut i m&apos;has fet companyia, i per tots els moments que encara no hem viscut, pero que viurem junts.
                  </p>
                  <p>
                    I tot i que ara quan estic escrivint això sembla tot una mica cursi i cutre, t&apos;ho dic de debò, que vull poder seguint-te fent una carta com aquesta cada any.
                  </p>
                  <p>
                    T&apos;estimo per sempre.
                  </p>
                  <span className="w-full text-end">Eloi Bul Cuadrat</span>
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