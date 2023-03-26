import { DateTime } from "luxon";

import { createIcs, IcsEvent } from "@server";

import LuxonTimesheet from "@models/LuxonTimesheet";

export const timesheetToIcs = (timesheet: LuxonTimesheet): string => {
	const events: IcsEvent[] = timesheet.shifts.map((shift) => ({
		summary: `Werken ${shift.start.setLocale("nl").toFormat("EEEE")}`,
		start: shift.start,
		end: shift.end,

		description: `Geüpdated op ${timesheet.updated
			.setLocale("nl")
			.toLocaleString(DateTime.DATETIME_MED)}`
	}));

	return createIcs({ name: "Shifts", updated: timesheet.updated }, events);
};
