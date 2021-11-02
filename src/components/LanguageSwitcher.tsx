import styles from "./LanguageSwitcher.module.scss";

import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useState, Children } from "react";

import { useOnClickOutside } from "@hooks";

import { cx } from "@utils";

export const LanguageSwitcher: FC = () => {
	const { locales, locale } = useRouter();
	const [open, setOpen] = useState<boolean>(false);

	const outsideRef = useOnClickOutside(() => {
		setOpen(false);
	});

	return (
		<div
			ref={outsideRef}
			className={cx(styles.languageWrapper, open || styles.closed)}
		>
			<div className={styles.popup}>
				{Children.map(locales, (locale) => (
					<Link locale={locale} href="/">
						<a
							className={styles.locale}
							onClick={(): void => setOpen(false)}
						>
							{locale}
						</a>
					</Link>
				))}
			</div>
			<div
				className={styles.button}
				onClick={(): void => setOpen((state) => !state)}
			>
				{locale}
				<span className={styles.caret} />
			</div>
		</div>
	);
};
