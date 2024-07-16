import { FieldValue } from "firebase-admin/firestore"
import { MessageSchema } from "../schemas/chatMessageSchema.js"
import { db } from "./firebase.js"
import { Enums } from "./enums.js"
import { DateTransformer } from "./utils.client.js"

export class ChatDatabase {
  static messageContentTypes = Enums.messageContentTypes

  static messageMessageTypes = Enums.messageMessageTypes

  static validateMessage(message, conversationId, person) {
    //validate ids
    if(message.senderId !== person.id) return {success: false, errorType: "Invalid message", errorMessage: "senderId isn't the same as personId"}
    //validate if person is in conversation
    if(!person.chatConversations.includes(conversationId)) return {success: false, errorType: "Invalid message", errorMessage: "person can't send messages into this conversation"}

    //validate schema
    const validation = MessageSchema.safeParse(message)
    if(!validation.success) return {success: false, errorType: "Invalid message", errorMessage: validation.errorMessage}

    return true
  }

  static async addMessage(message, conversationId) {
    const conversationRef = db.collection("chatConversations").doc(conversationId)
    //const newMessageRef = db.ref(`/chatConversations/${conversationId}/messages`).push()

    // Add the message with server timestamps
    const now = new Date()
    // Update the messages array field with the new message
    await conversationRef.update({
      messages: FieldValue.arrayUnion({
          ...message,
          _createdAt: now,
          _updatedAt: now,
      })
    });

    // Retrieve the uploaded message to get the server timestamps
    //const snapshot = await conversationRef.get("value");
    return {
      ...message,
      _createdAt: now,
      _updatedAt: now,
  };
  }

  static sanitazePerson(person) {
    return {
      image: person.image,
      lastConnection: new DateTransformer(person.lastConnection),
      name: person.name,
      id: person.id
    }
  }

  static sanitazeMessage(message) {
    const {...sanitazedMessage} = message
    sanitazedMessage._createdAt = new DateTransformer(sanitazedMessage._createdAt)
    sanitazedMessage._updatedAt = new DateTransformer(sanitazedMessage._updatedAt)
    return sanitazedMessage
  }

  static sanitazeConversation(conversation) {
    conversation.persons = !!conversation.persons ? conversation.persons : []
    conversation.messages = !!conversation.messages ? conversation.messages : []
    
    conversation.persons = conversation.persons.map((person) => this.sanitazePerson(person))
    conversation.messages = conversation.messages.map((message) => this.sanitazeMessage(message))

    return conversation
  }

  static async getConversation(conversationId) {
    const conversationSnapshot = await db.collection("chatConversations").doc(conversationId).get()
    if(!conversationSnapshot.exists) return null

    const conversation = conversationSnapshot.data()
    
    const personsObj = await Promise.all(conversation.persons.map(async (personId) => {
      const person = await db.collection("persons").doc(personId).get()
      if (!person?.exists) return false

      return {
        ...person.data(),
        id: person.id
      }
    }))

    conversation.persons = personsObj
    
    return this.sanitazeConversation(conversation)
  }

  static async getConversations(person) {
    let conversations = {};

    const async1 = person.chatConversations.map(async (conversationId) => {
       const conversation = await this.getConversation(conversationId)
       conversations[conversationId] = conversation
    })

    await Promise.all(async1)

    return conversations
  }

  static getMessageNotificationText(message) {
    if(message.contentType === this.messageContentTypes.text) return message.textContent || "Missatge"

    return "Missatge"
  }

  static async setPersonOffLine(personId) {
    await db.collection("persons").doc(personId).update({
      lastConnection: db.FieldValue.serverTimestamp()
    })

    const newPersonRef = await db.collection("persons").doc(personId).get()
    return newPersonRef.data()
  }

  static async setPersonOnline(personId) {
    await db.collection("persons").doc(personId).update({
      lastConnection: true
    })

    const newPersonRef = await db.collection("persons").doc(personId).get()
    return newPersonRef.data()
  }
}