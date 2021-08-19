import styles from "./DarkModeSwitcher.module.scss";

import { useTheme } from "next-themes";
import type { FC } from "react";

const DarkModeSwitcher: FC = () => {
	const { theme, setTheme } = useTheme();

	return (
		<div
			className={styles.switcher}
			onMouseDown={(e): void => {
				e.preventDefault();
				setTheme(theme == "dark" ? "light" : "dark");
			}}
		>
			<div className={styles.text}>Darkmode</div>
			<button className={styles.wrapper}>
				<div className={styles.slider}></div>
			</button>
		</div>
	);
};

export default DarkModeSwitcher;
