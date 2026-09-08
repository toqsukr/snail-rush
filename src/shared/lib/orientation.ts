import { useEffect, useState } from 'react'

const PORTRAIT = '(orientation: portrait)'

export const usePortrait = () => {
  const [portrait, setPortrait] = useState(() => window.matchMedia(PORTRAIT).matches)

  useEffect(() => {
    const query = window.matchMedia(PORTRAIT)
    const sync = () => setPortrait(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  return portrait
}
