import styles from "./Container.module.scss";

import { FCC } from "@models/FCC";

export const Container: FCC = ({ children }) => {
	return <div className={styles.container}>{children}</div>;
};
