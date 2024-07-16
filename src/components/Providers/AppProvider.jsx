"use client"

import { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext()

export const useAppContext = () => useContext(AppContext)

export const AppProvider = ({children}) => {
  const [isPageLookingClear, setIsPageLookingClear] = useState(false)
  const [isAdminSideBarOpen, setIsAdminSideBarOpen] = useState(false)
  const [isAdminSideBarToggleable,setIsAdm1inSideBarToggleable] = useState(false)
  const [now, setNow] = useState(new Date())

  useEffect(() => {    
    const interval = setInterval(() => {
      const newDate = new Date()
      setNow(newDate)
      console.log(newDate)
    }, 1000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider value={{
      isPageLookingClear,
      setIsPageLookingClear,
      isAdminSideBarOpen,
      setIsAdminSideBarOpen,
      isAdminSideBarToggleable,
      setIsAdm1inSideBarToggleable,
      now
    }}>
      {children}
    </AppContext.Provider>
  )
}