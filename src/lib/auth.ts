import type { NextAuthOptions } from "next-auth";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/config/mongodb";
import Admin from "@/models/adminModel";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 14 * 24 * 60 * 60, // 7 day in seconds
    },
    jwt: {
        maxAge: 14 * 24 * 60 * 60, // 7 day in seconds
    },
    pages: {
        signIn: "/",
    },
    providers: [
        credentials({
            name: "Credentials",
            id: "credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectDB();
                const user = await Admin.findOne({
                    username: credentials?.username.toLowerCase(),
                }).select("+password");

                if (!user) throw new Error("Invalid username or password");

                const passwordMatch = await bcrypt.compare(
                    credentials!.password,
                    user.password
                );

                if (!passwordMatch)
                    throw new Error("Invalid username or password");

                return {
                    id: user._id,
                    name: user.name,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.name = user.name;
            }

            return token;
        },
        async session({ session, token }) {
            session.user = {
                name: token.name as string,
            };
            return session;
        },
    },
};
