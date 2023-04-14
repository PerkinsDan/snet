import Head from "next/head";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Head>
                <title>SNET</title>
                <meta name="description" content="The best school network" />
                <link rel="icon" href="/favicon.ico" />
                <meta name="theme-color" content="#030712" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-center ">
                <div className="container flex flex-col items-center justify-center gap-12">
                    {children}
                </div>
            </main>
        </>
    );
}
