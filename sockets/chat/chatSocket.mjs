import { ChatDatabase } from "../../src/lib/chatDatabase.js";
import { authMiddleware } from "../middlewares/authMiddleware.mjs";
import { NotificationController } from "../../src/lib/notificationController.js";

class PersonSocketManager {
  #connectedPersons = {}
  #socketStates = {
    connected: "connected",
    secondPlane: "secondPlane",
    afk: "afk",
  }
  constructor(id) {
    this.id = id ?? "default"
  }

  get connectedPersons() {
    return this.#connectedPersons
  }

  async setSocketOnline(socket) {
    let newPerson = await ChatDatabase.setPersonOnline(socket.person.id)
    newPerson.lastConnection = true

    return newPerson
  }

  async setSocketOffLine(socket) {
    const newPerson = await ChatDatabase.setPersonOffLine(socket.person.id)
    return newPerson
  }

  async chekIfOffline(socket) {
    if(!this.#connectedPersons?.[socket.person.id] || !Object.values(this.#connectedPersons[socket.person.id]).find((val) => val === this.#socketStates.connected)) {
      const newPerson = await this.setSocketOffLine(socket)
      return newPerson
    }
    return null
  }

  async checkIfNewOnline(socket) {
    if(!this.#connectedPersons?.[socket.person.id] || !Object.values(this.#connectedPersons[socket.person.id]).find((val) => val === this.#socketStates.connected)) {
      return await this.setSocketOnline(socket)
    }
    return null
  }

  setConnected(socket) {
    if (!this.#connectedPersons[socket.person.id]) {
      this.#connectedPersons[socket.person.id] = {};
    }
    this.#connectedPersons[socket.person.id][socket.id] = this.#socketStates.connected
  }

  setDisconnected(socket) {
    delete this.#connectedPersons[socket.person.id][socket.id]
    if (!Object.keys(this.#connectedPersons[socket.person.id]).length) delete this.#connectedPersons[socket.person.id]
  }

  setSecondPlane(socket) {
    this.#connectedPersons[socket.person.id][socket.id] = this.#socketStates.secondPlane
  }

  setAfk(socket) {
    this.#connectedPersons[socket.person.id][socket.id] = this.#socketStates.afk
  }

  async getDisconnectedPersons(conversationId) {
    const reallyConnectedPersons = Object.keys(this.#connectedPersons).reduce((prevPersons, person) => {
      if(Object.values(this.#connectedPersons[person]).includes(this.#socketStates.connected)) prevPersons.push(person)

      return prevPersons
    }, [])
    const conversation = await ChatDatabase.getConversation(conversationId)
    return conversation.persons.map((person) => person.id).reduce((disconnectedPersons, personId) => {
      if(!(personId in reallyConnectedPersons)) disconnectedPersons.push(personId)
      
      return disconnectedPersons
    }, [])
  }
}

export const chatSocketInit = (io) => {
  const personManager = new PersonSocketManager("/chat")

  const chatNamespace = io.of("/chat")
  chatNamespace.use(authMiddleware)
  chatNamespace.use((socket, next) => {
    if(socket.person.canChat) return next()

    return next(new Error("Person can't chat"))
  })

  chatNamespace.on("connection", async (socket) => {
    const sendPersonChange = async (newPerson) => {
      const sanitazedPerson = ChatDatabase.sanitazePerson(newPerson)
      console.log(sanitazedPerson)
      await Promise.all(socket.person.chatConversations.map(async(conversation) => {
        socket.to(conversation).emit("person-change", sanitazedPerson, conversation)
      }))
    }
    const person = socket.person;

    const newPerson = await personManager.checkIfNewOnline(socket)
    personManager.setConnected(socket)

    console.log("User connected:", person);

    //join socket to its chat rooms
    socket.join(person.id)
    person.chatConversations.forEach((conversation) => {
      socket.join(conversation)
      console.log(`Joined socket ${socket.id} to room ${conversation}`)
    })

    if(newPerson) {
      await sendPersonChange(newPerson)
    }

    socket.on("send-message", async (message, room, cb) => {
      console.log("message recieved", message, room)

      //validate message ----------------------
      const isMessageValid = ChatDatabase.validateMessage(message, room, person)
      if(isMessageValid !== true) return cb(isMessageValid)

      //save message in db
      const dbMessage = await ChatDatabase.addMessage(message, room)
      console.log("message gotten", dbMessage, room)

      //broadcast message
      console.log(personManager.connectedPersons)
      socket.to(room).emit("receive-message", dbMessage, room)

      //send push notifications to not connected users
      const disconnectedPersons = await personManager.getDisconnectedPersons(room)
      console.log("disconnected persons: ", disconnectedPersons)

      const notifications = await NotificationController.sendToPersons(person.id, {
        title: `[luloi] ${person.name}`,
        body: ChatDatabase.getMessageNotificationText(dbMessage),
        icon: "./icon.png",
        data: {
          link: "/chat"
        }
      })
      console.log(notifications)
      notifications.responses.forEach((response) => console.error(response.error))

      //return success message
      cb({success: true, message: dbMessage})
    })

    socket.on("seen-message", async (messageIndex, conversationId) => {
      
    })

    socket.on("visibility-change", async (visibilityState) => {
      console.log("visibilityState: ", visibilityState)
      let newPerson = null
      if(visibilityState === true) {
        newPerson = await personManager.checkIfNewOnline(socket)
        personManager.setConnected(socket)
      }
      else {
        personManager.setSecondPlane(socket)
        newPerson = await personManager.chekIfOffline(socket)
      }

      if(newPerson !== null) {
        await sendPersonChange(newPerson)
      }

      console.log(personManager.connectedPersons)
    })

    socket.on("disconnect", async () => {
      personManager.setDisconnected(socket)

      const newPerson = await personManager.chekIfOffline(socket)

      if(newPerson !== null) {
        await sendPersonChange(newPerson)
      }

      console.log("person disconnected: ", personManager.connectedPersons)
    })

  });
}