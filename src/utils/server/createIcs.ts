import { DateTime } from "luxon";

export interface CalendarOptions {
	name: string;
	updated: DateTime;
}

export interface IcsEvent {
	start: DateTime;
	end: DateTime;
	description: string;
	summary: string;
}

const formatTime = (date: DateTime): string =>
	date.set({ millisecond: 0 }).toISO({
		includeOffset: false,
		suppressMilliseconds: true,
		format: "basic"
	});

export const createIcs = (
	options: CalendarOptions,
	events: IcsEvent[]
): string => {
	const ics = [
		"BEGIN:VCALENDAR",
		"VERSION:2.0",
		"PRODID:-//netfloex//appie//NL",
		`NAME:${options.name}`,
		`X-WR-CALNAME:${options.name}`
	];

	events.forEach((event) => {
		ics.push(
			...[
				"BEGIN:VEVENT",
				`DTSTAMP:${formatTime(options.updated)}`,
				`DTSTART:${formatTime(event.start)}`,
				`DTEND:${formatTime(event.end)}`,
				`SUMMARY:${event.summary}`,
				`DESCRIPTION:${event.description}`,
				"STATUS:CONFIRMED",
				`UID:${event.end.toMillis() + "-" + event.start.toMillis()}`,
				"END:VEVENT"
			]
		);
	});

	ics.push("END:VCALENDAR");

	return ics.join("\r\n");
};
