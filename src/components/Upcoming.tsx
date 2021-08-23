import styles from "./Upcoming.module.scss";

import { FC } from "react";

import Container from "@components/Container";

import useTimesheet from "@utils/useTimesheet";

const Upcoming: FC = () => {
	const timesheet = useTimesheet();

	const upcomingShifts = timesheet.shifts
		.filter((shift) => shift.start.diffNow().milliseconds > 0)
		.slice(0, 3);

	return (
		<Container>
			<div className={styles.upcoming}>
				<h1 className={styles.title}>Komende shifts:</h1>
				<div className={styles.content}>
					{upcomingShifts.map((shift) => (
						<div
							className={styles.shift}
							key={shift.interval.toISO()}
						>
							{shift.start.weekdayLong}
							<> </>
							{shift.interval.toFormat("T", { separator: " ~ " })}
							<br />
						</div>
					))}
				</div>
			</div>
		</Container>
	);
};

export default Upcoming;
