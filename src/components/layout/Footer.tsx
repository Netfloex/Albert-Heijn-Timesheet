import styles from "./Footer.module.scss";

import type { FC } from "react";

import { DarkModeSwitcher } from "@components/DarkModeSwitcher";
import { HumanizeTime } from "@components/reusable";

import { useTimesheet } from "@utils";

export const Footer: FC = () => {
	const { updated } = useTimesheet();
	return (
		<footer className={styles.footer}>
			<div className={styles.flex}>
				Albert Heijn shifts schedule.
				<> Updated </>
				<HumanizeTime date={updated} />
				<> ago.</>
			</div>
			<div className={styles.flex}>
				<div className={styles.darkmodeWrapper}>
					<DarkModeSwitcher />
				</div>
			</div>
		</footer>
	);
};
