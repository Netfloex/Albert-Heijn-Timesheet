import styles from "./Dashboard.module.scss";

import { NextSeo } from "next-seo";
import { FC } from "react";

import { DarkModeSwitcher } from "@components";
import { Schedule, Upcoming } from "@components/layout";

export const Dashboard: FC = () => (
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
