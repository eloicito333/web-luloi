import { WIDGET_VERSIONS } from "@/data/versions";
import { db } from "@/lib/firebase";
import { compareVersions } from "compare-versions";
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
    const widget = request.nextUrl.searchParams.get("widget") //get widget name from ?widget=
    if(!widget) {
      return NextResponse.json({error: 'widget missing in params'}, {status: 400})
    }

    //get user doc to have user id
    const userDoc = await getUserDoc(request)
    console.log("user", userDoc, userDoc?.id)
    
    //fetch the document data in the db
    const doc = await db.collection("widget-is-new").doc(userDoc.id).get()
    if (!doc.exists) {
      return NextResponse.json({widgetIsNew: true}, {status: 200})
    }
    const versionSeen = doc.data()[widget]?.versionSeen
    if(versionSeen === undefined) {
      return NextResponse.json({widgetIsNew: true}, {status: 200})
    }
    const widgetIsNew = compareVersions(WIDGET_VERSIONS[widget], versionSeen)
    return NextResponse.json({widgetIsNew}, {status: 200})

  } catch (error) {
    console.error('An error occurred while trying to get state of the widget through an api request to /api/widgetIsNew. Error: ', error)

    return NextResponse.json({error: 'An error occurred while trying get the state of the widget'}, {status: 500})
  }
}


export const PUT = async (request) => {
  try {
    const widget = request.nextUrl.searchParams.get("widget") //get widget name from ?widget=
    if(!widget) {
      return NextResponse.json({error: 'widget missing in params'}, {status: 400})
    }
    
    //get info (boolean)
    const req = await request.json()
    const {versionSeen} = req

    if(versionSeen === undefined) {
      return NextResponse.json({error: 'versionSeen missing in body'}, {status: 400})
    }

    //get user doc to have user id
    const userDoc = await getUserDoc(request)

    //save the document data in the db
    await db.collection("widget-is-new").doc(userDoc.id).set({[widget]: {
      versionSeen
    }})

    return NextResponse.json({success: true}, {status: 200})
  } catch (error) {
    console.error('An error occured while trying to store the widgetState an api request to /api/widgetIsNew. Error: ', error)

    return NextResponse.json({error: 'An error occured while trying to save the widgetState'}, {status: 500})
  }
}