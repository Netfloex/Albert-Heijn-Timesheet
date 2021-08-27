import { Interval } from "luxon";
import { useContext } from "react";

import { TimesheetContext } from "@components/TimesheetProvider";

import LuxonTimesheet from "@models/LuxonTimesheet";

const useTimesheet = (): LuxonTimesheet => {
	const { timesheet } = useContext(TimesheetContext);

	if (!timesheet) {
		return {
			updated: "never",
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
		updated: timesheet.updated,
		shifts: parsedShifts
	};
};

export default useTimesheet;
