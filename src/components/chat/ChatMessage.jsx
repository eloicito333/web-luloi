import React from 'react'
import { useChatContext } from '../Providers/ChatProvider';
import { cn } from '@nextui-org/react';
import { Enums } from '@/lib/enums';
import { DateTransformer } from '@/lib/utils.client';
import { RiCheckDoubleFill } from "react-icons/ri";

function ChatMessage({message, className, ...props}) {
  const {whoami} = useChatContext();

  return (
    <div className={cn("rounded-xl px-4 py-2 w-max max-w-64 relative block pb-2 min-w-8", message.senderId === whoami.id ? "self-end bg-pink-400/50 pr-16" : "self-start bg-pink-300/50 pr-14", className)} {...props}>
      {message.contentType === Enums.messageContentTypes.text && message.textContent.split("\\n").map((textLine, index) => {
        return (<React.Fragment key={index}>
          {index !== 0 && (<br/>)}
          {textLine}
        </React.Fragment>)
      })}
      <span className="text-gray-500 text-xs absolute bottom-1 right-3 flex flex-row items-center justify-end gap-1">
        {new DateTransformer(message._createdAt).getTimeString()}
        {/* {message.senderId === whoami.id && (
          <RiCheckDoubleFill className={cn("h-3 w-3 transition-all", message?.seen ? "text-blue-500" : "text-gray-500")} />
        )} */}
      </span>
    </div>
  )
}

export default ChatMessage