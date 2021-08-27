import styles from "./ShiftItem.module.scss";

import { DateTime } from "luxon";
import type { FC } from "react";

import { LuxonShift } from "@models/LuxonTimesheet";

export const ShiftItem: FC<{ shift: LuxonShift }> = ({ shift }) => (
	<td
		className={styles.shiftItem}
		title={
			shift.start.toLocaleString(DateTime.DATE_HUGE) +
			"\n" +
			shift.interval.toDuration().toFormat("h:mm 'hours'")
		}
	>
		<div>{shift.start.toFormat("d LLLL")}</div>
		{shift.interval.toFormat("T", { separator: " ~ " })}
	</td>
);
