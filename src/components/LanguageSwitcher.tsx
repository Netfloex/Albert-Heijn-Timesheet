import styles from "./LanguageSwitcher.module.scss";

import { DateTime } from "luxon";
import Link from "next/link";
import { useRouter } from "next/router";
import { Children, FC, useState } from "react";

import { useOnClickOutside } from "@hooks";

import { cx, languageOf } from "@utils";

export const LanguageSwitcher: FC = () => {
	const { locales, locale, asPath } = useRouter();
	const [open, setOpen] = useState<boolean>(false);

	const outsideRef = useOnClickOutside(() => {
		setOpen(false);
	});
	if (!locale || !locales) {
		return <></>;
	}

	return (
		<div
			ref={outsideRef}
			className={cx(styles.languageWrapper, open ? false : styles.closed)}
		>
			<div className={styles.popup}>
				{Children.map(locales, (loc) => (
					<Link
						locale={loc}
						href={asPath}
						className={loc == locales[0] ? styles.first : undefined}
						onClick={(): void => {
							setOpen(false);
							document.cookie = `NEXT_LOCALE=${loc}; expires=${DateTime.now()
								.plus({ years: 10 })
								.toHTTP()}`;
						}}
					>
						<span suppressHydrationWarning>{languageOf(loc)}</span>
					</Link>
				))}
			</div>
			<div
				className={styles.button}
				onClick={(): void => setOpen((state) => !state)}
			>
				<span suppressHydrationWarning>{languageOf(locale)}</span>
				<span className={styles.caret} />
			</div>
		</div>
	);
};
