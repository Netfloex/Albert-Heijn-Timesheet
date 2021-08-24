import type { GetStaticProps, NextPage } from "next";

import Dashboard from "@components/Dashboard";
import TimesheetProvider from "@components/TimesheetProvider";

import getTimesheet, { ErrorType } from "@utils/getTimesheet";

import { Month } from "@models/store";

type Props = { timesheet: Month } | { error: string };

const Home: NextPage<Props> = (props) => {
	if ("error" in props) {
		return <>{props.error}</>;
	}
	return (
		<TimesheetProvider timesheet={props.timesheet}>
			<Dashboard />
		</TimesheetProvider>
	);
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const timesheet = await getTimesheet();

	if ("error" in timesheet) {
		if (timesheet.type == ErrorType.Incomplete) {
			return {
				props: {
					error: timesheet.error
				},
				revalidate: 1
			};
		} else {
			return {
				props: {
					error: timesheet.error
				}
			};
		}
	}

	return {
		props: {
			timesheet
		}
	};
};

export default Home;
