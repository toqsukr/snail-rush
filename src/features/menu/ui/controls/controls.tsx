import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { MAX_SPACE_HOLD_TIME, MIN_JUMP_POWER, STUN_TIMEOUT } from '@shared/config/game'
import { useDeviceDetection } from '@shared/lib/device'

const Hint: FC<{ term: string; description: string }> = ({ term, description }) => (
  <div className='flex flex-col gap-1'>
    <dt className='text-[var(--primary-color)]'>{term}</dt>
    <dd>{description}</dd>
  </div>
)

export const Controls = () => {
  const { t } = useTranslation()
  const isTouch = useDeviceDetection() !== 'desktop'

  return (
    <dl className='flex flex-col gap-3 text-start bg-[black] rounded-[.4rem] p-[0.6rem]'>
      <Hint
        term={t(isTouch ? 'controls_joystick_term_text' : 'controls_arrows_term_text')}
        description={t('controls_turn_hint_text')}
      />
      <Hint
        term={t(isTouch ? 'controls_jump_button_term_text' : 'controls_space_term_text')}
        description={t('controls_jump_hint_text', {
          charge: MAX_SPACE_HOLD_TIME,
          floor: 100 * MIN_JUMP_POWER,
        })}
      />
      <Hint term={t('controls_air_term_text')} description={t('controls_air_hint_text')} />
      <Hint
        term={t('controls_stun_term_text')}
        description={t('controls_stun_hint_text', { stun: STUN_TIMEOUT / 1000 })}
      />
    </dl>
  )
}
