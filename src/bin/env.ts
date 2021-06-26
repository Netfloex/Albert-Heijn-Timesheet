import Env from "../models/env";

const required = ["AHUSERNAME", "AHPASSWORD"];
var unset = required.filter((env) => !process.env[env]);

if (unset.length) {
	throw new Error(`${unset.join(", ")} environment variable(s) is not set.`);
}

const e = process.env;

const env: Env = {
	ahusername: e.AHUSERNAME,
	ahpassword: e.AHPASSWORD,

	path: e.DBPATH,
	port: e.PORT
};

export default env;
