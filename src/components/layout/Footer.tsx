import styles from "./Footer.module.scss";

import type { FC } from "react";

import { DarkModeSwitcher } from "@components/DarkModeSwitcher";

import { useTimesheet } from "@utils";
import { humanize } from "@utils/humanize";

export const Footer: FC = () => {
	const { updated } = useTimesheet();
	return (
		<footer className={styles.footer}>
			<div className={styles.flex}>
				Albert Heijn shifts schedule.
				<> Updated </>
				<time dateTime={updated.toISO()}>
					{humanize(updated.diffNow(), { largest: 1 })}
				</time>
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
