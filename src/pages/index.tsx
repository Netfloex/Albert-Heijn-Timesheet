import type { GetStaticProps, NextPage } from "next";

import Dashboard from "@components/Dashboard";

import SamLogin from "@lib/SamLogin";
import Store from "@lib/store";
import { username, password, storePath } from "@utils/env";

import Schema, { Month } from "@models/store";

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

	const store = new Store<Schema>(storePath, { shifts: {} });

	const go = new SamLogin({
		username,
		password,
		store
	});

	await store.init();

	try {
		const timesheet = await go.get();

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
