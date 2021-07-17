import styles from "./ShiftItem.module.scss";

import { DateTime, Interval } from "luxon";

import type { Shift } from "@models/store";
import type { FC } from "react";

const ShiftItem: FC<{ shift: Shift }> = ({ shift }) => {
	const interval = Interval.fromISO(shift.start + "/" + shift.end);
	console.log();

	return (
		<td
			className={styles.shiftItem}
			title={
				interval.start.toLocaleString(DateTime.DATE_HUGE) +
				"\n" +
				interval.toDuration().toFormat("h:mm 'hours'")
			}
		>
			<div>
				{}
				{interval.start.toFormat("d LLLL")}
			</div>
			{interval.toFormat("T", { separator: " ~ " })}
		</td>
	);
};

export default ShiftItem;
