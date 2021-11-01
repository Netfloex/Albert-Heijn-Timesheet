import styles from "./Footer.module.scss";

import type { FC } from "react";

import { DarkModeSwitcher } from "@components/DarkModeSwitcher";
import { LanguageSwitcher } from "@components/LanguageSwitcher";
import { HumanizeTime } from "@components/reusable";

import { useTimesheet } from "@hooks";

export const Footer: FC = () => {
	const { updated } = useTimesheet();
	return (
		<>
			<div className={styles.footerSize}></div>
			<footer className={`${styles.footerSize} ${styles.footer}`}>
				<div className={styles.flex}>
					<span className="small-hidden">
						Albert Heijn shifts schedule.
					</span>
					<> Updated </>
					<HumanizeTime date={updated} />
					<> ago.</>
				</div>
				<LanguageSwitcher />
				<DarkModeSwitcher />
			</footer>
		</>
	);
};
