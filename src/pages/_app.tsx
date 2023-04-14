import { dark } from "@clerk/themes";
import { ClerkProvider } from "@clerk/nextjs";
import { type AppType } from "next/app";
import Layout from "~/components/Layout";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
    const appearance = { baseTheme: dark };

    return (
        <ClerkProvider appearance={appearance} {...pageProps}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </ClerkProvider>
    );
};

export default MyApp;
