import { RefObject, useEffect, useRef } from "react"

export const useOnClickOutside = (
	handler: () => void,
): RefObject<HTMLDivElement> => {
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const listener = (event: MouseEvent | TouchEvent): void => {
			if (!ref.current || ref.current.contains(event.target as Node)) {
				return
			}
			handler()
		}

		document.addEventListener("mousedown", listener)
		document.addEventListener("touchstart", listener)

		return (): void => {
			document.removeEventListener("mousedown", listener)
			document.removeEventListener("touchstart", listener)
		}
	}, [ref, handler])

	return ref
}
