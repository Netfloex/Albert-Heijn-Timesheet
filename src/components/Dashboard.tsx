import styles from "./Dashboard.module.scss";

import { NextSeo } from "next-seo";
import { FC } from "react";

import DarkModeSwitcher from "@components/DarkModeSwitcher";
import Schedule from "@components/Schedule";
import Upcoming from "@components/Upcoming";

const Dashboard: FC = () => (
	<>
		<NextSeo title="Timesheet" />

		<Upcoming />
		<Schedule />

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
