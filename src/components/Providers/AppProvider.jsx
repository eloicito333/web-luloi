"use client"

import { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext()

export const useAppContext = () => useContext(AppContext)

export const AppProvider = ({children}) => {
  const [isPageLookingClear, setIsPageLookingClear] = useState(false)
  const [isAdminSideBarOpen, setIsAdminSideBarOpen] = useState(false)
  const [isAdminSideBarToggleable,setIsAdm1inSideBarToggleable] = useState(false)
  const [now, setNow] = useState(new Date())
  const [isPageVisible, setIsPageVisible] = useState(!(globalThis?.window?.document?.hidden ?? true))

  useEffect(() => {    
    const interval = setInterval(() => {
      const newDate = new Date()
      setNow(newDate)
    }, 1000); 

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if(globalThis?.window?.document?.hidden === undefined) return

    const eventListener = () => {setIsPageVisible(!(globalThis?.window?.document?.hidden ?? true))}

    globalThis?.window?.document.addEventListener("visibilitychange", eventListener)

    return () => globalThis?.window?.document.removeEventListener("visibilitychange", eventListener)
  }, [])

  return (
    <AppContext.Provider value={{
      isPageLookingClear,
      setIsPageLookingClear,
      isAdminSideBarOpen,
      setIsAdminSideBarOpen,
      isAdminSideBarToggleable,
      setIsAdm1inSideBarToggleable,
      now,
      isPageVisible
    }}>
      {children}
    </AppContext.Provider>
  )
}