import SEO from "@src/next-seo.config";

import "@styles/globals.scss";

import { DefaultSeo } from "next-seo";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";

const App = ({ Component, pageProps }: AppProps): JSX.Element => (
	<ThemeProvider defaultTheme="system" attribute="class">
		<DefaultSeo {...SEO} />
		<Component {...pageProps} />
	</ThemeProvider>
);
export default App;
