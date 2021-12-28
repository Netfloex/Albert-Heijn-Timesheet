import { Interval } from "luxon";

export const formatInterval = (interval: Interval, format?: string): string =>
	interval.toFormat(format ?? "t", {
		separator: " - "
	});

export const dateWithMonthFormat: Intl.DateTimeFormatOptions = {
	day: "numeric",
	month: "long"
};

export const weekIndexFormat = "kkkkWW"; // ISO week year, ISO week number > 202133

export const cronFormat = "m H d M EEE";
