import styles from "./Card.module.scss";

import type { FC, ReactNode } from "react";

export const Card: FC<{ title: ReactNode }> = ({ title, children }) => (
	<div className={styles.card}>
		<h1 className={styles.title}>{title}</h1>
		<div className={styles.content}>{children}</div>
	</div>
);
