import { GetStaticProps, NextPage } from "next";
import { Month } from "@models/store";
import env from "@utils/env";
import SamLogin from "@utils/SamLogin";

const Home: NextPage<{ shifts: Month }> = ({ shifts }) => {
	return <pre>{JSON.stringify(shifts, null, "\t")}</pre>;
};

export const getStaticProps: GetStaticProps = async () => {
	const sam = new SamLogin({
		username: env.ahusername,
		password: env.ahpassword
	});

	await sam.login();

	const shifts = await sam.timesheet({ date: new Date() });

	return {
		props: {
			shifts
		}
	};
};

export default Home;
