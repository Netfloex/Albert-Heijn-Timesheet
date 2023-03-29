// @ts-check

/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */

module.exports = {
	trailingComma: "none",
	useTabs: true,
	semi: true,
	singleQuote: false,
	tabWidth: 4,
	printWidth: 80,
	arrowParens: "always",
	importOrderSeparation: true,
	importOrder: [
		".*scss$",
		"^\\w+",
		"^@components.*",
		"^@hooks$",
		"^(@lib)|(@utils)|(@server)$",
		"^@formats$",
		"^@seo-default$",
		"^@models/.*"
	]
};
