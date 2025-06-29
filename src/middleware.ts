import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    if (!req.auth) {
        const signInUrl = new URL("/api/auth/signin", req.url);
        signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname); // where to return after login
        signInUrl.searchParams.set("prompt", "login");
        return NextResponse.redirect(signInUrl);
    }
});

export const config = {
    matcher: ["/dashboard/:path*"],
};