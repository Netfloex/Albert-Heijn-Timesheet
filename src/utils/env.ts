import Env from "@models/env";

const required = ["AHUSERNAME", "AHPASSWORD"];
var unset = required.filter((env) => !process.env[env]);

const e = process.env;

const env: Env = {
	ahusername: e.AHUSERNAME,
	ahpassword: e.AHPASSWORD,

	path: e.DBPATH,
	port: e.PORT,
	redirect: e.REDIRECT,
	cors: e.CORS,

	complete: true
};

if (unset.length) {
	console.warn(`${unset.join(", ")} environment variable(s) is not set.`);
	env.complete = false;
}

export default env;
