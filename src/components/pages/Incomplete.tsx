import { FC, ReactElement } from "react"

import { ErrorPage, Loading } from "@components/pages"

import { useSWRUpdateTimesheet } from "@hooks"

export const Incomplete: FC<{ element: ReactElement }> = ({ element }) => {
	const { data, error } = useSWRUpdateTimesheet()

	// data? error?

	if (error) {
		return <ErrorPage swr={error} />
	}

	// data?

	if (!data) {
		return <Loading />
	}

	// data!

	if ("error" in data) {
		return <ErrorPage timesheet={data} />
	}

	// data == Timesheet

	return element
}
