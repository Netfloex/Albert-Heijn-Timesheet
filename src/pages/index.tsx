import { timesheetCacheDuration } from "@env";

import type { GetStaticProps, NextPage } from "next";

import { TimesheetProvider } from "@components";
import { Dashboard, ErrorPage, Incomplete } from "@components/pages";

import { getTimesheet } from "@utils/getTimesheet";

import { TimesheetError, ErrorType } from "@models/getTimesheetErrors";
import type { Timesheet } from "@models/store";

type Props = { timesheet: Timesheet } | TimesheetError;

const isError = (props: Props): props is TimesheetError => "error" in props;

const Home: NextPage<Props> = (props) => (
	<TimesheetProvider timesheet={isError(props) ? undefined : props.timesheet}>
		{isError(props) ? (
			props.type == ErrorType.Incomplete ? (
				<Incomplete />
			) : (
				<ErrorPage timesheet={props} />
			)
		) : (
			<Dashboard />
		)}
	</TimesheetProvider>
);

export const getStaticProps: GetStaticProps<Props> = async () => {
	const timesheet = await getTimesheet();

	if ("error" in timesheet) {
		return {
			props: {
				...timesheet
			},
			revalidate: timesheet.type == ErrorType.Incomplete ? 1 : undefined
		};
	}

	return {
		props: {
			timesheet
		},
		revalidate: timesheetCacheDuration
	};
};

export default Home;
