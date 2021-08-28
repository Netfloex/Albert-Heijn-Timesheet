import { AxiosError } from "axios";
import { FC, useContext } from "react";
import useSWR from "swr";

import { TimesheetContext } from "@components/TimesheetProvider";
import { Dashboard, Loading, Error as ErrorPage } from "@components/pages";

import { fetcher } from "@utils";

import { Error } from "@models/getTimesheetErrors";
import { Month } from "@models/store";

export const Incomplete: FC = () => {
	const { updateTimesheet } = useContext(TimesheetContext);
	const { data, error } = useSWR<Month | Error, AxiosError>("/api", fetcher);

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

	// data == Month

	if (updateTimesheet) {
		updateTimesheet(data);
		return <Dashboard />;
	}

	// !updateTimesheet

	throw new Error("updateTimesheet is undefined");
};
