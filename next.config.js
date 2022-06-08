// @ts-check
const { join } = require("path");
const withPWA = require("next-pwa");

const languages = [
	"ar",
	"cs",
	"da",
	"de",
	"el",
	"en",
	"es",
	"fi",
	"fr",
	"he",
	"hi",
	"hu",
	"id",
	"it",
	"ja",
	"ko",
	"nl",
	"no",
	"pl",
	"pt",
	"ro",
	"ru",
	"sk",
	"sv",
	"th",
	"tr",
	"zh"
];

/**
 * @type {import('next').NextConfig}
 **/

const config = {
	eslint: {
		ignoreDuringBuilds: true
	},
	sassOptions: {
		includePaths: [join(__dirname, "src", "styles")]
	},
	env: {
		TIMESHEET_CACHE: process.env.TIMESHEET_CACHE
	},
	i18n: {
		locales: languages,
		defaultLocale: "nl"
	},
	experimental: {
		outputStandalone: true
	}
};

module.exports = withPWA({
	pwa: {
		dest: "public",
		disable: process.env.NODE_ENV === "development"
	},
	...config
});
