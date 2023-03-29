import { DateTime, Interval } from "luxon"

import LuxonTimesheet from "@models/LuxonTimesheet"
import { Timesheet } from "@models/Schema"

export const parseTimesheet = (timesheet?: Timesheet): LuxonTimesheet => {
	if (!timesheet) {
		return {
			updated: DateTime.invalid("No Timesheet"),
			shifts: [],
		}
	}

	const parsedShifts = timesheet.parsed.map((shift) => {
		const interval = Interval.fromISO(`${shift.start}/${shift.end}`)
		return {
			start: interval.start,
			end: interval.end,
			interval,
		}
	})

	return {
		updated: DateTime.fromISO(timesheet.updated),
		shifts: parsedShifts,
	}
}
