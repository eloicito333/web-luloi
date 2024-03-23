import React, { useEffect, useState } from 'react'
import WidgetCard from './components/WidgetCard'
import LetterInEnvelope from './components/LetterLauncher/LetterInEnvelope'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocalStorage } from '@/hooks/useLocalStorage'

function LetterLauncher() {
  const [isLetterOpened, setIsLetterOpened ] = useState(false)
  const [hasLetterBeenRead, setHasLetterBeenRead] = useLocalStorage("hasLetterBeenRead", undefined)
  console.log(hasLetterBeenRead)

  const [isLetterOpened_, setIsLetterOpened_] = useState(false)


  const letterHasBeenRead = () => {
    if (isLetterOpened) {
      (async () => {
        const response = await fetch('/api/widgetIsNew?widget=letterWidget', {
          method: 'POST',
          body: JSON.stringify({widgetState: true})
        })
        if(response.status !== 200) throw new Error('error while posting letterWidget state')
        setHasLetterBeenRead(true)
      })()
    }
  }

  useEffect(() => {
    if (hasLetterBeenRead === undefined) {
      (async () => {
        const response = await fetch('/api/widgetIsNew?widget=letterWidget')
        if(response.status !== 200) throw new Error('error while retrieving letterWidget state')
        const currentState = (await response.json()).widgetIsNew
        if(!currentState) {
          throw new Error('error while retrieving lastAniversaryDateSeen data')
        }
        setHasLetterBeenRead(currentState)
      })()
    }
  })

  const handleCardClick = () => {
    console.log("clicked")
    setIsLetterOpened(true)
  }

  const handleBackdropClick = () => {
    setIsLetterOpened_(false)
    setTimeout(() => {
      setIsLetterOpened(false)
    }, 900)
  }
  return (
    <WidgetCard className="overflow-visible static p-0 m-0 h-auto">
      <div className="w-full h-full p-2 m-0 flex flex-col justify-center items-center relative" onClick={handleCardClick}>
        <h3 className="text-xl sm:text-xl font-semibold">💌 Per aqui hi ha novetats 🤭</h3>
        {!hasLetterBeenRead && (
          <div className="absolute -top-1 -right-1 w-3 aspect-square">
            <span className="absolute inline-flex  w-3 aspect-square bg-secondary rounded-full"></span>
            <span className="absolute inline-flex w-full h-full bg-secondary opacity-75 rounded-full animate-ping"></span>
          </div>
        )}
      </div>
      
      <AnimatePresence>
        {isLetterOpened && (
          <motion.div
            className="absolute top-0 left-0 z-[1000] w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center overflow-hidden"
            onClick={handleBackdropClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{duration: .4}}
          >
            <LetterInEnvelope handleBackdropClick={handleBackdropClick} letterHasBeenRead={letterHasBeenRead} isLetterOpened={isLetterOpened_}
            setIsLetterOpened={setIsLetterOpened_} />
          </motion.div>
        )}
      </AnimatePresence>
    </WidgetCard>
  )
}

export default LetterLauncher