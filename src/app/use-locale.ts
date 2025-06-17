import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export const languageCodes: string[] = ['en', 'ru'] as const

export const useLocale = () => {
  const { i18n } = useTranslation()

  // const initData = useInitData()

  // const code = initData?.user?.languageCode ?? ''

  // const language = languageCodes.find(value => value === code) ?? languageCodes[0]

  useEffect(() => {
    i18n.changeLanguage(languageCodes[1])
  }, [i18n])
}
