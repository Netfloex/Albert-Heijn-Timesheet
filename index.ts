console.clear();
import express from "express";
import SamLogin from "./bin/SamLogin";
import config from "./config.json";
import colors from "colors/safe";

const sam = new SamLogin(config);
const app = express();

sam.init().then(() => {
	console.log(colors.green("Started"));
	app.get("/appie", async (_, res) => {
		console.time("Appie");

		sam.login()
			.then(async () => {
				var ts = await sam.timesheet();
				res.json(ts);
			})
			.catch(e => {
				if (e == true) {
					res.json({ error: "Password Incorrect" });
				}
				throw e;
			})
			.finally(() => {
				console.timeEnd("Appie");
			});
	});
	app.listen(4444);
});
