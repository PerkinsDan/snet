import { dark } from "@clerk/themes";
import { ClerkProvider } from "@clerk/nextjs";
import { type AppType } from "next/app";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
    const appearance = { baseTheme: dark };

    return (
        <ClerkProvider appearance={appearance} {...pageProps}>
            <Component {...pageProps} />
        </ClerkProvider>
    );
};

export default MyApp;
