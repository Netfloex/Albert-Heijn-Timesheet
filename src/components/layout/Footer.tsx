import styles from "./Footer.module.scss";

import type { FC } from "react";

import { DarkModeSwitcher } from "@components/DarkModeSwitcher";
import { HumanizeTime } from "@components/reusable";

import { useTimesheet } from "@hooks";

export const Footer: FC = () => {
	const { updated } = useTimesheet();
	return (
		<footer className={styles.footer}>
			<div className={styles.flex}>
				<span className="small-hidden">
					Albert Heijn shifts schedule.
				</span>
				<> Updated </>
				<HumanizeTime date={updated} />
				<> ago.</>
			</div>
			<DarkModeSwitcher />
		</footer>
	);
};
