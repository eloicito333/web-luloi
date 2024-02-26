"use client"

import { Button, Card, CardBody, CardFooter, CardHeader } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import {AnimatePresence, motion} from 'framer-motion'
import { MdKeyboardArrowLeft } from "react-icons/md";



/**
 * @param d1 {Date} Start
 * @param d2 {Date} End
 * @return {number} Moths passed
 */
const monthsDiff = (d1, d2) => {
  let months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  if (d1.getDate()*24*3600 + d1.getHours()*3600 + d1.getMinutes()*60 + d1.getSeconds() > d2.getDate()*24*3600 + d2.getHours()*3600 + d2.getMinutes()*60 + d2.getSeconds()) months--
  return months <= 0 ? 0 : months;
}

/**
 * @param d1 {Date} Start
 * @param d2 {Date} End
 * @return {number} Days passed
 */
const daysDiff = (d1, d2) => {
  const lastMonthDate = new Date(d1.getTime())
  lastMonthDate.setFullYear(d2.getFullYear())

  if (d1.getDate()*24*3600 + d1.getHours()*3600 + d1.getMinutes()*60 + d1.getSeconds() <= d2.getDate()*24*3600 + d2.getHours()*3600 + d2.getMinutes()*60 + d2.getSeconds()) {
    lastMonthDate.setMonth(d2.getMonth())
  } else {
    lastMonthDate.setMonth(d2.getMonth() - 1)
  }

  return Math.floor((d2.getTime() - lastMonthDate.getTime()) / (1000 * 3600 * 24))
}

/**
 * @param d1 {Date} Start
 * @param d2 {Date} End
 * @return {number} Hours passed
 */
const hoursDiff = (d1, d2) => {
  let difference = d2.getHours() - d1.getHours()
  if(d1.getHours()*3600 + d1.getMinutes()*60 + d1.getSeconds() > d2.getHours()*3600 + d2.getMinutes()*60 + d2.getSeconds()) difference--
  return difference >= 0 ? difference : difference + 24
}

/**
 * @param d1 {Date} Start
 * @param d2 {Date} End
 * @return {number} Minutes passed
 */
const minutesDiff = (d1, d2) => {
  let difference = d2.getMinutes() - d1.getMinutes()
  if(d1.getMinutes()*60 + d1.getSeconds() > d2.getMinutes()*60 + d2.getSeconds()) difference--
  return difference >= 0 ? difference : difference + 60
}


/**
 * @param d1 {Date} Start
 * @param d2 {Date} End
 * @return {number} Seconds passed
 */
const secondsDiff = (d1, d2) => {
  const difference = d2.getSeconds() - d1.getSeconds()
  return difference >= 0 ? difference : difference + 60
}

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

/**
 * 
 * @param {string} string the string formed from by doing number.toString()
 * @param {number} digit digit to return starting to count from the end. ex: 1 returns the last number
 * @return {string} 1 char string that corresponds to the n last char of the string passed as parameter
 */
const getDigitFromEnd = (string, digit) => {
  return string.charAt(string.length - digit)
}

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

const CountdownWidget = ({initialTime}) => {
  const countdownDate = new Date(process.env.NEXT_PUBLIC_COUNTDOWN_DATE || "2023-09-23T00:00:00")

  const [now, setNow] = useState(initialTime)
  const [isAccordionOpened, setIsAccordionOpened] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const newDate = new Date()
      setNow(newDate)
    }, 1000); 

    return () => clearInterval(interval);
  }, []);

  const handleAccordionButtonClick = () => {
    console.log('accordion btn clicked')
    setIsAccordionOpened((state) => !state)
  }

  return (
    <Card
      className="bg-pink-200/70 bg-opacity-50 p-2 sm:p-4 rounded-lg tabular-nums"
      as={motion.div}
      transition={{duration: .3}}
      variants={{
        open: {height: 'auto',},
        closed: {height: 'min-content',}
      }}
      animate={isAccordionOpened ? "open" : "closed"}
    >
      <Button
        className="w-6 h-6 min-w-0 min-h-0 aspect-square rounded-full p-0 bg-white/50 bg-opacity-50 flex justify-center items-center absolute right-2 top-2 sm:right-3 sm:top-3 z-[200]"
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
          Portem junts <span className="text-4xl sm:text-5xl font-bold">{monthsDiff(countdownDate, now)}</span> <span className="text-lg sm:text-xl font-semibold">mesos</span>, <span className="text-4xl sm:text-5xl font-bold">{daysDiff(countdownDate, now)}</span> <span className="text-lg sm:text-xl font-semibold">dies</span> i
        </p>
      </CardHeader>
      <CardBody className="flex flex-row justify-center items-start gap-2 tabular-nums">
        {
          displayableGroups.map((group, index) => (
            <>
              <div className="text-center flex flex-col justify-center items-center gap-2" key={index}>
                <div className="flex flex-row justify-center items-center gap-1">
                  {
                    Array.from( {length: group.digits}, (_, digit) => (<span className="text-3xl sm:text-4xl font-bold bg-white/50 rounded-lg p-2" key={digit}>{
                      getDigitFromEnd(group.getValue(countdownDate, now).toString(), group.digits - digit) ||'0'
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
          <CardFooter
            className="flex flex-col justify-start items-start gap-2 sm:gap-3"
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
                <span className="text-3xl sm:text-5xl font-bold">{group.getValue(countdownDate, now)}</span> <span className="text-lg sm:text-xl font-semibold">{group.name}</span>{index<resumedGroups.length-1 && ", o"}
              </p>
            ))}
          </CardFooter>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default CountdownWidget;