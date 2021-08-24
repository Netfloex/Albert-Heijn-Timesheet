import { NextApiHandler } from "next";

import getTimesheet from "@utils/getTimesheet";

const Appie: NextApiHandler = async (req, res) => {
	res.json(await getTimesheet());
};

export default Appie;
