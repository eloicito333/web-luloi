import { db, fcm } from "./firebase.js";

export class NotificationController {
  static async getTokensFromUserIds(userIds) {
    userIds = userIds instanceof Array ? userIds : [userIds];

    const tokensRef = await db.collection("notification-tokens").where("userId", "in", userIds).get();

    const tokens = tokensRef.docs.map((ref) => {
      return ref.id
    })

    return tokens
  }

  static async getUsersFromPersonIds(personIds) {
    personIds = personIds instanceof Array ? personIds : [personIds];

    const usersRef = await db.collection("users").where("personId", "in", personIds).get();
    const userIds = usersRef.docs.map((ref) => {
      return ref.id
    })

    return userIds
  }

  static async sendToPersons(personIds, message) {
    const userIds = await this.getUsersFromPersonIds(personIds)

    const tokens = await this.getTokensFromUserIds(userIds)
    return this.send(tokens, message)
  }

  static async send(tokens, message, topic) {
    const {title, body} = message
    delete message.title
    delete message.body
    let notification = {
      notification: {
        title,
        body
      },
      ...message
    }

    message.data.link = message.data.link || "/"

    for(const key in message.data) {
      if(typeof message.data[key] === "object" && message.data[key] !== null) {
        notification.data[key] = JSON.stringify(message.data[key])
        console.log(notification.data[key])
      }
    }

    console.log(message)

    if(tokens !== undefined) {
      notification.tokens = tokens instanceof Array ? tokens : [tokens]
    }
    if(topic !== undefined) {
      notification.topic = topic
    }

    console.log("notification:", notification)

    return await fcm.sendEachForMulticast(notification)
  }
}