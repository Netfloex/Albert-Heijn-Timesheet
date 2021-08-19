import Dashboard from "@components/Dashboard";
import SamLogin from "@utils/SamLogin";
import env from "@utils/env";

import { Month } from "@models/store";
import type { GetStaticProps, NextPage } from "next";

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
	if (!env.complete) {
		return {
			props: {
				error: "ENV Is Incomplete"
			},
			revalidate: 1
		};
	}
	const sam = new SamLogin({
		username: env.ahusername,
		password: env.ahpassword
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
