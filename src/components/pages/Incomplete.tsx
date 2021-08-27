import { FC, useContext } from "react";
import useSWR from "swr";

import { TimesheetContext } from "@components/TimesheetProvider";
import { Dashboard, Loading } from "@components/pages";
import { Center } from "@components/reusable";

import { Error } from "@models/getTimesheetErrors";
import { Month } from "@models/store";

export const Incomplete: FC = () => {
	const { updateTimesheet } = useContext(TimesheetContext);
	const { data, error } = useSWR<Month | Error>("/api");

	// data? error?

	if (error) {
		return <>{error}</>;
	}

	// data?

	if (!data) {
		return <Loading />;
	}

	// data!

	if ("error" in data) {
		return <Center>{data.error}</Center>;
	}

	// data == Month

	if (updateTimesheet) {
		updateTimesheet(data);
		return <Dashboard />;
	}

	// !updateTimesheet

	throw new Error("updateTimesheet is undefined");
};
