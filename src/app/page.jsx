'use client';

import AnimatedBtn from '@/components/initialPageComponents/AnimatedBtn';
import AnimatedCircles from '@/components/initialPageComponents/AnimatedCircles';
import AnimatedText from '@/components/initialPageComponents/AnimatedText'
import ActivatePWAModal from '@/components/modals/ActivatePWAModal';
import { calculateTextDelay } from '@/lib/animationTimeline';
import { signIn } from 'next-auth/react';
import { useEffect, useRef } from 'react';

export default function Home() {

  const handleLogInButtonClick = () => {
    signIn('google', {callbackUrl: '/dashboard'})
  }

  const openModalRef = useRef(null)
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(globalThis?.window?.navigator.userAgent) && !globalThis?.window?.MSStream;
    if (isIOS && !globalThis?.window.matchMedia('(display-mode: standalone)').matches) openModalRef?.current?.click()
  }, [openModalRef])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10 sm:p-24 bg-pink-200 overflow-hidden">
      <ActivatePWAModal openModalRef={openModalRef} />
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
