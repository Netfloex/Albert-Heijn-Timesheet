import { apprise } from "./apprise";
import { notifiers, NotifyStart } from "@env";

import exec from "exec-sh";
import { writeFile } from "fs-extra";
import { DateTime, Duration } from "luxon";
import { homedir } from "os";
import { join } from "path";
import { title } from "process";

import { getTimesheet, log } from "@server";
import { isError, parseTimesheet } from "@utils";

import { cronFormat, formatInterval } from "@formats";

const main = async (): Promise<void> => {
	log.isNotifications.value = true;
	log.NotifStart();

	if (notifiers.length == 0) {
		return log.NoNotifiers();
	}

	await writeFile(join(homedir(), ".apprise"), notifiers.join("\n"));

	const timesheet = await getTimesheet();
	if (isError(timesheet)) {
		throw timesheet;
	}

	const { shifts } = parseTimesheet(timesheet);

	const upcomingShifts = shifts.filter(
		(shift) => shift.start > DateTime.now()
	);

	const cronList = upcomingShifts.map(({ interval }) => {
		const cron = interval.start.minus({ minutes: 60 }).toFormat(cronFormat);
		const command = apprise({
			title: `**${formatInterval(interval, "T")}**`
		});

		return `${cron} ${command}`;
	});

	await exec.promise(`echo "${cronList.join("\n")}" | crontab -`);

	log.ScheduledNotifications(upcomingShifts.length);
	if (NotifyStart)
		await exec.promise(
			apprise({
				title: `Scheduled ${upcomingShifts.length} Notifications`
			})
		);
};

main().catch((error) => {
	console.error(error);
});
