export default function NoLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center ">
            <div className="container flex flex-col items-center justify-center gap-12">
                {children}
            </div>
        </main>
    );
}
