"use client"

import ConversationInfo from "@/components/chat/ConversationInfo";
import { useChatContext } from "@/components/Providers/ChatProvider";
import { useWindowSize } from "@/hooks/useWindowSize";
import { Enums } from "@/lib/enums";
import { DateTransformer } from "@/lib/utils.client";
import { Button, cn } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";


const CONVERSATION_ID = "FcHLeahElYvnEphhtyOY"

const groupMessagesByDay = (messages) => {
  if (!Array.isArray(messages)) return {};
  return messages?.reduce((acc, message) => {
    const messageDate = new DateTransformer(message._createdAt).getDateString();
    if (!acc[messageDate]) {
      acc[messageDate] = [];
    }
    acc[messageDate].push(message);
    return acc;
  }, {})
};

function OpenChat({className, ...props}) {
  const {messageManager, messages, areMessagesLoaded, whoami, setIsChatOpen, messageText, setMessageText} = useChatContext();
  const [inputAreaHeight, setInputAreaHeight] = useState("")
  const [groupedMessages, setGroupedMessages] = useState({})
  const inputAreaRef = useRef(null)
  const messageContainerRef = useRef(null)
  const textAreaRef = useRef(null)
  const chatContainerRef = useRef(null)
  const windowSize = useWindowSize()

  const textAreaAdjust = (element) => {
    element.style.height = "1px";
    setInputAreaHeight(Math.min(element.scrollHeight, 136))
    element.style.height = (Math.min(element.scrollHeight, 136)) + "px"
  }

  const handleCloseChatComponentBtnClick = () => {
    setIsChatOpen(false)
  }

  const handleMessageInputTextChange = (event) => {
    setMessageText(event.target.value)
    console.log(event.target.value, event.target.value.replace(/\\n/g, "line jump"))
  }

  const ingoreIntroKeyPress = (event) => {
    if(event.keyCode === 13) event.stopPropagation()
  }

  const handleMessageFormSubmit = (event) => {
    event.preventDefault()
  }

  const handleSendButtonClick = async () => {
    console.log(messageText)
    const messageToSend = {
      messageType: "normal",
      contentType: "text",
      textContent: messageText.replace(/\n/g, "\\n")
    }

    setMessageText("")

    await messageManager.sendMessage(messageToSend, CONVERSATION_ID)

    textAreaRef.current.focus()

    chatContainerRef.current.scrollTo(0,0)
  }

  useEffect(() => {
    textAreaRef.current.focus()
  }, [])

  useEffect(() => {
    if (areMessagesLoaded) {
      setGroupedMessages(groupMessagesByDay(messages?.[CONVERSATION_ID]?.messages || []));
    }
  }, [messages, areMessagesLoaded]);

  useEffect(() => {
    textAreaAdjust(textAreaRef.current)
  }, [messageText])

  return (
    <div className={cn("w-full h-full flex flex-col justify-start items-center", className)} {...props}>
      <div className="h-16 w-full bg-pink-300 flex items-center justify-center">
        <div className="w-full h-full max-w-screen-md flex flex-row justify-between items-center p-8">
          <ConversationInfo conversation={messages[CONVERSATION_ID]} whoami={whoami} />
          <button
            onClick={handleCloseChatComponentBtnClick}
            className="bg-transparent border-transparent aspect-square m-0 p-0 w-8 h-8 text-purple-500/50"
          >
            <RxCross1 className="w-full h-full" />
          </button>
        </div>
      </div>
      <div className={cn("h-[calc(100%-64px-56px)] w-full flex items-center justify-center")} style={{maxHeight: inputAreaHeight ? `${windowSize.height - inputAreaHeight - 32 - 64}px` : ""}} ref={messageContainerRef}>
        <div className="h-full w-full max-w-screen-md flex flex-col-reverse justify-start mx-1 px-1 py-2 pt-0 overflow-auto gap-1 scrollbar scrollbar-track-transparent scrollbar-thumb-rounded-full scrollbar-thumb-pink-300 scrollbar-w-[8px] scroll-smooth" ref={chatContainerRef}>
          {areMessagesLoaded && (Object?.keys(groupedMessages) || []).map((messagesDate, index) => {
            return (
              <div className="h-max w-full flex flex-col-reverse justify-start gap-1" key={index}>
                {groupedMessages[messagesDate].map((message, index) => (
                  <div className={cn("rounded-xl px-4 py-2 w-max max-w-64 relative block pb-2 pr-14 min-w-8", message.senderId === whoami.id ? "self-end bg-pink-400/50" : "self-start bg-pink-300/50")} key={index}>
                    {message.contentType === Enums.messageContentTypes.text && message.textContent.split("\\n").map((textLine, index) => {
                      return (<React.Fragment key={index}>
                        {index !== 0 && (<br/>)}
                        {textLine}
                      </React.Fragment>)
                    })}
                    <span className="text-gray-500 text-xs absolute bottom-1 right-3">
                      {new DateTransformer(message._createdAt).getTimeString()}
                    </span>
                  </div>
                ))}
                <div className="rounded-lg sm:rounded-xl p-1 w-max min-w-10 bg-pink-400 text-pink-200 self-center text-xs sm:text-sm font-semibold text-center sticky top-3" >
                  {new DateTransformer(groupedMessages[messagesDate][0]._createdAt).getRelativeDate() || ""}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="w-full flex flex-row items-end justify-center flex-1" ref={inputAreaRef}>
        <form
          className="w-full max-w-screen-md flex flex-row items-end justify-center p-4 pt-0 gap-2"
          onKeyDown={ingoreIntroKeyPress}
          onSubmit={handleMessageFormSubmit}
        >
          <div className="w-full flex flex-row items-end justify-center p-2 bg-pink-100 rounded-3xl">
            <textarea
              className={cn("bg-transparent outline-none w-full h-6 min-h-none overflow-auto resize-none scrollbar scrollbar-track-transparent scrollbar-thumb-rounded-full scrollbar-thumb-pink-200 scrollbar-w-[8px] scroll-smooth")}
              onChange={handleMessageInputTextChange}
              type="text"
              value={messageText}
              ref={textAreaRef}
            />
          </div>
          <Button
            className="rounded-full bg-pink-400 text-pink-200 p-2 flex items-center justify-center"
            isIconOnly
            type="submit"
            onClick={handleSendButtonClick}
            dissabled={!areMessagesLoaded}
          ><IoMdSend className="w-full h-full translate-x-0.5" /></Button>
        </form>
      </div>
    </div>
  )
}

export default OpenChat