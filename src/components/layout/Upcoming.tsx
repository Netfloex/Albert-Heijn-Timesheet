import styles from "./Upcoming.module.scss";

import { FC } from "react";

import { Container } from "@components/reusable";
import Card from "@components/reusable/Card";

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
						{shift.start.weekdayLong}
						<> </>
						{shift.interval.toFormat("T", { separator: " ~ " })}
						<br />
					</div>
				))}
			</Card>
		</Container>
	);
};
