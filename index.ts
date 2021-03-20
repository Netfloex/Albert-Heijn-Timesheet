console.clear();
console.log("Started");
import express from "express";
import SamLogin from "./bin/SamLogin";
import config from "./config.json";

const Sam = new SamLogin(config);
const app = express();
console.time("init");
Sam.init().then(() => {
	console.timeEnd("init");

	app.get("/appie", async (_, res) => {
		console.time("Appie");
		res.json(await Sam.login());
		console.timeEnd("Appie");
	});
	app.listen(4444);
});
