import { NextSeo } from "next-seo";
import { FC } from "react";

import { Footer, Schedule, Upcoming } from "@components/layout";

export const Dashboard: FC = () => (
	<>
		<NextSeo title="Timesheet" />

		<Upcoming />
		<Schedule />

		<Footer />
	</>
);
