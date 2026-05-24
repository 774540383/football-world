import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma, isPrismaAvailable } from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: isPrismaAvailable() ? PrismaAdapter(prisma) : undefined,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        if (!isPrismaAvailable()) {
          const adminEmail = "admin@footballworld.com";
          const adminPass = "admin123";
          if (
            credentials.email === adminEmail &&
            credentials.password === adminPass
          ) {
            return {
              id: "admin-fallback",
              email: adminEmail,
              name: "Admin",
              image: null,
              role: "ADMIN",
            };
          }
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });
          if (!user || !user.passwordHash) return null;

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          );

          if (!isValid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        if (user.id) token.id = user.id;
        token.role = (user as any).role || "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.email) return null;

  if (!isPrismaAvailable()) {
    if (session.user.email === "admin@footballworld.com") {
      return {
        id: "admin-fallback",
        name: "Admin",
        email: "admin@footballworld.com",
        role: "ADMIN",
        image: null,
      };
    }
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    return user;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return user;
}
