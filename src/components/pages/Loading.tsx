import styles from "./Loading.module.scss";

import type { FC } from "react";
import { ClipLoader } from "react-spinners";

import Center from "@components/Center";

const Loading: FC = () => (
	<Center>
		<div className={styles.loading}>
			<div className={styles.text}>Loading...</div>
			<ClipLoader color="#fff" />
		</div>
	</Center>
);

export default Loading;
