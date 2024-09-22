/**
 * @param d1 {Date} Start
 * @param d2 {Date} End
 * @return {number} Moths passed
 */
export const monthsDiff = (d1, d2) => {
  let months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  if (d1.getDate()*24*3600 + d1.getHours()*3600 + d1.getMinutes()*60 + d1.getSeconds() > d2.getDate()*24*3600 + d2.getHours()*3600 + d2.getMinutes()*60 + d2.getSeconds()) months--
  return months <= 0 ? 0 : months;
}

/**
 * @param d1 {Date} Start
 * @param d2 {Date} End
 * @return {number} Years passed
 */
export const yearsDiff = (d1, d2) => {
  return Math.floor(monthsDiff(d1, d2) / 12)
}

/**
 * @param d1 {Date} Start
 * @param d2 {Date} End
 * @return {number} Days passed
 */
export const daysDiff = (d1, d2) => {
  const lastMonthDate = new Date(d1.getTime())
  lastMonthDate.setFullYear(d2.getFullYear())

  if (d1.getDate()*24*3600 + d1.getHours()*3600 + d1.getMinutes()*60 + d1.getSeconds() <= d2.getDate()*24*3600 + d2.getHours()*3600 + d2.getMinutes()*60 + d2.getSeconds()) {
    lastMonthDate.setMonth(d2.getMonth())
  } else {
    lastMonthDate.setMonth(d2.getMonth() - 1)
  }

  return Math.floor((d2.getTime() - lastMonthDate.getTime()) / (1000 * 3600 * 24))
}

/**
 * @param d1 {Date} Start
 * @param d2 {Date} End
 * @return {number} Hours passed
 */
export const hoursDiff = (d1, d2) => {
  let difference = d2.getHours() - d1.getHours()
  if(d1.getHours()*3600 + d1.getMinutes()*60 + d1.getSeconds() > d2.getHours()*3600 + d2.getMinutes()*60 + d2.getSeconds()) difference--
  return difference >= 0 ? difference : difference + 24
}

/**
 * @param d1 {Date} Start
 * @param d2 {Date} End
 * @return {number} Minutes passed
 */
export const minutesDiff = (d1, d2) => {
  let difference = d2.getMinutes() - d1.getMinutes()
  if(d1.getMinutes()*60 + d1.getSeconds() > d2.getMinutes()*60 + d2.getSeconds()) difference--
  return difference >= 0 ? difference : difference + 60
}


/**
 * @param d1 {Date} Start
 * @param d2 {Date} End
 * @return {number} Seconds passed
 */
export const secondsDiff = (d1, d2) => {
  const difference = d2.getSeconds() - d1.getSeconds()
  return difference >= 0 ? difference : difference + 60
}

/**
 * 
 * @param {string} string the string formed from by doing number.toString()
 * @param {number} digit digit to return starting to count from the end. ex: 1 returns the last number
 * @return {string} 1 char string that corresponds to the n last char of the string passed as parameter
 */
export const getDigitFromEnd = (string, digit) => {
  return string.charAt(string.length - digit)
}