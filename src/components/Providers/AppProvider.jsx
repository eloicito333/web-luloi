"use client"

import { createContext, useContext, useState } from 'react';

const AppContext = createContext()

export const useAppContext = () => useContext(AppContext)

export const AppProvider = ({children}) => {
  const [isPageLookingClear, setIsPageLookingClear] = useState(false)
  const [isAdminSideBarOpen, setIsAdminSideBarOpen] = useState(false)
  const [isAdminSideBarToggleable,setIsAdminSideBarToggleable] = useState(false)

  return (
    <AppContext.Provider value={{
      isPageLookingClear,
      setIsPageLookingClear,
      isAdminSideBarOpen,
      setIsAdminSideBarOpen,
      isAdminSideBarToggleable,
      setIsAdminSideBarToggleable
    }}>
      {children}
    </AppContext.Provider>
  )
}