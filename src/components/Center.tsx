import styles from "./Center.module.scss";

import type { FC } from "react";

const Center: FC = ({ children }) => (
	<div className={styles.center}>{children}</div>
);

export default Center;
