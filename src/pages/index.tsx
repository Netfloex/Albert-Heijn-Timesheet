import { timesheetCacheDuration } from "@env";

import type { GetStaticProps, NextPage } from "next";

import { TimesheetProvider } from "@components";
import { Dashboard, ErrorPage, Incomplete } from "@components/pages";

import { getTimesheet } from "@server";
import { isError, TimesheetData } from "@utils";

import { ErrorType } from "@models/ErrorType";

const Home: NextPage<TimesheetData> = (props) => (
	<TimesheetProvider timesheet={isError(props) ? undefined : props}>
		{isError(props) ? (
			props.type == ErrorType.Incomplete ? (
				<Incomplete element={<Dashboard />} />
			) : (
				<ErrorPage timesheet={props} />
			)
		) : (
			<Dashboard />
		)}
	</TimesheetProvider>
);

export const getStaticProps: GetStaticProps<TimesheetData> = async () => {
	const timesheet = await getTimesheet();

	let revalidate: number | undefined = timesheetCacheDuration;

	if ("error" in timesheet) {
		revalidate = timesheet.type == ErrorType.Incomplete ? 1 : undefined;
	}

	return {
		props: timesheet,
		revalidate
	};
};

export default Home;
