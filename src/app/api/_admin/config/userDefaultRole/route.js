import { APP_CONFIG_COLLECTION, APP_CONFIG_DOCS } from "@/lib/appConfig"
import { NextResponse } from "next/server"

export const GET = async (request) => {
  try {
    //fetch the document data in the db
    const doc = await db.collection(APP_CONFIG_COLLECTION).doc(APP_CONFIG_DOCS).get()
    if (!doc.exists) {
      return NextResponse.json({error: "The config doc wasn't found on the database"}, {status: 404})
    }
      return NextResponse.json({userDefaulRole: doc.data().userDefaulRole}, {status: 200})

  } catch (error) {
    console.error('An error occured while trying to get the userDefaultRole data through an api request to /api/admin/config/userDefaultRole. Error: ', error)

    return NextResponse.json({error: 'An error occured while trying to get the userDefaultRole data'}, {status: 500})
  }
}

export const PUT = async (request) => {
  try{
    //getting the request body data
    const req = await request.json()
    const {userDefaulRole} = req

    if(!userDefaulRole) {
      return NextResponse.json({error: 'userDefaulRole missing in body'}, {status: 400})
    }

    //save the document data in the db
    await db.collection(APP_CONFIG_COLLECTION).doc(APP_CONFIG_DOCS).set({userDefaulRole})

    return NextResponse.json({userDefaulRole}, {status: 200})

  } catch (error) {
    console.error('An error occured while trying to save the new userDefaultRole data through an api request to /api/admin/config/userDefaultRole. Error: ', error)

    return NextResponse.json({error: 'An error occured while trying to save the new userDefaultRole data'}, {status: 500})
  }
}