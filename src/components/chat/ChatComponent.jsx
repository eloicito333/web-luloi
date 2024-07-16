"use client"

import { useChatContext } from "@/components/Providers/ChatProvider";
import "./chatComponent.css"
import { cn } from "@nextui-org/react";
import React from "react";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import OpenChat from "./OpenChat";

function ChatComponent() {
  const {isChatOpen, setIsChatOpen} = useChatContext();

  const handleChatComponentOpenBtnClick = () => {
    if(!isChatOpen) setIsChatOpen(true)
  }

  return (
    <div className={cn("absolute top-0 left-0 bg-pink-200 z-50 w-full h-dvh transition-all duration-700", isChatOpen ? "openChat flex flex-col justify-start items-center" : "closedChat")}>
        {!isChatOpen ? (<div onClick={handleChatComponentOpenBtnClick} className={cn("w-28 h-28 rounded-full p-2 absolute bottom-6 right-6 text-white flex items-center justify-center", isChatOpen && "hidden" )}>
          <IoChatboxEllipsesOutline className="w-20 h-20 mt-0.5 ml-0.5" />
        </div>)
        : (<OpenChat className={cn(!isChatOpen && "hidden")} />)}
    </div>
  )
}

export default ChatComponent