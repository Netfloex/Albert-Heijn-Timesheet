import { AxiosError } from "axios"
import { useContext, useEffect } from "react"
import useSWR from "swr"

import { TimesheetContext } from "@components/TimesheetProvider"

import { TimesheetError, fetcher } from "@utils"

import type { Timesheet } from "@models/Schema"

type Response = Timesheet | TimesheetError

export const useSWRUpdateTimesheet = (
	run = true,
): Partial<{
	data: Response
	error: AxiosError
}> => {
	const { updateTimesheet } = useContext(TimesheetContext)
	const { data, error } = useSWR<Response, AxiosError>(
		run ? "/api" : null,
		fetcher,
	)

	useEffect(() => {
		if (data && "parsed" in data) {
			updateTimesheet?.(data)
		}
	}, [data, updateTimesheet])

	return { data, error }
}
