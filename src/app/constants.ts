import { Vector3 } from 'three'

export const STUN_TIMEOUT = 1600
export const START_TIMER_VALUE = 3
export const MAX_SPACE_HOLD_TIME = 400
export const MAIN_MENU_ROTATION = [0, 0, 0] satisfies [number, number, number]
export const MAIN_MENU_POSITION = [16.1, 35, -5] satisfies [number, number, number]
export const SKIN_MENU_ROTATION = [0, -Math.PI / 2, 0] satisfies [number, number, number]
export const SKIN_MENU_POSITION = [25, 35, 5] satisfies [number, number, number]
export const LIGHT_POSITION = [5, 1, 0] satisfies [number, number, number]
export const FINISH_POSITION = new Vector3(54, 0.5, -4)
export const COUNTDOWN_ROTATION = [Math.PI / 8, 0, 0]
export const SKIN_SNAIL_POSITION = [25, 41, 5] satisfies [number, number, number]
export const SKIN_SNAIL_ROTATION = [0, (32 * Math.PI) / 24, 0] satisfies [number, number, number]
