import humanizeDuration, { Options } from "humanize-duration";
import type { Duration } from "luxon";

export const humanize = (time: Duration, options?: Options): string =>
	humanizeDuration(time.valueOf(), {
		largest: 1,
		round: true,
		conjunction: " and ",
		serialComma: false,
		language: time.locale,
		...options
	});
