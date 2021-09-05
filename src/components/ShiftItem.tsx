import styles from "./ShiftItem.module.scss";

import { DateTime } from "luxon";
import type { FC } from "react";

import { formatInterval } from "@utils/formats";

import type { LuxonShift } from "@models/LuxonTimesheet";

export const ShiftItem: FC<{ shift: LuxonShift }> = ({ shift }) => (
	<div
		className={styles.shiftItem}
		title={
			shift.start.toLocaleString(DateTime.DATE_HUGE) +
			"\n" +
			shift.interval.toDuration().toFormat("h:mm 'hours'")
		}
	>
		<div>
			{shift.start.toLocaleString({
				day: "numeric",
				month: "long"
			})}
		</div>
		{formatInterval(shift.interval)}
	</div>
);
