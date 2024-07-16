import { NextResponse } from "next/server.js"

export class ResponseError extends Error {
  constructor(message, options) {
    super(message)
    this.options = options
  }

  asNextResponse() {
    return NextResponse.json({error: this.message}, this.options)
  }
}

export class InvalidParamsError extends Error {
  constructor(message, paramName, paramNum) {
    super(message || "Invalid param passed")
    this.paramName = paramName
    this.paramNum = paramNum
  }
}