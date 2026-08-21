export const BOUNCE_HOLD_TIME = -1

export const isBounce = ({ hold_time, bounced }: { hold_time: number; bounced?: boolean }) =>
  bounced === true || hold_time === BOUNCE_HOLD_TIME
