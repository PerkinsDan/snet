import { withClerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withClerkMiddleware((req: NextRequest) => {
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
