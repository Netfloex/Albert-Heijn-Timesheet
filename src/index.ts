import express from "express";
import colors from "chalk";
import appie from "./pages/appie";

import env from "./bin/env";

const app = express();

console.log(colors.green("Started"));

app.get("/", (req, res) => res.redirect("https://github.com/Netfloex/Api"));
app.get("/appie", appie);

app.listen(env.port ?? 3000);
