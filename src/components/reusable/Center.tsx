import styles from "./Center.module.scss";

import { FCC } from "@models/FCC";

export const Center: FCC = ({ children }) => (
	<div className={styles.center}>{children}</div>
);
