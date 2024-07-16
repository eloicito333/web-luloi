import { getPersonDoc } from "../../src/lib/getUserData.js";

export const authMiddleware = async (socket, next) => {
  //if(socket.request._query.sid !== undefined) return next()
  console.log("SOCKET MIDDLEWARE BEING RAN")
  try {
    const pseudoRequest = socket.request

    const person = await getPersonDoc(pseudoRequest)
    if (person instanceof Error) return next(person)
    
    socket.person = person
    
    next();
  } catch (error) {
    console.error(error);
    return next(new Error("Authentication error"));
  }
}