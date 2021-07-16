import { GetStaticProps, NextPage } from "next";
import { Month } from "@models/store";
import env from "@utils/env";
import SamLogin from "@utils/SamLogin";
import Dashboard from "@components/Dashboard";

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

	await sam.login();

	const timesheet = await sam.timesheet({ date: new Date() });

	return {
		props: {
			timesheet
		}
	};
};

export default Home;
