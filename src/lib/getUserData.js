import { getServerSession } from "next-auth";
import { ResponseError } from "./customErrors.js";
import { db } from "./firebase.js";
import dotenv from "dotenv"
import { parse } from "cookie";
import { getToken } from "next-auth/jwt";

export class UserDBAdapter {
  static async getUserFromEmail(email) {
    //get user id from db
    const usersRef = db.collection("users")
    const snapshot = await usersRef.where('email', '==', email).limit(1).get()
    if (snapshot.empty) {
      console.error(`User with email: ${email} not found in database`);
      return new ResponseError(`No user found with email ${email} in database`, {status: 500})
    }
  
    const user = {
      ...snapshot.docs[0].data(),
      id: snapshot.docs[0].id
    }
  
    return user
  }

  static async getPersonFromId({personId, email}) {
    //get and return person data
    const doc = await db.collection("persons").doc(personId).get()

    //check for existence of the fetched data
    if (doc.empty) return new ResponseError(`Couldn't find the person document of the user with email ${email} in the database.`, {status: 500})
    
    const person = {
      ...doc.data(),
      id: personId
    }

    return person
  }
}

export const getUserDoc = async (request) => {
  const session = await getServerSession(request)

  const user = await UserDBAdapter.getUserFromEmail(session.user.email)

  return user
}

export const pseudoGetUserDoc = async (request) => {
  dotenv.config()

  const cookies = parse(request.headers.cookie);

  const pseudoRequest = {
    ...request,
    cookies
  }

  const decoded = await getToken({ req: pseudoRequest })

  const user = await UserDBAdapter.getUserFromEmail(decoded.email)

  return user
}

export const getPersonDoc = async (request) => {
  let user;

  try {
    user = await getUserDoc(request)
  } catch {
    try {
      user = await pseudoGetUserDoc(request)
    } catch (error) {
      console.error(error)
      return new Error("Error while authenticating the user.")
    }
  }
  //check user has a person
  if (!user.personId) {
    return new ResponseError(`User with email ${user.email} is not related to any person`, {status: 400})
  }

  const person = await UserDBAdapter.getPersonFromId(user)
  if(typeof person === ResponseError) return person.asNextResponse()
  
  return person
  
}