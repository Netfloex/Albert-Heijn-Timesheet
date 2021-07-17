import { useTheme } from "next-themes";

import styles from "./DarkModeSwitcher.module.scss";

import type { FC } from "react";

const DarkModeSwitcher: FC = () => {
	const { theme, setTheme } = useTheme();

	return (
		<div className={styles.switcher}>
			<div className={styles.text}>Darkmode</div>
			<button
				className={styles.wrapper}
				onMouseDown={(e) => {
					e.preventDefault();
					setTheme(theme == "dark" ? "light" : "dark");
				}}
			>
				<div className={styles.slider}></div>
			</button>
		</div>
	);
};

export default DarkModeSwitcher;
