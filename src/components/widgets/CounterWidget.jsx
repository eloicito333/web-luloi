"use client"

import { Button, CardBody, CardFooter, CardHeader } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import {AnimatePresence, motion } from 'framer-motion'
import { MdKeyboardArrowLeft } from "react-icons/md";
import WidgetCard from './components/WidgetCard';
import { useWindowSize } from '@/hooks/useWindowSize';
import HeartConfetti from './components/HeartConfetti';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { daysDiff, getDigitFromEnd, hoursDiff, minutesDiff, monthsDiff, secondsDiff } from '@/lib/counterWidgetTimeFormatters';

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

const SM_SCREEN_SIZE = 640

const CounterWidget = ({initialTime, isPageLoockingClear}) => {
  const counterDate = new Date(process.env.NEXT_PUBLIC_counter_DATE || "2023-09-23T00:00:00")

  const windowSize = useWindowSize()
  let isSmScreen = windowSize.width < SM_SCREEN_SIZE

  const [now, setNow] = useState(initialTime)
  const [isAccordionOpened, setIsAccordionOpened] = useState(false)

  const [lastAniversaryDateSeen, setLastAniversaryDateSeen] = useLocalStorage("lastAniversaryDateSeen", undefined)

  useEffect(() => {
    const interval = setInterval(() => {
      const newDate = new Date()
      setNow(newDate)
    }, 1000); 

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
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
    else if(globalThis?.window !== undefined && isPageLoockingClear && lastAniversaryDateSeen < monthsDiff(counterDate, now)) {
      (async () => {
        const currentDate = monthsDiff(counterDate, now)
        const response = await fetch('/api/counterWidget/lastAniversaryDateSeen', {
          method: 'POST',
          body: JSON.stringify({currentDate})
        })
        if(response.status !== 200) throw new Error('error while posting lastAniversaryDateSeen data')
        setLastAniversaryDateSeen(currentDate)
      })()
    }
  }, [isPageLoockingClear, lastAniversaryDateSeen, setLastAniversaryDateSeen, counterDate, now])

  const handleAccordionButtonClick = () => {
    setIsAccordionOpened((state) => !state)
  }

  return (
    <WidgetCard
      className="tabular-nums"
      as={motion.div}
      transition={{duration: .3}}
      variants={{
        open: {height: 'auto',},
        closed: {height: 'min-content',}
      }}
      animate={isAccordionOpened ? "open" : "closed"}
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
      <CardHeader>
        <p className="text-md sm:text-lg">
          Portem junts <span className="text-4xl sm:text-5xl font-bold">{monthsDiff(counterDate, now)%12}</span> <span className="text-lg sm:text-xl font-semibold">mesos</span>, <span className="text-4xl sm:text-5xl font-bold">{daysDiff(counterDate, now)}</span> <span className="text-lg sm:text-xl font-semibold">dies</span> i
        </p>
      </CardHeader>
      <CardBody className="flex flex-row justify-center items-start gap-2 tabular-nums">
        {
          displayableGroups.map((group, index) => (
            <>
              <div className="text-center flex flex-col justify-center items-center gap-2" key={index}>
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
                <span className="text-5xl font-bold" key={`${index}:`}>:</span>
              )}
            </>
          ))
        }
      </CardBody>
      <AnimatePresence>
        {isAccordionOpened && (
          <motion.div
            className='relative w-full overflow-hidden'
            variants={{
              open: {
                height: `${isSmScreen ? 289 : 365}px`
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
              as={motion.div}
              variants={{
                open: {
                  height: 'auto',
                  opacity: 1,
                },
                collapsed: {
                  height: 0,
                  opacity: 0,
                }
              }}
              animate="open"
              exit="collapsed"
              transition={{ duration: 0.3 }}
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
      {isPageLoockingClear && lastAniversaryDateSeen < monthsDiff(counterDate, now) && <HeartConfetti />}
    </WidgetCard>
  );
};

export default CounterWidget;