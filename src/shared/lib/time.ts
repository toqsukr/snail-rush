export function unixFloatToDate(unixFloat: number): Date {
  return new Date(unixFloat * 1000)
}
