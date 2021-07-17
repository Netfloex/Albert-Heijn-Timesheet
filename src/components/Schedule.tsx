import Table from "@components/Table";

import { DateTime, Info } from "luxon";

type ShiftsPerWeek = Record<string, string>[];

import { Month } from "@models/store";
import { FC } from "react";

const Schedule: FC<{ timesheet: Month }> = ({ timesheet }) => {
	const perWeek: ShiftsPerWeek = [];

	timesheet.parsed.forEach((shift) => {
		const startDate = DateTime.fromISO(shift.start);
		const endDate = DateTime.fromISO(shift.end);

		const weekWithYear = startDate.weekNumber + startDate.year * 100;

		perWeek[weekWithYear] ??= {};
		perWeek[weekWithYear][startDate.weekdayLong] =
			startDate.toFormat("T") + " ~ " + endDate.toFormat("T");
	});

	return (
		<>
			<Table
				data={perWeek}
				colDef={Info.weekdays().map((weekday) => ({
					prop: weekday
				}))}
			/>
		</>
	);
};

export default Schedule;
