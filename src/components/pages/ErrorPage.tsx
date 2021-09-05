import styles from "./ErrorPage.module.scss";

import { AxiosError } from "axios";
import type { FC } from "react";

import { Center, Card } from "@components/reusable";

import type { TimesheetError } from "@utils/TimesheetError";

export const ErrorPage: FC<{ swr?: AxiosError; timesheet?: TimesheetError }> =
	({ swr, timesheet }) => (
		<Center>
			<Card title="Error">
				{swr && (
					<>
						Request to
						<> </>
						<span className={styles.dim}>{swr.config.url}</span>
						<> </>
						failed:
						<div className={styles.mt}>{swr.message}</div>
					</>
				)}
				{timesheet && timesheet.error}
			</Card>
		</Center>
	);
