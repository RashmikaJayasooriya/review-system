import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    providers: [
        Keycloak({
            clientId: process.env.KEYCLOAK_CLIENT_ID!,
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
            issuer: process.env.KEYCLOAK_ISSUER,
        }),
    ],
    session: { strategy: "jwt" },
    callbacks: {
        authorized({ auth }) {
            return !!auth?.user;
        },
    },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export const { GET, POST } = handlers;