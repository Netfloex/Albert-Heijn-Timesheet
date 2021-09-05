import { Settings } from "luxon";
import { useRouter } from "next/router";

export const useLocale = (): string => {
	const { locale } = useRouter();
	if (!locale) {
		throw new Error("No locale in useRouter");
	}
	Settings.defaultLocale = locale;
	return locale;
};
