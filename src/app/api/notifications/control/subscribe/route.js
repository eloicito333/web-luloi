import { ResponseError } from "@/lib/customErrors";
import { db } from "@/lib/firebase";
import { getUserDoc } from "@/lib/getUserData";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    const req = await request.json()

    //check if request has token
    if (!req?.token) return NextResponse.json({error: 'Token missing in body'}, {status: 400})

    //get user id from db
    const user = await getUserDoc(request)
    if(user instanceof ResponseError) return user.asNextResponse()

    //save data to db
    const data = {userId: user.id}
    await db.collection('notification-tokens').doc(req.token).set(data);

    return NextResponse.json({success: 'the token has been stored successfully'}, {status: 200})
    
  } catch (error) {
    console.error('An error occured while trying to safe a notification token through an api request to /api/notifications/claim/send-token. Error: ', error)
    return NextResponse.json({error: 'An error occured while trying to store the token'}, {status: 500})
  }
}