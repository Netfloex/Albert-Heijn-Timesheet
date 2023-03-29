import { Settings } from "luxon"

import { useLocale } from "@hooks"

export const useLuxonLocale = <Returns>(cb: () => Returns): Returns => {
	const oldLocale = Settings.defaultLocale
	Settings.defaultLocale = useLocale()
	const returns: Returns = cb()
	Settings.defaultLocale = oldLocale
	return returns
}
