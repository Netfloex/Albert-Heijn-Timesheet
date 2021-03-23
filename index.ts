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
				var ts = [sam.timesheet()];
				if (new Date().getDate() >= 15) {
					const now = new Date();
					var nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
					ts.push(sam.timesheet(nextMonth));
				}
				var resolved = await Promise.all(ts);

				res.json({
					updated: resolved[0].updated,
					parsed: resolved.flatMap(t => t.parsed),
				});
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
