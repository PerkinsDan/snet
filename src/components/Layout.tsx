import { PencilIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Profile from "./Profile";
import { useUser } from "@clerk/nextjs";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { user, isSignedIn } = useUser();
    if (!isSignedIn) {
        return null;
    }

    const links = [
        { name: "Home", href: "/" },
        { name: "Subjects", href: "/subjects" },
        { name: "Schools", href: "/schools" },
        { name: "Profile", href: `/profiles/${user.id}` },
        { name: "Create Post", href: "/create-post", className: "bg-blue-500" },
    ];

    return (
        <>
            <div className="grid w-full grid-cols-1 md:grid-cols-3">
                <div className="sticky top-0 hidden h-screen w-60 flex-col justify-between justify-self-end border border-slate-800 p-4 text-white md:flex">
                    <div className="flex flex-col">
                        <Link href="/" className="px-4 py-4 text-3xl font-bold">
                            SNET
                        </Link>
                        {links.map((link) => (
                            <Link
                                href={link.href}
                                key={link.name}
                                className={`h-max px-4 py-5 text-lg rounded-lg ${link.className || ""}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <div className="self-center">
                        <Profile />
                    </div>
                </div>
                <main className="container flex w-full max-w-2xl flex-col items-center justify-center gap-12 justify-self-center md:col-span-2 md:justify-self-start">
                    {children}
                </main>
            </div>
            <div className="absolute sticky bottom-0 flex w-screen justify-between p-6 backdrop-blur backdrop-blur-lg md:hidden lg:backdrop-blur-none xl:w-full">
                <Link
                    href="create-post"
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 bg-blue-500 shadow-md shadow-blue-500/30 transition hover:bg-blue-700"
                >
                    <PencilIcon className="h-6 w-6 text-white" />
                </Link>
            </div>
        </>
    );
}
