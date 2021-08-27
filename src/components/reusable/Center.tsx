import styles from "./Center.module.scss";

import type { FC } from "react";

export const Center: FC = ({ children }) => (
	<div className={styles.center}>{children}</div>
);
