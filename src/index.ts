import express from "express";
import colors from "chalk";
import appie from "./pages/appie";
import cors from "cors";
import env from "./bin/env";

const app = express();

console.log(colors.green("Started"));

app.get("/", (_, res) =>
	res.redirect(env.redirect ?? "https://github.com/Netfloex/Api")
);

if (env.cors) {
	app.use(
		cors({
			origin: env.cors
		})
	);
}

app.get("/appie", appie);

app.listen(env.port ?? 3000);
