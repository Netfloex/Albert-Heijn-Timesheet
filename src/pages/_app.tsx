import "@styles/globals.scss";

import type { AppProps } from "next/app";

const App = ({ Component, pageProps }: AppProps): JSX.Element => (
	<Component {...pageProps} />
);
export default App;
