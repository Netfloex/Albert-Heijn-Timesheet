import { DateTime, Interval } from "luxon"

export type LuxonShift = {
	start: DateTime
	end: DateTime
	interval: Interval
}

type LuxonTimesheet = {
	updated: DateTime
	shifts: LuxonShift[]
}

export default LuxonTimesheet
