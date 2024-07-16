import { InvalidParamsError } from "./customErrors.js"

export class DateTransformer extends Date {
  longWeekDays = {
    ca: [
      "diumenge",
      "dilluns",
      "dimarts",
      "dimecres",
      "dijous",
      "divendres",
      "dissabte",
    ]
  }

  shortWeekDays = {
    ca: [
      "dg.",
      "dl.",
      "dt.",
      "dc.",
      "dj.",
      "dv.",
      "ds.",
    ]
  }
  
  constructor(date, lang="ca") {
    let isOriginalFirebaseDate, firebaseDate, newDate;
    if(date instanceof DateTransformer) {
      newDate = date.date
    } else if (date instanceof Date) {
      isOriginalFirebaseDate = false
      newDate = date
    } else if(date?._seconds && date?._nanoseconds) {
      isOriginalFirebaseDate = true
      firebaseDate = date
      newDate = new Date(date._seconds*1000 + date._nanoseconds*10**-9)
    } else {
      try {
        newDate = new Date(date)
      } catch {
        throw new InvalidParamsError("DateTransformer initialized with invalid date", "date", 0)
      }
    }
    super(newDate)
    this.isOriginalFirebaseDate = isOriginalFirebaseDate
    this.firebaseDate = firebaseDate
    this.date = newDate
    this.lang = lang
  }

  getDateInSpokenLanguageForLastConnection() {
    return`${this.getRelativeDate({doubleComa: true})} a ${[1, 13].includes(this.getHours()) ? "la " : "les "}${this.getTimeString()}.`
  }

  getTimeString() {
    return `${String(this.getHours()).length === 2 ? this.getHours() : "0" + this.getHours()}:${String(this.getMinutes()).length === 2 ? this.getMinutes() : "0" + this.getMinutes()}`
  }

  getDateString() {
    const now = new Date()
    return `${String(this.getDate()).length === 2 ? this.getDate() : "0" + this.getDate()}/${String(this.getMonth()+1).length === 2 ? this.getMonth() : "0" + this.getMonth()}${this.getFullYear() !== now.getFullYear() ? `/${this.getFullYear()}`: ""}`
  }

  getRelativeDate({doubleComa = false} = {}) {
    const now = new Date()

    if(this.getDate() === now.getDate()) {
      return "avui"
    } else if(new Date(now - 24*3600*1000).getDate() === this.getDate()) {
      return "ahir"
    } else if (this.date - new Date(now - 7*24*3600*1000) > 0) {
      return this.longWeekDays[this.lang][this.getDay()]
    } else {
      return `${this.shortWeekDays[this.lang][this.getDay()]}, ${this.getDateString()}${doubleComa ? "," : ""}`
    }
  }
}