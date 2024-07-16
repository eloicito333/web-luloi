import { ResponseError } from "@/lib/customErrors"
import { getPersonDoc } from "@/lib/getUserData"
import { NextResponse } from "next/server"

export const GET = async (request) => {
  const person = await getPersonDoc(request)

  if(person instanceof ResponseError) return person.asNextResponse()

  return NextResponse.json(person, {status: 200})
}