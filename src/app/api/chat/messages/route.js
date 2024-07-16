import { ChatDatabase } from "@/lib/chatDatabase"
import { ResponseError } from "@/lib/customErrors"
import { getPersonDoc } from "@/lib/getUserData"
import { NextResponse } from "next/server"

export const GET = async (request) => {
  const person = await getPersonDoc(request)
  if (person instanceof ResponseError) return person.asNextResponse()

  if (!person.canChat) return (new ResponseError(`This user is associated to a person that is not allowed to chat`, {status: 400})).asNextResponse()

  const conversations = await ChatDatabase.getConversations(person)

  return NextResponse.json(conversations, {status: 200})
}