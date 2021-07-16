// @ts-check
const { join } = require("path");

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/

module.exports = {
	eslint: {
		ignoreDuringBuilds: true
	},
	sassOptions: {
		includePaths: [join(__dirname, "src", "styles")]
	}
};
