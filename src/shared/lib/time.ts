export function unixFloatToDate(unixFloat: number): Date {
  return new Date(unixFloat * 1000)
}

export function dateToUnixFloat(date = new Date()) {
  if (!(date instanceof Date)) {
    throw new Error('Аргумент должен быть объектом Date')
  }
  return Math.floor(date.getTime() / 1000)
}
