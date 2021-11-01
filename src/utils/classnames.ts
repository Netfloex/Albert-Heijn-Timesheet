export const cx = (...input: (string | boolean)[]): string => {
	return input.filter(Boolean).join(" ");
};
