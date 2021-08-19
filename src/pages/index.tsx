import type { GetStaticProps, NextPage } from "next";

import Dashboard from "@components/Dashboard";

import SamLogin from "@utils/SamLogin";
import { username, password } from "@utils/env";

import { Month } from "@models/store";

const Home: NextPage<{ timesheet: Month; error?: string }> = ({
	timesheet,
	error
}) => {
	if (error) {
		return <>{error}</>;
	}
	return <Dashboard timesheet={timesheet} />;
};

export const getStaticProps: GetStaticProps = async () => {
	if (!username || !password) {
		return {
			props: {
				error: "ENV Is Incomplete"
			},
			revalidate: 1
		};
	}

	const sam = new SamLogin({
		username,
		password
	});

	try {
		await sam.login();
		const timesheet = await sam.timesheet({ date: new Date() });

		return {
			props: {
				timesheet
			}
		};
	} catch (error) {
		return {
			props: {
				error: error?.toString()
			}
		};
	}
};

export default Home;
