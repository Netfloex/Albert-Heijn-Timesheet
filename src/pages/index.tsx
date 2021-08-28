import type { GetStaticProps, NextPage } from "next";

import { TimesheetProvider } from "@components";
import { Dashboard, Error, Incomplete } from "@components/pages";

import { getTimesheet } from "@utils/getTimesheet";

import ErrorType from "@models/getTimesheetErrors";
import type { Month } from "@models/store";

type Props = { timesheet: Month } | { error: string; type: ErrorType };

const Home: NextPage<Props> = (props) => {
	return (
		<TimesheetProvider
			timesheet={"error" in props ? undefined : props.timesheet}
		>
			{"error" in props ? (
				props.type == ErrorType.Incomplete ? (
					<Incomplete />
				) : (
					<Error timesheet={props} />
				)
			) : (
				<Dashboard />
			)}
		</TimesheetProvider>
	);
};

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
		}
	};
};

export default Home;
