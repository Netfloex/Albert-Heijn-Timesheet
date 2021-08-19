import "@styles/globals.scss";

import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";

const App = ({ Component, pageProps }: AppProps): JSX.Element => (
	<ThemeProvider defaultTheme="system" attribute="class">
		<Component {...pageProps} />
	</ThemeProvider>
);
export default App;
