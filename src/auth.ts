import NextAuth from "next-auth";
import type { DefaultSession, User, NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

interface TokenUser extends User {
    id: string;
    accessToken: string;
    refreshToken: string;
    expires_at: number;
}

interface SessionWithToken extends DefaultSession {
    accessToken?: string;
    refreshToken?: string;
    expires_at?: number;
}

export const authConfig = {
    providers: [
        Credentials({
            id: "keycloak-credentials",
            name: "Username & password",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials) {
                const res = await fetch(
                    `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        body: new URLSearchParams({
                            grant_type: "password",
                            client_id: process.env.KEYCLOAK_CLIENT_ID!,
                            client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
                            username: credentials?.username as string,
                            password: credentials?.password as string,
                        }),
                    });

                const data = await res.json();

                if (res.ok && data.access_token) {
                    console.log("Keycloak credentials login successful", data);
                    return {
                        id: data.sub ?? credentials?.username,
                        name: data.name ?? data.preferred_username,
                        email: data.email,
                        accessToken: data.access_token,
                        refreshToken: data.refresh_token,
                        expires_at: Math.floor(Date.now() / 1000) + data.expires_in
                    };
                }else {
                    console.error("Keycloak credentials login failed", data);
                    throw new Error(data.error_description || "Login failed");
                }

            },

        })
    ],
    session: { strategy: "jwt" },
//     callbacks: {
//         authorized({ auth }) {
//             return !!auth?.user;
//         },
//     },
// } satisfies NextAuthConfig;
    callbacks: {
        /**
         * 1) Persist anything you need into the JWT
         */
        async jwt({ token, user }) {
            // `user` is only defined on first sign-in
            if (user) {
                const tokenUser = user as TokenUser;
                token.id           = tokenUser.id;
                token.accessToken  = tokenUser.accessToken;
                token.refreshToken = tokenUser.refreshToken;
                token.expires_at   = tokenUser.expires_at;
            }
            return token;
        },

        /**
         * 2) Expose what the client/server should receive in `session`
         */
        async session({ session, token }) {
            const sessionWithToken = session as SessionWithToken;
            sessionWithToken.user = {
                ...(sessionWithToken.user ?? {}),
                id:   token.id as string,
                name: token.name as string,
                email: token.email as string
            };

            // Optional: surface the access token if your UI/API needs it
            sessionWithToken.accessToken  = token.accessToken as string | undefined;
            sessionWithToken.refreshToken = token.refreshToken as string | undefined;
            sessionWithToken.expires_at   = token.expires_at as number | undefined;

            return session;
        },

        /**
         * Your existing route-protection logic stays the same
         */
        authorized({ auth }) {
            return !!auth?.user;
        }
    }
} satisfies NextAuthConfig;


export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export const { GET, POST } = handlers;