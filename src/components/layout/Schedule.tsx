import styles from "./Schedule.module.scss";

import { Info } from "luxon";
import type { FC } from "react";

import { ShiftItem } from "@components";
import { Container, Table } from "@components/reusable";

import { useTimesheet } from "@utils";

type ShiftsPerWeek = Record<string, FC>[];

export const Schedule: FC = () => {
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
		<Container>
			<Table
				className={styles.table}
				data={perWeek}
				colDef={["Week", ...Info.weekdays()].map((weekday) => ({
					prop: weekday
				}))}
			/>
		</Container>
	);
};
