import { dark } from "@clerk/themes";
import { ClerkProvider } from "@clerk/nextjs";
import { type AppType } from "next/app";
import Head from "next/head";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
    const appearance = { baseTheme: dark };

    return (
        <ClerkProvider appearance={appearance} {...pageProps}>
            <Head>
                <title>SNET</title>
                <meta name="description" content="The best school network" />
                <link rel="icon" href="/favicon.ico" />
                <meta name="theme-color" content="#030712" />
            </Head>
            <Component {...pageProps} />
        </ClerkProvider>
    );
};

export default MyApp;
