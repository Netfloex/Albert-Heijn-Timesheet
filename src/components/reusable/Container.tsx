import styles from "./Container.module.scss";

import type { FC } from "react";

export const Container: FC = ({ children }) => {
	return <div className={styles.container}>{children}</div>;
};
