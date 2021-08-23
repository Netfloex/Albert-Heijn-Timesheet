import styles from "./Schedule.module.scss";

import { Info } from "luxon";
import type { FC } from "react";

import ShiftItem from "@components/ShiftItem";
import Table from "@components/Table";

import useTimesheet from "@utils/useTimesheet";

type ShiftsPerWeek = Record<string, FC>[];

const Schedule: FC = () => {
	const timesheet = useTimesheet();

	const perWeek: ShiftsPerWeek = [];

	timesheet.shifts.forEach((shift) => {
		const weekWithYear = shift.start.weekNumber + shift.start.year * 100;

		const Week: FC = () => <td>{shift.start.weekNumber.toString()}</td>;

		perWeek[weekWithYear] ??= { Week };

		const Shift: FC = () => <ShiftItem shift={shift} />;
		perWeek[weekWithYear][shift.start.weekdayLong] = Shift;
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
