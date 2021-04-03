import { RequestHandler } from "express";
import SamLogin from "../bin/SamLogin";
import config from "../config.json";

const sam = new SamLogin(config);
sam.init();

const Appie: RequestHandler = async (_, res) => {
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
};
export default Appie;
