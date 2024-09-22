"use client"

import { Button, CardBody, CardFooter, CardHeader } from '@nextui-org/react';
import React, { useState, useEffect } from 'react';
import {AnimatePresence, motion } from 'framer-motion'
import { MdKeyboardArrowLeft } from "react-icons/md";
import WidgetCard from '../components/WidgetCard';
import { useWindowSize } from '@/hooks/useWindowSize';
import HeartConfetti from '../components/HeartConfetti';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { daysDiff, getDigitFromEnd, hoursDiff, minutesDiff, monthsDiff, secondsDiff, yearsDiff } from '@/lib/counterWidgetTimeFormatters';
import { SM_SCREEN_SIZE } from '@/lib/consts';
import { useAppContext } from '@/components/Providers/AppProvider';

const displayableGroups = [
  {
    name: 'Hores',
    digits: 2,
    getValue: hoursDiff,
  },
  {
    name: 'Minuts',
    digits: 2,
    getValue: minutesDiff,
  },
  {
    name: 'Segons',
    digits: 2,
    getValue: secondsDiff,
  },
]

const resumedGroups = [
  {
    name: 'mesos',
    getValue: monthsDiff,
  },
  {
    name: 'setmanes',
    getValue: (d1, d2) => Math.floor((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24 * 7)),
  },
  {
    name: 'dies',
    getValue: (d1, d2) => Math.floor((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24)),
  },
  {
    name: 'hores',
    getValue: (d1, d2) => Math.floor((d2.getTime() - d1.getTime()) / (1000 * 3600)),
  },
  {
    name: 'minuts',
    getValue: (d1, d2) => Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60)),
  },
  {
    name: 'segons',
    getValue: (d1, d2) => Math.floor((d2.getTime() - d1.getTime()) / (1000)),
  }
]

