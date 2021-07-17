import styles from "./Dashboard.module.scss";

import Schedule from "@components/Schedule";
import DarkModeSwitcher from "@components/DarkModeSwitcher";

import { Month } from "@models/store";
import { FC } from "react";

const Dashboard: FC<{ timesheet: Month }> = ({ timesheet }) => (
	<>
		<Schedule timesheet={timesheet} />
		<footer className={styles.footer}>
			<div className={styles.left}>Albert Heijn shifts schedule</div>
			<div className={styles.right}>
				<div className={styles.darkmodeWrapper}>
					<DarkModeSwitcher />
				</div>
			</div>
		</footer>
	</>
);

export default Dashboard;
