import { getAuth, withClerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL || "";

const publicPaths = ["/"];

const isPublic = (path: string) => {
    return publicPaths.find((x) =>
        path.match(new RegExp(`^${x}$`.replace("*$", "($|/)")))
    );
};

export default withClerkMiddleware((request: NextRequest) => {
    const { userId } = getAuth(request);

    // if the user is signed in and tries to access landing page redirect them to the home page
    if (request.nextUrl.pathname === "/" && userId) {
        const homePage = new URL("/home", request.url);
        return NextResponse.redirect(homePage);
    }

    if (isPublic(request.nextUrl.pathname)) {
        return NextResponse.next();
    }
    // if the user is not signed in redirect them to the sign in page.

    if (!userId) {
        // redirect the users to /pages/sign-in/[[...index]].ts

        return NextResponse.redirect(`${NEXT_PUBLIC_URL}/`);
    }
    return NextResponse.next();
});

// Stop Middleware running on static files and public folder
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/image (image optimization files)
         * - _next/static (static files)
         * - favicon.ico (favicon file)
         * - public /images folder
         * - public /assets folder
         */
        "/((?!_next/image|_next/static|favicon.ico|images|assets/*).*)",
        "/",
    ],
};
