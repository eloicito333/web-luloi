import { User } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { DateTransformer } from '@/lib/utils.client'
import UserIconFallback from '../UserIconFallback'

function ConversationInfo({conversationRef, whoami}) {
  const [imageUrl, setImageUrl] = useState("")
  const [titleText, setTitleText] = useState("")
  const [descriptionText, setDescriptionText] = useState("")

  const setVariables = () => {
    if(conversationRef.current == {}) return
    console.log("set variables")
    if(conversationRef.current?.isTwoPersons) {
      const otherPersons = conversationRef.current.persons.filter((person) => person.id !== whoami.id)
      if(otherPersons.length !== 1) throw new Error("Conversation is not two persons")
      
      const otherPerson = otherPersons[0]
      const lastConnectionDate = new DateTransformer(otherPerson.lastConnection)
      console.log(otherPerson?.lastConnection === true ? "en línia" : `Última connexió`)

      setImageUrl(otherPerson.image)
      setTitleText(otherPerson.name)
      setDescriptionText(otherPerson?.lastConnection === true ? "en línia" : `Última connexió ${lastConnectionDate.getDateInSpokenLanguageForLastConnection()}`)
    }
  }

  useEffect(() => {
    setVariables()
  }, [conversationRef.current, whoami])
  
  return (
    <User
      name={titleText}
      description={descriptionText}
      avatarProps={{
        src: imageUrl
      }}
      classNames={{
        name: "font-semibold",
        description: "text-gray-600"
      }}
      color="secondary"
      showFallback={<UserIconFallback name={titleText} />}
    />
  );
}

export default ConversationInfo