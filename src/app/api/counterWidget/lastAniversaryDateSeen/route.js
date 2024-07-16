import { ResponseError } from "@/lib/customErrors";
import { db } from "@/lib/firebase";
import { getUserDoc } from "@/lib/getUserData";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  try {
    //get user doc to have user id
    const user = await getUserDoc(request)
    if(user instanceof ResponseError) return user.asNextResponse()
    
    //fetch the document data in the db
    const doc = await db.collection("counter-widget-data").doc(user.id).get()
    if (!doc.exists) {
      return NextResponse.json({lastAniversaryDateSeen: 0}, {status: 200})
    }
      return NextResponse.json({lastAniversaryDateSeen: doc.data().lastAniversaryDateSeen}, {status: 200})
  } catch (error) {
    console.error('An error occured while trying to get the last aniversary date seen through an api request to /api/counterWidget/lastAniversaryDateSeen. Error: ', error)

    return NextResponse.json({error: 'An error occured while trying get the last aniversary date seen'}, {status: 500})
  }
}


export const POST = async (request) => {
  try {
    //getting the request body data
    const req = await request.json()
    const {currentDate} = req

    if(!currentDate) {
      return NextResponse.json({error: 'currentDate missing in body'}, {status: 400})
    }

    //get user doc to have user id
    const user = await getUserDoc(request)
    if(user instanceof ResponseError) return user.asNextResponse()

    //save the document data in the db
    await db.collection("counter-widget-data").doc(user.id).set({lastAniversaryDateSeen: currentDate})

    return NextResponse.json({success: true}, {status: 200})
  } catch (error) {
    console.error('An error occured while trying to get the last aniversary date seen through an api request to /api/counterWidget/lastAniversaryDateSeen. Error: ', error)

    return NextResponse.json({error: 'An error occured while trying get the last aniversary date seen'}, {status: 500})
  }
}