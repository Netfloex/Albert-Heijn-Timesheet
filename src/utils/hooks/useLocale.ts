import { useRouter } from "next/router"

export const useLocale = (): string => {
	const { locale } = useRouter()
	if (!locale) {
		throw new Error("No locale in useRouter")
	}
	return locale
}
