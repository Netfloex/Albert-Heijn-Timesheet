import "@styles/globals.scss"

import { DefaultSeo } from "next-seo"
import { ThemeProvider } from "next-themes"
import type { AppProps } from "next/app"
import Head from "next/head"

import SEO from "@seo-default"

const App = ({ Component, pageProps }: AppProps): JSX.Element => (
	<>
		<DefaultSeo {...SEO} />
		<Head>
			<link rel="manifest" href="/manifest.json" />
		</Head>
		<ThemeProvider defaultTheme="system" attribute="class">
			<Component {...pageProps} />
		</ThemeProvider>
	</>
)

export default App
