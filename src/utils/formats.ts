import { Interval } from "luxon";

export const formatInterval = (interval: Interval): string =>
	interval.toFormat("t", {
		separator: " - "
	});

export const dateWithMonthFormat: Intl.DateTimeFormatOptions = {
	day: "numeric",
	month: "long"
};

export const weekIndexFormat = "kkkkWW"; // ISO week year, ISO week number > 202133
