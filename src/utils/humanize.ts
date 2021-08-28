import humanizeDuration, { Options } from "humanize-duration";
import { Duration } from "luxon";

export const humanize = (time: Duration, options?: Options): string =>
	humanizeDuration(time.as("milliseconds"), {
		largest: 2,
		round: true,
		conjunction: " and ",
		serialComma: false,
		...options
	});
