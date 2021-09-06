import { DateTime, Interval } from "luxon";
import { useContext } from "react";

import { TimesheetContext } from "@components/TimesheetProvider";

import { useLuxonLocale } from "@hooks";

import type LuxonTimesheet from "@models/LuxonTimesheet";

export const useTimesheet = (): LuxonTimesheet => {
	const { timesheet } = useContext(TimesheetContext);
	return useLuxonLocale(() => {
		if (!timesheet) {
			return {
				updated: DateTime.invalid("No Timesheet"),
				shifts: []
			};
		}

		const parsedShifts = timesheet.parsed.map((shift) => {
			const interval = Interval.fromISO(`${shift.start}/${shift.end}`);
			return {
				start: interval.start,
				end: interval.end,
				interval
			};
		});

		return {
			updated: DateTime.fromISO(timesheet.updated),
			shifts: parsedShifts
		};
	});
};
