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
		const { weekNumber } = DateTime.fromFormat(
			i.toString(),
			weekIndexFormat
		);

		if (isNaN(weekNumber)) continue;
		const shifts = shiftsWeekObject[i] ?? [];

		JSXTableData[i] ??= { 0: <>{weekNumber}</> };

		const row = JSXTableData[i];

		if (i.toString() == DateTime.now().toFormat(weekIndexFormat)) {
			row.currentWeek = true;
		}
		shifts.forEach((shift) => {
			row[shift.start.weekday] = <ShiftItem shift={shift} />;
		});
	}

	const RenderCell: RenderCell = ({ children, row, col }) => {
		const today = row.currentWeek && col.id == localNow.weekday;

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
			<div className={styles.wrapper}>
				<Table
					className={styles.table}
					data={Object.values(JSXTableData)}
					colDef={["Week", ...localWeekdays].map((name, id) => ({
						id,
						name
					}))}
					RenderCell={RenderCell}
				/>
			</div>
		</Container>
	);
};
