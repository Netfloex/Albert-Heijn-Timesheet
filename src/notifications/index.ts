import { apprise } from "./apprise";
import {
	notifiers,
	notifyStart,
	preNotificationMinutes,
	updateNotificationHours
} from "@env";

import exec from "exec-sh";
import { writeFile } from "fs-extra";
import { DateTime } from "luxon";
import { homedir } from "os";
import { join } from "path";

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
		const cron = interval.start
			.minus({ minutes: preNotificationMinutes })
			.toFormat(cronFormat);

		const command = apprise({
			title: `**${formatInterval(interval, "T")}**`
		});

		return `${cron} ${command}`;
	});

	cronList.push(
		`* */${updateNotificationHours} * * * node /app/notifications.js`
	);

	await exec.promise(
		`echo "${cronList
			.map((cmd) => `${cmd} >> /app/cron.log `)
			.join("\n")}" | crontab -`
	);

	log.ScheduledNotifications(upcomingShifts.length);

	if (notifyStart)
		await exec.promise(
			apprise({
				title: `Scheduled ${upcomingShifts.length} Notifications`,
				body: `**Configuration**\n\nYou will receive a notification **${preNotificationMinutes}** minutes before a shift starts.\nThe schedule updates every **${updateNotificationHours}** hours.`
			})
		);
};

main().catch((error) => {
	console.error(error);
});
