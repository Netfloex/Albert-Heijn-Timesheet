import styles from "./Schedule.module.scss";

import { DateTime, Info } from "luxon";
import type { FC } from "react";

import { ShiftItem } from "@components";
import { Container, Table } from "@components/reusable";

import { useLuxonLocale, useShiftsPerWeek } from "@hooks";

import { dateWithMonthFormat, weekIndexFormat } from "@formats";

import { RenderCell } from "@models/Table";

type JSXTableData = Record<
	string,
	Record<string, JSX.Element> & { currentWeek?: true }
>;

export const Schedule: FC = () => {
	const { shiftsWeekObject, startWeek, lastWeek } = useShiftsPerWeek();

	const [localNow, localWeekdays] = useLuxonLocale(() => [
		DateTime.now(),
		Info.weekdays()
	]);

	const JSXTableData: JSXTableData = {};

	for (let i = startWeek; i <= lastWeek; i++) {
		const shifts = shiftsWeekObject[i] ?? [];
		const { weekNumber } = DateTime.fromFormat(
			i.toString(),
			weekIndexFormat
		);

		JSXTableData[weekNumber] ??= { Week: <>{weekNumber}</> };

		const row = JSXTableData[weekNumber];

		if (i.toString() == DateTime.now().toFormat(weekIndexFormat)) {
			row.currentWeek = true;
		}
		shifts.forEach((shift) => {
			row[shift.start.weekdayLong] = <ShiftItem shift={shift} />;
		});
	}

	const RenderCell: RenderCell = ({ children, row, col }) => {
		const today = row.currentWeek && col.prop == localNow.weekdayLong;

		return (
			<td className={today ? styles.today : undefined}>
				{children ??
					(today
						? localNow.toLocaleString(dateWithMonthFormat)
						: undefined)}
			</td>
		);
	};

	return (
		<Container>
			<Table
				className={styles.table}
				data={Object.values(JSXTableData)}
				colDef={["Week", ...localWeekdays].map((weekday) => ({
					prop: weekday
				}))}
				RenderCell={RenderCell}
			/>
		</Container>
	);
};
