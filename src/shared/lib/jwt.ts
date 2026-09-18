import { z } from 'zod'
import { unixFloatToDate } from './time'

const ClaimsSchema = z.object({ exp: z.number() })

export const expiration = (token: string): number | null => {
  try {
    const claims = ClaimsSchema.safeParse(JSON.parse(atob(token.split('.')[1] ?? '')))
    return claims.success ? unixFloatToDate(claims.data.exp).getTime() : null
  } catch {
    return null
  }
}
