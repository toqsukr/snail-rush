export const SNAPSHOT_HOLD_TIME = -2

export const isSnapshot = ({ hold_time, snapshot }: { hold_time: number; snapshot?: boolean }) =>
  snapshot === true || hold_time === SNAPSHOT_HOLD_TIME
