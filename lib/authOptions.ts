// lib/authOptions.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Get user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            student: true,
            assignedClasses: true,
            school: true,
          },
        });

        if (!user || !user.password) return null;

        // Compare password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // This gets returned into the JWT callback
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,              // SUPER_ADMIN | ADMIN | TEACHER | STUDENT
          schoolId: user.schoolId,
          mobile: user.mobile,
          studentId: user.student?.id || null,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;              // stores SUPER_ADMIN
        token.schoolId = user.schoolId;
        token.mobile = user.mobile;
        token.studentId = user.studentId;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        role: token.role as "SUPER_ADMIN" | "ADMIN" | "TEACHER" | "STUDENT",
        schoolId: token.schoolId as string | null,
        mobile: token.mobile as string | null,
        studentId: token.studentId as string | null,
      };
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
