import { timesheetCacheDuration } from "@env";

import { DateTime } from "luxon";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import type { FC } from "react";
import React from "react";
import { z } from "zod";

import { TimesheetProvider } from "@components/TimesheetProvider";
import { ErrorPage, Incomplete, Loading } from "@components/pages";

import { getTimesheet } from "@server";
import { TimesheetError } from "@utils";

import { ErrorType } from "@models/ErrorType";
import { Timesheet } from "@models/Schema";

const paramsScheme = z.object({
	year: z.preprocess(
		(year) => (typeof year == "string" ? parseInt(year) : false),
		z.number().step(1).min(1).max(10_000)
	),
	month: z.preprocess(
		(month) => (typeof month == "string" ? parseInt(month) : false),
		z.number().step(1).min(1).max(12)
	)
});
type MonthYear = z.infer<typeof paramsScheme>;
type PropsWithoutError =
	| Record<string, never>
	| { timesheet: Timesheet; query: MonthYear };
type PropsWithError = PropsWithoutError | TimesheetError;

const isError = (props: PropsWithError): props is TimesheetError =>
	"error" in props;

const normalizeMonthYear = ({ year, month }: MonthYear): string => {
	if (month == 0) {
		year--;
		month = 12;
	}
	if (month == 13) {
		year++;
		month = 1;
	}
	return `${year}/${month}`;
};

export const MonthViewComponent: FC<{ props: PropsWithoutError }> = ({
	props
}) => {
	const { isFallback } = useRouter();
	if (!("timesheet" in props) && isFallback) {
		return <Loading />;
	}
	return (
		<>
			<Link
				href={`../${normalizeMonthYear({
					year: props.query.year,
					month: props.query.month - 1
				})}`}
			>
				Previous
			</Link>
			<Link
				href={`../${normalizeMonthYear({
					year: props.query.year,
					month: props.query.month + 1
				})}`}
			>
				Next
			</Link>
			<pre>{JSON.stringify(props.timesheet, null, "\t")}</pre>
		</>
	);
};

const MonthView: NextPage<PropsWithError> = (props) => {
	return (
		<TimesheetProvider
			timesheet={isError(props) ? undefined : props.timesheet}
		>
			{isError(props) ? (
				props.type == ErrorType.Incomplete ? (
					<Incomplete
						element={
							<>Not yet available, please refresh the page. </>
						}
					/>
				) : (
					<ErrorPage timesheet={props} />
				)
			) : (
				<MonthViewComponent props={props} />
			)}
		</TimesheetProvider>
	);
};

export const getStaticProps: GetStaticProps = async (context) => {
	const { params } = context;

	const result = paramsScheme.safeParse(params);

	if (!result.success) {
		return {
			notFound: true
		};
	}

	const when = DateTime.fromObject({
		year: result.data.year,
		month: result.data.month
	});

	const timesheet = await getTimesheet(when);

	let revalidate: number | undefined = timesheetCacheDuration;

	if ("error" in timesheet) {
		if (timesheet.type == ErrorType.Incomplete) {
			revalidate = 1;
		} else {
			revalidate = undefined;
		}
	}

	return {
		props: { timesheet, query: result.data },
		revalidate
	};
};

export const getStaticPaths: GetStaticPaths = () => {
	return {
		fallback: true,
		paths: []
	};
};

export default MonthView;
