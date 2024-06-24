import React, { useEffect, useState } from 'react'
import WidgetCard from '../WidgetCard'
import LetterInEnvelope from './LetterInEnvelope'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { APP_VERSION } from '@/data/versions'

function LetterLauncher({title, id, children}) {
  const widgetId = `letterWidget-${id}`

  const [isLetterOpened, setIsLetterOpened ] = useState(false)
  const [isLetterWidgetNew, setIsLetterWidgetNew] = useLocalStorage(`is-${widgetId}-new`, undefined)

  const [isLetterOpened_, setIsLetterOpened_] = useState(false)

  const letterHasBeenRead = () => {
    if (isLetterOpened) {
      (async () => {
        const response = await fetch(`/api/widgetIsNew?widget=${widgetId}`, {
          method: 'POST',
          body: JSON.stringify({
            versionSeen: APP_VERSION
          })
        })
        if(response.status !== 200) throw new Error('error while posting letterWidget state')
        setIsLetterWidgetNew(false)
      })()
    }
  }

  useEffect(() => {
    if (isLetterWidgetNew === undefined) {
      (async () => {
        const response = await fetch(`/api/widgetIsNew?widget=${widgetId}`)
        if(response.status !== 200) throw new Error('error while retrieving letterWidget state')
        const currentState = (await response.json())?.widgetIsNew
        if(currentState === undefined) {
          throw new Error('error while retrieving Letter Widget state')
        }
        setIsLetterWidgetNew(currentState)
      })()
    }
  })

  const handleCardClick = () => {
    setIsLetterOpened(true)
  }

  const handleBackdropClick = () => {
    setIsLetterOpened_(false)
    setTimeout(() => {
      setIsLetterOpened(false)
    }, 900)
  }
  return (
    <WidgetCard className="overflow-visible static p-0 m-0 sm:p-0 sm:m-0 h-auto cursor-pointer">
      <div className="w-full h-full p-2 m-0 flex flex-col justify-center items-center relative" onClick={handleCardClick}>
        <h3 className="text-xl sm:text-xl font-semibold">{title}</h3>
        {!!isLetterWidgetNew && (
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
            setIsLetterOpened={setIsLetterOpened_} >
              {children}
            </LetterInEnvelope>
          </motion.div>
        )}
      </AnimatePresence>
    </WidgetCard>
  )
}

export default LetterLauncher