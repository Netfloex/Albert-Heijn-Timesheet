import styles from "./Upcoming.module.scss";

import { DateTime } from "luxon";
import { FC } from "react";

import { Container, Card } from "@components/reusable";

import { useTimesheet } from "@hooks";

import { dateWithMonthFormat, formatInterval } from "@formats";

export const Upcoming: FC = () => {
	const timesheet = useTimesheet();
	const upcomingShifts = timesheet.shifts
		.filter((shift) => shift.start > DateTime.now())
		.slice(0, 3);

	return (
		<Container>
			<Card title={"Komende shifts:"} paddingContent={false}>
				{upcomingShifts.map((shift) => (
					<div className={styles.shift} key={shift.interval.toISO()}>
						<div className={styles.date}>
							{shift.start.toLocaleString({
								weekday: "long",
								...dateWithMonthFormat
							})}
							:
						</div>
						<span>{formatInterval(shift.interval)}</span>
					</div>
				))}
			</Card>
		</Container>
	);
};
