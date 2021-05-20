import { RequestHandler } from "express";
import SamLogin from "../bin/SamLogin";

import env from "../bin/env";

const sam = new SamLogin({
	username: env.ahusername,
	password: env.ahpassword
});
sam.init();

const Appie: RequestHandler = async (_, res) => {
	console.time("Appie");

	sam.login()
		.then(async error => {
			var cachedOnly = error != false;

			var ts = [sam.timesheet({ cachedOnly })];
			if (new Date().getDate() >= 15) {
				const now = new Date();
				var nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
				ts.push(sam.timesheet({ date: nextMonth, cachedOnly }));
			}

			var resolved = (await Promise.all(ts)).filter(Boolean);

			if (!resolved[0]) {
				return res.json({ error });
			}
			res.json({
				updated: resolved[0].updated,
				error,
				parsed: resolved.flatMap(t => t.parsed)
			});
		})
		.finally(() => {
			console.timeEnd("Appie");
		});
};
export default Appie;
