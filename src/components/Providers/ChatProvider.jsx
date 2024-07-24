"use client"

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAppContext } from './AppProvider';

class EventManager {
  constructor() {
    this.events = {}
  }

  on(eventName, eventHandler) {
    if(!this.events[eventName]) {
      this.events[eventName] = []
    }
    this.events[eventName].push(eventHandler)
  }

  trigger(eventName, ...args) {
    if(!this.events[eventName]) return
    this.events[eventName].forEach((event) => {
      event.apply(this, ...args)
    })
  }

  removeListener(eventName, eventHandler) {
    this.events[eventName].filter((event) => event !== eventHandler)
    if(!this.events[eventName].length) delete this.events[eventName]
  }

  removeAllListeners(eventName) {
    delete this.events[eventName]
  }
}

class MessageManager extends EventManager {
  constructor({socketRef, whoamiRef, messagesUseState: [messagesRef, setMessages]} = args) {
    super()

    this.socket = socketRef
    this.whoami = whoamiRef
    this.messages = messagesRef
    this.setMessages = setMessages
  }

  async sendMessage(msg, conversationId) {
    console.log(this.whoami, this.messages, this.socket)
    const message = {
      ...msg,
      senderId: this.whoami.current.id
    }

    //store the index the message will be stored in
    const currentIndex = this.messages.current[conversationId].messages.length

    //save message before server
    const now = new Date()
    this.setMessages((prevMessages) => {return {
      ...prevMessages,
      [conversationId]: {
        ...prevMessages[conversationId],
        messages: [ {
          ...message,
          _createdAt: now,
          _updatedAt: now,
        },...prevMessages[conversationId].messages]
      }
    }})


    const dbMessage = await this.socket.current.emit("send-message", message, conversationId, (response) => {
      console.log(response)

      if(response.success) {
        //replace the old messge for the real message with the db values
        this.setMessages((prevMessages) => {return {
          ...prevMessages,
          [conversationId]: {
            ...prevMessages[conversationId],
            messages: prevMessages[conversationId].messages.map((currentMessage, index) => {
              if(index !== currentIndex) return currentMessage

              return response.message
            })
          }
        }})
        return response.message
      }
      console.error(response.errorType, response.errorMessage)

      //replace the old messge for the real message with the db values
      this.setMessages((prevMessages) => {return {
        ...prevMessages,
        [conversationId]: {
          ...prevMessages[conversationId],
          messages: prevMessages[conversationId].messages.map((currentMessage, index) => {
            if(index !== currentIndex) return currentMessage

            return {
              ...message,
              hasError: true,
              error: {
                messageHasBeenSent: false,
                type: response.errorType,
                message: response.errorMessage
              }
            }
          })
        }
      }})
    })

    return dbMessage
  }
}

const ChatContext = createContext()

export const useChatContext = () => useContext(ChatContext)

export const ChatProvider = ({children}) => {
  const {isPageVisible} = useAppContext()

  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState({})
  const [areMessagesLoaded, setAreMessagesLoaded] = useState(false)
  const [isConnected, setIsConnected] = useState(false);
  const [whoami, setWhoami] = useState(undefined)
  const [socket, setSocket] = useState(undefined)
  const [newMessagesNumber, setNewMessagesNumber] = useState(0)

  const [messageText, setMessageText] = useState("")
  const [currentScrollPosition, setCurrentScrollPosition] = useState([0,0])
  
  const whoamiRef = useRef(whoami)
  const messagesRef = useRef(messages)
  const socketRef = useRef(socket)
  //const setMessagesRef = useRef(setMessages)

  const [messageManager, setMessageManager] = useState(undefined)

  useEffect(() => {
    messagesRef.current = messages
    console.log("new messages: ", messages)
  }, [messages])

  useEffect(() => {
    whoamiRef.current = whoami
  }, [whoami])

  useEffect(() => {
    console.log("socket changed", socket)
    socketRef.current = socket
  }, [socket])

  useEffect(() => {
    console.log("chatComponent state changed: ", isChatOpen)
  }, [isChatOpen])

  useEffect(() => {
    (async () => {
      await Promise.all([
        (async () => {
          const messageData = await fetch("/api/chat/messages");
          const parsedMessages = await messageData.json();
          const revesedMessages = Object.fromEntries(Object.entries(parsedMessages).map(([conversationId, conversation]) => {
            return [conversationId, {
              ...conversation,
              messages: conversation.messages?.reverse() ?? []
            }]
          }))
          setMessages(revesedMessages)
        })(),
        (async () => {
          const whoamiData = await fetch("/api/persons/whoami");
          const parsedWhoami = await whoamiData.json();
          setWhoami(parsedWhoami)
        })()
      ]);
      setAreMessagesLoaded(true)

      setMessageManager(new MessageManager({
        socketRef,
        whoamiRef, 
        messagesUseState: [messagesRef, setMessages]
      }))

    })()

  }, [])

  useEffect(() => {
    if(!areMessagesLoaded) return

    const socket = io("/chat")

    if(!socket) return

    socket.on("connect", () => {
      console.log('Connected to WebSocket server');

      console.log("connected", socket, whoami)

      socket.on("receive-message", (message, conversationId) => {
        console.log("message recieved!")
        console.log(message, conversationId)

        const newMessageIndex = messages[conversationId].messages.length

        setMessages((prevMessages) => {return {
          ...prevMessages,
          [conversationId]: {
            ...prevMessages[conversationId],
            messages: [ message,...prevMessages[conversationId].messages]
          }
        }})

        if(isChatOpen) {
          socket.emit("seen-message", newMessageIndex, conversationId)
        }

        console.log(messages)
      })

      socket.on("person-change", (newPerson, room) => {
        console.log("person-change received", newPerson, room)
        setMessages((prevMsg) => {
          return {
            ...prevMsg,
            [room]: {
              ...prevMsg[room],
              persons: prevMsg[room].persons.map((el) => el.id !== newPerson.id ? el : newPerson)
            }
          }
        })
      })

    })

    socket.connect()
    setIsConnected(socket.connected)
    setSocket(socket)

    return () => {
      socket.disconnect()
      console.log('Disconnected from WebSocket server');
    }

  }, [areMessagesLoaded])

  useEffect(() => {
    if(!socket) return

    socket.emit("visibility-change", isPageVisible)

  }, [isPageVisible, socket])

  return (
    <ChatContext.Provider value={{
      isChatOpen,
      setIsChatOpen,
      messages,
      areMessagesLoaded,
      isConnected,
      whoami,
      messageManager,
      messageText,
      setMessageText,
      newMessagesNumber,
      setNewMessagesNumber
    }}>
      {children}
    </ChatContext.Provider>
  )
}