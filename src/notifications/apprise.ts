export const apprise = ({
	title,
	body = ""
}: {
	title: string;
	body?: string;
}): string => `apprise -t '${title}' -b '${body}'`;
