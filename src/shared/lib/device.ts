import { useEffect, useState } from 'react'

type DeviceType = 'mobile' | 'tablet' | 'desktop'

export const useDeviceDetection = (): DeviceType => {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop')

  useEffect(() => {
    const checkDevice = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

      const userAgent = navigator.userAgent.toLowerCase()
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent
      )
      const isTablet = /ipad|tablet|playbook|silk/i.test(userAgent)

      if (isMobile && hasTouch) {
        return 'mobile'
      } else if (isTablet && hasTouch) {
        return 'tablet'
      } else {
        return 'desktop'
      }
    }

    setDeviceType(checkDevice())
  }, [])

  return deviceType
}
