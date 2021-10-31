import { timesheetCacheDuration } from "@env";

import type { GetStaticProps, NextPage } from "next";

import { TimesheetProvider } from "@components";
import { Dashboard, ErrorPage, Incomplete } from "@components/pages";

import { getTimesheet } from "@server";
import { TimesheetError } from "@utils";

import { ErrorType } from "@models/ErrorType";
import type { Timesheet } from "@models/Schema";

type Props = Timesheet | TimesheetError;

const isError = (props: Props): props is TimesheetError => "error" in props;

const Home: NextPage<Props> = (props) => (
	<TimesheetProvider timesheet={isError(props) ? undefined : props}>
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

	let revalidate: number | undefined = timesheetCacheDuration;

	if ("error" in timesheet) {
		if (timesheet.type == ErrorType.Incomplete) {
			revalidate = 1;
		} else {
			revalidate = undefined;
		}
	}

	return {
		props: timesheet,
		revalidate: revalidate
	};
};

export default Home;
