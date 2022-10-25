export const languageOf = (languageCode: string): string => {
	if ("DisplayNames" in Intl) {
		return (
			new Intl.DisplayNames([languageCode], {
				type: "language"
			}).of(languageCode.toUpperCase()) || languageCode
		);
	}
	return languageCode;
};
