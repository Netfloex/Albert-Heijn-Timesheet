import { FC } from "react";

import { Dashboard, ErrorPage, Loading } from "@components/pages";

import { useSWRUpdateTimesheet } from "@hooks";

export const Incomplete: FC = () => {
	const { data, error } = useSWRUpdateTimesheet();

	// data? error?

	if (error) {
		return <ErrorPage swr={error} />;
	}

	// data?

	if (!data) {
		return <Loading />;
	}

	// data!

	if ("error" in data) {
		return <ErrorPage timesheet={data} />;
	}

	// data == Timesheet

	return <Dashboard />;
};
