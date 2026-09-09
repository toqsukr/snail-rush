import { render, screen } from '@testing-library/react'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { describe, expect, it, vi } from 'vitest'
import { DeviceType, useDeviceDetection } from '@shared/lib/device'
import en from '../../../lib/locales/i18n-en.json'
import { Controls } from '../controls'

vi.mock('@shared/lib/device', () => ({ useDeviceDetection: vi.fn() }))

i18n.use(initReactI18next).init({ resources: { en: { translation: en } }, lng: 'en' })

const reference = (device: DeviceType) => {
  vi.mocked(useDeviceDetection).mockReturnValue(device)
  render(<Controls />)
  return screen
}

describe('controls reference', () => {
  it('cannot hide the charge window of a full-power jump', () => {
    expect(reference('desktop').getByText(/500/)).toBeTruthy()
  })

  it('cannot promise a jump weaker than the charge floor', () => {
    expect(reference('desktop').getByText(/40%/)).toBeTruthy()
  })

  it('cannot understate the stun an obstacle costs', () => {
    expect(reference('desktop').getByText(/1\.6/)).toBeTruthy()
  })

  it('cannot keep the arrow keys silent on a desktop', () => {
    expect(reference('desktop').getByText('SPACE')).toBeTruthy()
  })

  it('cannot name keyboard keys on a touch device', () => {
    expect(reference('mobile').queryByText('SPACE')).toBeNull()
  })

  it('cannot leave a touch player without the joystick', () => {
    expect(reference('mobile').getByText('JOYSTICK')).toBeTruthy()
  })
})
