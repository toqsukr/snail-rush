import { describe, expect, it } from 'vitest'
import { expiration } from '../jwt'

const signed = (claims: object) => `header.${btoa(JSON.stringify(claims))}.signature`

const urlSigned = (claims: object) =>
  `header.${btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(claims))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')}.signature`

describe('expiration', () => {
  it('reads the expiry moment of a signed token', () => {
    expect(expiration(signed({ exp: 1734567890 }))).toBe(1734567890000)
  })

  it('cannot lose the expiry behind a base64url payload', () => {
    expect(expiration(urlSigned({ exp: 1734567890, name: 'Гонщик' }))).toBe(1734567890000)
  })

  it('cannot read an expiry out of a shapeless token', () => {
    expect(expiration('not-a-token')).toBeNull()
  })

  it('cannot read an expiry out of a token without the claim', () => {
    expect(expiration(signed({ sub: 'racer' }))).toBeNull()
  })
})