const CounterWidget = () => {
  const counterDate = new Date(process.env.NEXT_PUBLIC_counter_DATE || "2023-09-23T00:00:00")

  const windowSize = useWindowSize()
  let isSmScreen = windowSize.width < SM_SCREEN_SIZE

  const {now, isPageLookingClear} = useAppContext()
  const [isAccordionOpened, setIsAccordionOpened] = useState(false)

  const [lastAniversaryDateSeen, setLastAniversaryDateSeen] = useLocalStorage("lastAniversaryDateSeen", undefined)

  const [datingNums, setDatingNums] = useState({
    years: yearsDiff(counterDate, now),
    months: monthsDiff(counterDate, now) % 12,
    days: daysDiff(counterDate, now)
  })

  const heartConfettiCallback = async () => {
    if (globalThis?.window === undefined) return

    const currentDate = monthsDiff(counterDate, now)
    const response = await fetch('/api/counterWidget/lastAniversaryDateSeen', {
      method: 'POST',
      body: JSON.stringify({currentDate})
    })
    if(response.status !== 200) throw new Error('error while posting lastAniversaryDateSeen data')
    setLastAniversaryDateSeen(currentDate)
  }


  useEffect(() => {
    setDatingNums({
      years: yearsDiff(counterDate, now),
      months: monthsDiff(counterDate, now) % 12,
      days: daysDiff(counterDate, now)
    })
    
    if (lastAniversaryDateSeen === undefined) {
      (async () => {
        const response = await fetch('/api/counterWidget/lastAniversaryDateSeen')
        if(response.status !== 200) throw new Error('error while retrieving lastAniversaryDateSeen data')
        const parsedResponse = await response.json()
        console.log(parsedResponse)
        const currentDate = parsedResponse.lastAniversaryDateSeen
        if(currentDate === undefined) {
          throw new Error('error while retrieving lastAniversaryDateSeen data')
        }
        setLastAniversaryDateSeen(currentDate)
      })()
    }
  }, [isPageLookingClear, lastAniversaryDateSeen, now, setDatingNums])

  const handleAccordionButtonClick = () => {
    setIsAccordionOpened((state) => !state)
  }

  return (
    <WidgetCard
      className="tabular-nums"
      as={motion.section}
      transition={{duration: .3}}
      variants={{
        open: {height: 'auto',},
        closed: {height: 'min-content',}
      }}
      animate={isAccordionOpened ? "open" : "closed"}
      suppressHydrationWarning 
    >
      <Button
        className="w-6 h-6 min-w-0 min-h-0 aspect-square rounded-full p-0 bg-white/50 bg-opacity-50 flex justify-center items-center absolute right-2 top-2 sm:right-3 sm:top-3 z-[50]"
        as={motion.button}
        onClick={handleAccordionButtonClick}
        variants={{
          whenOpened: {
            rotate: -90,
          },
          whenCollapsed: {
            rotate: 0,
          },
        }}
        initial="whenCollapsed"
        animate={isAccordionOpened ? "whenOpened" : "whenCollapsed"}
        transition={{ duration: 0.3 }}
      ><MdKeyboardArrowLeft className='p-0 m-0 fill-violet-700'/></Button>
      <CardHeader className="mt-2 mb-[-0.5rem] sm:my-0">
        <p className="w-full text-lg sm:text-xl">
          Portem junts
          <br />
          <div className="w-full text-center mt-2 sm:mt-4">
            {datingNums.years > 0 && (
              <>
                <span className="text-7xl sm:text-9xl font-bold">{datingNums.years}</span> <span className="text-4xl sm:text-5xl font-semibold">any{datingNums.years > 1 && "s"}</span>{(datingNums.months || datingNums.days) ? <>,<br /></> : " i"}
              </>
            )}{datingNums.months > 0 && (
              <>
                <span className="text-4xl sm:text-5xl font-bold">{datingNums.months}</span> <span className="font-semibold">{datingNums.months > 1 ? "mesos" : "mes"}</span>{datingNums.days > 0 ? ", " : <br />}
              </>
            )}{datingNums.days > 0 && (
              <>
                <span className="text-4xl sm:text-5xl font-bold">{datingNums.days}</span> <span className="font-semibold">{datingNums.days > 1 ? "dies" : "dia"}</span> i
              </>
            )}
          </div>
        </p>
      </CardHeader>
      <CardBody className="flex flex-row justify-center items-start gap-2 tabular-nums">
        {
          displayableGroups.map((group, index) => (
            <React.Fragment key={index}>
              <div className="text-center flex flex-col justify-center items-center gap-2" >
                <div className="flex flex-row justify-center items-center gap-1">
                  {
                    Array.from( {length: group.digits}, (_, digit) => (<span className="text-3xl sm:text-4xl font-bold bg-white/50 rounded-lg p-2" key={`digit:${digit}:${index}`}>{
                      getDigitFromEnd(group.getValue(counterDate, now).toString(), group.digits - digit) ||'0'
                    }</span>))
                  }
                </div>
                <p className="block">{group.name}</p>
              </div>
              {(index < displayableGroups.length - 1) && (
                <span className="text-5xl font-bold" >:</span>
              )}
            </React.Fragment>
          ))
        }
      </CardBody>
      <AnimatePresence>
        {isAccordionOpened && (
          <motion.div
            className='relative w-full overflow-hidden'
            variants={{
              open: {
                height: `${2*12 + resumedGroups.length*(37+(isSmScreen ? 8 : 12)) + 27}px`
              },
              collapsed: {
                height: 0,
              }
            }}
            animate="open"
            exit="collapsed"
            transition={{ duration: 0.3 }}
          >
            <CardFooter
              className="absolute flex flex-col justify-start items-start gap-2 sm:gap-3"
            >
              <p className="text-md sm:text-lg pb-2 sm:pb-0 pt-2">Que equival a...</p>
              {resumedGroups.map((group, index) => (
                <p className="text-md sm:text-lg" key={index}>
                  <span className="text-3xl sm:text-5xl font-bold">{group.getValue(counterDate, now)}</span> <span className="text-lg sm:text-xl font-semibold">{group.name}</span>{index<resumedGroups.length-1 && ", o"}
                </p>
              ))}
            </CardFooter>
          </motion.div>
        )}
      </AnimatePresence>
      {isPageLookingClear && lastAniversaryDateSeen < monthsDiff(counterDate, now) && <HeartConfetti callback={heartConfettiCallback} timeoutTime={5000}/>}
    </WidgetCard>
  );
};

export default CounterWidget;