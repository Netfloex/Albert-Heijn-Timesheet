import { useTimesheet } from "@utils";

import { LuxonShift } from "@models/LuxonTimesheet";

type ShiftsPerWeek = Record<string, LuxonShift[]>;

export const useShiftsPerWeek = (): {
	shiftsWeekObject: ShiftsPerWeek;
	startWeek: number;
	lastWeek: number;
	format: "kkkkW";
} => {
	const { shifts } = useTimesheet();

	const format = "kkkkW"; // ISO week year, ISO week number

	const shiftsWeekObject: ShiftsPerWeek = {};
	shifts.forEach((shift) => {
		const weekWithYear = shift.start.toFormat(format);
		shiftsWeekObject[weekWithYear] ??= [];
		shiftsWeekObject[weekWithYear].push(shift);
	});

	const keys = Object.keys(shiftsWeekObject);

	return {
		shiftsWeekObject,
		startWeek: +keys[0],
		lastWeek: +keys[keys.length - 1],
		format
	};
};
