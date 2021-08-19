import styles from "./Schedule.module.scss";

import { DateTime, Info } from "luxon";
import type { FC } from "react";

import ShiftItem from "@components/ShiftItem";
import Table from "@components/Table";

import type { Month } from "@models/store";

type ShiftsPerWeek = Record<string, FC>[];

const Schedule: FC<{ timesheet: Month }> = ({ timesheet }) => {
	const perWeek: ShiftsPerWeek = [];

	timesheet.parsed.forEach((shift) => {
		const startDate = DateTime.fromISO(shift.start);

		const weekWithYear = startDate.weekNumber + startDate.year * 100;

		const Week: FC = () => <td>{startDate.weekNumber.toString()}</td>;

		perWeek[weekWithYear] ??= { Week };

		const Shift: FC = () => <ShiftItem shift={shift} />;
		perWeek[weekWithYear][startDate.weekdayLong] = Shift;
	});

	return (
		<>
			<Table
				className={styles.table}
				data={perWeek}
				colDef={["Week", ...Info.weekdays()].map((weekday) => ({
					prop: weekday
				}))}
			/>
		</>
	);
};

export default Schedule;
