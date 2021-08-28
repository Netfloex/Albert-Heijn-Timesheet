import { AxiosError } from "axios";
import { FC, useContext } from "react";
import useSWR from "swr";

import { TimesheetContext } from "@components/TimesheetProvider";
import { Dashboard, Loading, ErrorPage } from "@components/pages";

import { fetcher } from "@utils";

import type { TimesheetError } from "@models/getTimesheetErrors";
import type { Timesheet } from "@models/store";

export const Incomplete: FC = () => {
	const { updateTimesheet } = useContext(TimesheetContext);
	const { data, error } = useSWR<Timesheet | TimesheetError, AxiosError>(
		"/api",
		fetcher
	);

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

	if (updateTimesheet) {
		updateTimesheet(data);
		return <Dashboard />;
	}

	// !updateTimesheet

	throw new Error("updateTimesheet is undefined");
};
