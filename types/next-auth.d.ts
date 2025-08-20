import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      hasPaid?: boolean;
      provider?: string; // Add provider tracking
    };
  }

  interface User {
    provider?: string;
    hasPaid?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    hasPaid?: boolean;
    provider?: string; // Add provider tracking
  }
}
