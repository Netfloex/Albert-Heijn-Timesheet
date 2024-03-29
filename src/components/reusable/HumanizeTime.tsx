import { DateTime, Duration } from "luxon"
import { FC, useCallback, useEffect, useState } from "react"

import { humanize } from "@utils"

export const HumanizeTime: FC<{ date: DateTime }> = ({ date }) => {
	const calculate = useCallback((): Duration => date.diffNow(), [date])

	const [duration, setDuration] = useState(calculate)

	useEffect(() => {
		const interval = setInterval(() => {
			setDuration(calculate)
		}, 1000)

		return (): void => clearInterval(interval)
	}, [calculate])

	return (
		<time suppressHydrationWarning dateTime={date.toISO()}>
			{humanize(duration)}
		</time>
	)
}
