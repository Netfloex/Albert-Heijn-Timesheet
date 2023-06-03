import { NextApiHandler } from "next"

import { getTimesheet } from "@server"

const Appie: NextApiHandler = async (req, res) => {
	return res.json(await getTimesheet())
}

export default Appie
