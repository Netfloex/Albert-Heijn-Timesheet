import { calendarNotifyMinutes } from "./env"
import { DateTime } from "luxon"

import { IcsEvent, createIcs } from "@server"

import LuxonTimesheet from "@models/LuxonTimesheet"

export const timesheetToIcs = (timesheet: LuxonTimesheet): string => {
	const events: IcsEvent[] = timesheet.shifts.map((shift) => ({
		summary: `Werken ${shift.start.setLocale("nl").toFormat("EEEE")}`,
		start: shift.start,
		end: shift.end,

		description: `Geüpdated op ${timesheet.updated
			.setLocale("nl")
			.toLocaleString(DateTime.DATETIME_MED)}`,
		alarms: calendarNotifyMinutes,
	}))

	return createIcs({ name: "Shifts", updated: timesheet.updated }, events)
}
