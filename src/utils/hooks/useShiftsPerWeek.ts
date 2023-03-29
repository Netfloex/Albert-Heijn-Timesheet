import { useTimesheet } from "@hooks"

import { weekIndexFormat } from "@formats"

import { LuxonShift } from "@models/LuxonTimesheet"

type ShiftsPerWeek = Record<string, LuxonShift[]>

export const useShiftsPerWeek = (): {
	shiftsWeekObject: ShiftsPerWeek
	startWeek: number
	lastWeek: number
} => {
	const { shifts } = useTimesheet()

	const shiftsWeekObject: ShiftsPerWeek = {}

	shifts.forEach((shift) => {
		const weekWithYear = shift.start.toFormat(weekIndexFormat)
		shiftsWeekObject[weekWithYear] ??= []
		shiftsWeekObject[weekWithYear].push(shift)
	})

	const keys = Object.keys(shiftsWeekObject)

	return {
		shiftsWeekObject,
		startWeek: +keys[0],
		lastWeek: +keys[keys.length - 1],
	}
}
