import { timesheetCacheDuration } from "@env";

import { NextSeo } from "next-seo";
import { FC } from "react";

import { Footer, Schedule, Upcoming } from "@components/layout";

import { useSWRUpdateTimesheet, useTimesheet } from "@utils";

export const Dashboard: FC = () => {
	// When the timesheet on the client is old/stale refetch from server
	const { updated } = useTimesheet();
	const stale =
		updated.diffNow().negate().as("seconds") > timesheetCacheDuration;
	useSWRUpdateTimesheet(stale);

	return (
		<>
			<NextSeo title="Timesheet" />

			<Upcoming />
			<Schedule />

			<Footer />
		</>
	);
};
