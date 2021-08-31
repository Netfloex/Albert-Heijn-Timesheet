import styles from "./Upcoming.module.scss";

import { DateTime } from "luxon";
import { FC } from "react";

import { Container, Card } from "@components/reusable";

import { useTimesheet } from "@utils";

export const Upcoming: FC = () => {
	const timesheet = useTimesheet();

	const upcomingShifts = timesheet.shifts
		.filter((shift) => shift.start.diffNow().milliseconds > 0)
		.slice(0, 3);

	return (
		<Container>
			<Card title={"Komende shifts:"}>
				{upcomingShifts.map((shift) => (
					<div className={styles.shift} key={shift.interval.toISO()}>
						{shift.start.toLocaleString({
							weekday: "long",
							month: "long",
							day: "numeric"
						})}
						:
						<span className={styles.time}>
							{shift.interval.toFormat("T", {
								separator: " - "
							})}
						</span>
					</div>
				))}
			</Card>
		</Container>
	);
};
