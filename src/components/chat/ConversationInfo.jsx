import { User } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { DateTransformer } from '@/lib/utils.client'
import UserIconFallback from '../UserIconFallback'

function ConversationInfo({conversation, whoami}) {
  const [imageUrl, setImageUrl] = useState("")
  const [titleText, setTitleText] = useState("")
  const [descriptionText, setDescriptionText] = useState("")

  const setVariables = () => {
    if(conversation == {}) return
    if(conversation?.isTwoPersons) {
      const otherPersons = conversation.persons.filter((person) => person.id !== whoami.id)
      if(otherPersons.length !== 1) throw new Error("Conversation is not two persons")
      
      const otherPerson = otherPersons[0]
      const lastConnectionDate = new DateTransformer(otherPerson.lastConnection)
      console.log(lastConnectionDate)

      setImageUrl(otherPerson.image)
      setTitleText(otherPerson.name)
      setDescriptionText(otherPerson?.online ? "en línia" : `Última connexió ${lastConnectionDate.getDateInSpokenLanguageForLastConnection()}`)
      console.log(otherPerson.lastConnection)
    }
  }

  useEffect(() => {
    setVariables()
  }, [conversation, whoami, setVariables])
  
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