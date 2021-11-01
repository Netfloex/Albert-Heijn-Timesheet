import styles from "./LanguageSwitcher.module.scss";

import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useState, Children } from "react";
import { cx } from "src/utils/classnames";

export const LanguageSwitcher: FC = () => {
	const { locales, locale } = useRouter();
	const [open, setOpen] = useState<boolean>(false);

	return (
		<div className={cx(styles.languageWrapper, open || styles.closed)}>
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
			<div className={styles.button} onClick={(): void => setOpen(!open)}>
				{locale}
				<span className={styles.caret} />
			</div>
		</div>
	);
};
