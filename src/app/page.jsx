'use client';

import AnimatedBtn from '@/components/AnimatedBtn';
import AnimatedCircles from '@/components/AnimatedCircles';
import AnimatedText from '@/components/AnimatedText'
import { calculateTextDelay } from '@/lib/animationTimeline';
import { Button } from '@nextui-org/react';
import { signIn } from 'next-auth/react';

export default function Home() {

  const handleLogInButtonClick = () => {
    signIn()
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10 sm:p-24 bg-pink-200 overflow-hidden">
      <div className="flex flex-col items-center justify-center gap-10 md:gap-20">
        <div className='relative z-50'>
          <div className="flex flex-row items-start justify-start">
            <AnimatedText
              className="text-purple-600 font-black text-7xl sm:text-9xl"
              delayTime={.25}
            >
              Mmm
            </AnimatedText> 

            <AnimatedText
              className="text-purple-600 font-black text-7xl sm:text-9xl"
              delayTime={.5} defaultDelay={calculateTextDelay('Mmm', .25) + .25}
            >
              ...
            </AnimatedText>
          </div>
          <div className="flex flex-row items-start justify-start flex-wrap">
            <div className="flex flex-row items-start justify-start flex-nowrap text-nowrap">
              <AnimatedText
                defaultDelay={calculateTextDelay('Mmm', .25) + calculateTextDelay('...', .5) + 1}
                delayTime={.25}
                className="font-black text-7xl sm:text-9xl"
              >
                carinyo
              </AnimatedText>
              <AnimatedText
                defaultDelay={calculateTextDelay('Mmm', .25) + calculateTextDelay('...', .5) + 1 + calculateTextDelay('carinyo', .25) + .25}
                delayTime={.25}
                className="font-black text-7xl sm:text-9xl"
              >
                ,
              </AnimatedText>
              <div className="font-black text-7xl sm:text-9xl">&nbsp;</div>
            </div>
            <AnimatedText
              defaultDelay={calculateTextDelay('Mmm', .25) + calculateTextDelay('...', .5) + 1 + calculateTextDelay('carinyo', .25) + .25 + calculateTextDelay(',', .25) + .5}
              delayTime={.25}
              className="font-black text-7xl sm:text-9xl text-nowrap	"
            >
              ets tu?
            </AnimatedText>
          </div>
          
        </div>
        <AnimatedBtn
          ease={[.5, .5, 0, 1]}
          delay={calculateTextDelay('Mmm', .25) + calculateTextDelay('...', .5) + 1 + calculateTextDelay('carinyo', .25) + .25 + calculateTextDelay(',', .25) + .5 + calculateTextDelay('ets tu?', .25) + .75}
          duration={.5}
          className="my-10 mx-auto z-50 md:text-xl md:p-6"
          onClick={handleLogInButtonClick}
        />
        <AnimatedCircles />
      </div>
    </main>
  );
}
