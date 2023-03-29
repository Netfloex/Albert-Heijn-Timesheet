import { Options, humanizer } from "humanize-duration"
import type { Duration } from "luxon"

const withDefaultOptions = humanizer({
	largest: 1,
	round: true,
	conjunction: " and ",
	serialComma: false,
})

export const humanize = (time: Duration, options?: Options): string =>
	withDefaultOptions(time.valueOf(), {
		language: time.locale,
		fallbacks: ["en"],
		...options,
	})
