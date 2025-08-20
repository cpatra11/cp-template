import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./lib/data/user";
import { LoginSchema } from "./schemas";

export default {
  providers: [
    Credentials({
      async authorize(credentials, request) {
        const validatedCredentials = LoginSchema.safeParse(credentials);

        if (!validatedCredentials.success) {
          return null;
        }

        const { email, password } = validatedCredentials.data;
        //  console.log("password", password)

        const user = await getUserByEmail(email);
        if (!user || !user.password) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) {
          // Normalize nullable fields to match NextAuth User type expectations
          return {
            ...user,
            provider: user.provider ?? undefined,
            image: user.image ?? null,
          } as any;
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    redirect: ({ url, baseUrl }) => {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // After sign in, redirect to dashboard
      else if (url === baseUrl) return `${baseUrl}/dashboard`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
} satisfies NextAuthConfig;
