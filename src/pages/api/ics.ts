import { NextApiHandler } from "next"

import { getTimesheet, store, timesheetToIcs } from "@server"
import { isError, parseTimesheet } from "@utils"

const Ics: NextApiHandler = async (req, res) => {
	await store.init()

	try {
		const timesheet = await getTimesheet()

		if (isError(timesheet)) {
			return res.status(500).json(timesheet)
		}

		const allShifts = Object.values(store.data.shifts).flatMap(
			(e) => e.parsed,
		)

		const parsed = parseTimesheet({
			parsed: allShifts,
			updated: timesheet.updated,
		})

		const ics = timesheetToIcs(parsed)

		return res.end(ics)
	} catch (error) {
		res.status(500).end("Unexpected Error")

		throw error
	}
}

export default Ics
