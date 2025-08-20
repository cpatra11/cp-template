import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByEmail } from "./lib/data/user";
import bcrypt from "bcryptjs";

// Determine if the code is running in middleware/edge context
const isEdgeRuntime =
  typeof process.env.NEXT_RUNTIME === "string" &&
  process.env.NEXT_RUNTIME === "edge";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        // Ensure credentials have expected shape at runtime
        const email =
          typeof credentials?.email === "string" ? credentials.email : null;
        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : null;
        if (!email || !password) return null;

        const user = await getUserByEmail(email);
        if (!user || !user.password) return null;

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return null;

        // Normalize fields
        return {
          ...user,
          provider: user.provider ?? undefined,
          image: user.image ?? null,
        } as any;
      },
    }),
  ],
  // Only use Prisma adapter in non-edge environments and configure it correctly
  adapter: isEdgeRuntime ? undefined : PrismaAdapter(prisma),
  // Use JWT session strategy which is compatible with Edge
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
    error: "/auth/error", // Add error page
  },
  debug: process.env.NODE_ENV === "development", // Enable debugging in development
  callbacks: {
    // Add payment status to the JWT token
    jwt: async ({ token, user, account }) => {
      if (user) {
        if (user.id) token.id = user.id;
        if (user.email) token.email = user.email;

        // Only add provider if it exists
        if (account) {
          token.provider = account.provider;
        } else {
          token.provider = "credentials";
        }

        // Get payment status from database and add to token
        try {
          if (user.id) {
            // Make sure user.id exists
            const userWithPayment = await prisma.user.findUnique({
              where: {
                id: user.id,
              },
              select: {
                hasPaid: true,
              },
            });

            token.hasPaid = userWithPayment?.hasPaid || false;
          }
        } catch (error) {
          console.error("Error getting payment status:", error);
          token.hasPaid = false;
        }
      }
      return token;
    },

    // Pass payment status to the client session
    session: async ({ session, token }) => {
      if (session?.user && token) {
        session.user.id = token.id as string;
        session.user.hasPaid = token.hasPaid as boolean;
        if (token.provider) {
          session.user.provider = token.provider as string;
        }
      }
      return session;
    },
    redirect({ url, baseUrl }) {
      console.log("Auth redirect called:", { url, baseUrl });

      // Simple rule: Always go to dashboard after successful login
      if (
        url === baseUrl ||
        url.includes("/sign-in") ||
        url === `${baseUrl}/`
      ) {
        console.log("Redirecting to dashboard");
        return `${baseUrl}/dashboard`;
      }

      // If URL starts with baseUrl, allow it
      if (url.startsWith(baseUrl)) {
        return url;
      }

      // Default to baseUrl
      return baseUrl;
    },
  },
});
