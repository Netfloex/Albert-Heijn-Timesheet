import styles from "./Card.module.scss";

import type { FC, ReactNode } from "react";

export const Card: FC<{ title: ReactNode; paddingContent?: boolean }> = ({
	title,
	paddingContent = true,
	children
}) => (
	<div className={styles.card}>
		<h1 className={styles.title}>{title}</h1>
		<div className={paddingContent ? styles.padding : ""}>{children}</div>
	</div>
);
