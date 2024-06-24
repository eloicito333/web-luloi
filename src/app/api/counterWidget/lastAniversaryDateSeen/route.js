import { db } from "@/lib/firebase";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const getUserDoc = async (request) => {
  const session = await getServerSession(request)

  //get user id from db
  const usersRef = db.collection("users")
  const snapshot = await usersRef.where('email', '==', session.user.email).limit(1).get()
  if (snapshot.empty) {
    console.error(`User with email: ${session.user.email} not found in database`);
    return NextResponse.json({error: `No user found with email ${session.user.email} in database`}, {status: 500})
  }

  return snapshot.docs[0]
}

export const GET = async (request) => {
  try {
    //get user doc to have user id
    const userDoc = await getUserDoc(request)
    
    //fetch the document data in the db
    const doc = await db.collection("counter-widget-data").doc(userDoc.id).get()
    if (!doc.exists) {
      return NextResponse.json({lastAniversaryDateSeen: 0}, {status: 200})
    }
      return NextResponse.json({lastAniversaryDateSeen: doc.data().lastAniversaryDateSeen}, {status: 200})
  } catch (error) {
    console.error('An error occured while trying to get the last aniversary date seen through an api request to /api/counterWidget/lastAniversaryDateSeen. Error: ', error)

    return NextResponse.json({error: 'An error occured while trying get the last aniversary date seen'}, {status: 500})
  }
}


export const PUT = async (request) => {
  try {
    const req = await request.json()

    const currentDate = req.currentDate

    if(!currentDate) {
      return NextResponse.json({error: 'currentDate missing in body'}, {status: 400})
    }

    //get user doc to have user id
    const userDoc = await getUserDoc(request)

    //save the document data in the db
    await db.collection("counter-widget-data").doc(userDoc.id).set({lastAniversaryDateSeen: currentDate})

    return NextResponse.json({success: true}, {status: 200})
  } catch (error) {
    console.error('An error occured while trying to get the last aniversary date seen through an api request to /api/counterWidget/lastAniversaryDateSeen. Error: ', error)

    return NextResponse.json({error: 'An error occured while trying get the last aniversary date seen'}, {status: 500})
  }
}