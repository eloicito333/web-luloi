import { db } from "@/lib/firebase";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const POST = async (request, response) => {
  try {
    const session = await getServerSession(request)

    const req = await request.json()

    //check if request has token
    if (!req?.token) return NextResponse.json({error: 'token missing in body'}, {status: 400})

    //get user id from db
    const usersRef = db.collection("users")
    const snapshot = await usersRef.where('email', '==', session.user.email).limit(1).get()
    if (snapshot.empty) {
      console.error(`User with email: ${session.user.email} not found in database`);
      return NextResponse.json({error: `No user found with email ${session.user.email} in database`}, {status: 500})
    }

    //save data to db
    const data = {userId: snapshot.docs[0].id}
    await db.collection('notification-tokens').doc(req.token).set(data);

    return NextResponse.json({success: 'the token has been stored successfully'}, {status: 200})
    
  } catch (error) {
    console.error('An error occured while trying to safe a notification token through an api request to /api/notifications/claim/send-token. Error: ', error)
    return NextResponse.json({error: 'An error occured while trying to store the token'}, {status: 500})
  }
}